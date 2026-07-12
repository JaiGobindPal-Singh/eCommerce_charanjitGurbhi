import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js"
import { verifyMongoId } from "../utils/mongo.utils.js";

export const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const userId = req.user.id;

        //mongo id and quantity verification
        if (!verifyMongoId(productId)) {
            return res.status(400).json({ error: "invalid product" });
        }
        if (quantity < 1) {
            return res.status(400).json({ error: "quantity is required" });
        }

        // Check product exists
        const product = await Product.findById(productId).lean();
        if (!product) {
            return res.status(404).json({
                error: "Product not found"
            });
        }

        // Find user's cart
        let cart = await Cart.findOne({ user: userId });

        // Create cart if it doesn't exist
        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [{
                    product: productId,
                    quantity,
                    priceAtAddition: product.price
                }]
            });
            await cart.save();

            //converting cart to object and _id to id
            const cartF = cart.toObject();
            cartF.id = cartF._id;
            delete cartF._id;
            delete cartF.__v;
            delete cartF.createdAt;
            delete cartF.updatedAt;

            return res.status(200).json({ success: true, cart: cartF });
        }

        // Check if product already exists
        const existingItem = cart.items.find(
            item => item.product.toString() === productId
        );

        //increase product quantity if product already in cart else add it in cart
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                product: productId,
                quantity,
                priceAtAddition: product.price
            });
        }
        cart.markModified('items');     //!DON'T Remove 

        await cart.save();

        //converting cart to object and _id to id
        const cartF = cart.toObject();
        cartF.id = cartF._id;
        delete cartF._id;
        delete cartF.__v;
        delete cartF.createdAt;
        delete cartF.updatedAt;

        return res.status(200).json({ success: true, cart: cartF });

    } catch (error) {
        // console.log("error in add cart controller", error);
        return res.status(500).json({
            error: "internal server error"
        });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        //validating inputs
        if (!productId || !userId) {
            return res.status(400).json({
                error: "product id and userId is required"
            });
        }
        //mongo id verification
        if (!verifyMongoId(productId)) {
            return res.status(400).json({ error: "invalid product" });
        }
        //accessing cart and validating
        const cart = await Cart.findOneAndUpdate(
            { user: userId },
            {
                $pull: {
                    items: { product: productId }
                }
            },
            { returnDocument: "after", runValidators: true }
        );
        //error if cart does not exist
        if (!cart) {
            return res.status(404).json({
                error: "Cart not found"
            });
        }
        //converting cart to object and _id to id
        const cartF = cart.toObject();
        cartF.id = cartF._id;
        delete cartF._id;
        delete cartF.__v;
        delete cartF.createdAt;
        delete cartF.updatedAt;

        return res.status(200).json({ success: true, cart: cartF });
    } catch (error) {
        // console.log("error removing item from cart", error);
        return res.status(500).json({ error: "internal server error" });
    }
};

export const clearCart = async (req, res) => {
    try {
        const userId = req.user.id
        const cart = await Cart.findOneAndUpdate(
            { user: userId },
            {
                $set: {
                    items: []
                }
            },
            { returnDocument: "after", runValidators: true }
        )
        if (!cart) {
            return res.status(400).json({ error: "cart does not exist" });
        }
        //converting cart to object and _id to id
        const cartF = cart.toObject();
        cartF.id = cartF._id;
        delete cartF._id;
        delete cartF.__v;
        delete cartF.createdAt;
        delete cartF.updatedAt;

        res.status(200).json({ success: true, cart: cartF });

    } catch (error) {
        // console.log("error clearCart", error);
        res.status(500).json({error: "internal server error" });
    }
}

export const updateQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;
        //validating req parameters
        if (!productId || !quantity) {
            return res.status(400).json({
                error: "quantity and product id is required"
            });
        }

        //mongo id verification
        if (!verifyMongoId(productId)) {
            return res.status(400).json({ error: "invalid product" });
        }
        //validating quantity
        if (quantity < 1) {
            return res.status(400).json({
                error: "Quantity must be at least 1"
            });
        }

        const cart = await Cart.findOneAndUpdate(
            {
                user: userId,
                "items.product": productId
            },
            {
                $set: { "items.$.quantity": quantity }
            },
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!cart) {
            return res.status(404).json({
                error: "Cart or product not found "
            });
        }
        //converting cart to object and _id to id
        const cartF = cart.toObject();
        cartF.id = cartF._id;
        delete cartF._id;
        delete cartF.__v;
        delete cartF.createdAt;
        delete cartF.updatedAt;

        return res.status(200).json({ success: true, cart: cartF });
    } catch (error) {
        // console.log("error in update quantity", error);
        return res.status(500).json({ error: "internal server error" });
    }
}

export const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        //fetching cart from db and populate product
        const cart = await Cart.findOne({ user: userId })
            .populate("items.product").lean();
        // Transform the cart items to include the product ID as 'id' instead of '_id'
        if (cart) {
            cart.items = cart.items.map(item => ({
                ...item,
                product: {
                    ...item.product,
                    id: item.product?._id,
                },
            }));

            //delete product unnecessary fields
            cart.items.forEach(item => {
                delete item.product._id;
                delete item.product.__v;
                delete item.product.createdAt;
                delete item.product.updatedAt;
            });
        }
        if (!cart) {
            return res.status(200).json({
                user: null,
                items: [],
                billing: {},
            });
        }

        
        return res.status(200).json({
            cart: {
                id: cart._id,
                user: cart.user,
                items: cart.items,
            }
        });
    } catch (error) {
        console.log("error fetching cart", error);
        return res.status(500).json({ error: "internal server error" });
    }
}

//method to create the new cart if user register or login during checkout
export const createCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { items = []} = req.body;
        let cart;
        cart = await Cart.findOneAndUpdate(
            { user: userId },
            {
                $set: {
                    items: items
                }
            },
            { returnDocument: "after", runValidators: true }
        )
        if (!cart) {
            cart = new Cart({
                user: userId,
                items: items,
            })
            await cart.save();
        }
        //converting cart to object and _id to id
            const cartF = cart.toObject();
            cartF.id = cartF._id;
            delete cartF._id;
            delete cartF.__v;
            delete cartF.createdAt;
            delete cartF.updatedAt;

            res.status(200).json({ success: true, cart: cartF });
    } catch (error) {
        console.log("error in create cart", error);
        res.status(500).json({ error: "internal server error" });
    }
}