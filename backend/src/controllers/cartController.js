import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js"

export const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const userId = req.user.id;

        // Check product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
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
            await cart.save();    //using this so middleware in mongoose execute properly
            return res.status(201).json({ message: "product added", cart });
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
        res.status(200).json({ message: "product added", cart });

    } catch (error) {
        console.log("error in cart controller", error);
        res.status(500).json({
            message: "internal server error"
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
                message: "product id and userId is required"
            });
        }
        //accessing cart and validating
        const cart = await Cart.findOneAndUpdate(
            { user: userId },
            {
                $pull: {
                    items: { product: productId }
                }
            },
            {new:true}
        );
        //error if cart does not exist
        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        res.status(200).json(cart);

    } catch (error) {
        console.log("error removing item from cart", error);
        res.status(500).json({ message: "internal server error" });
    }
};

export const clearCart = async(req,res) =>{
    try{
        const userId = req.user.id
        const cart = await Cart.findOneAndUpdate(
            { user: userId },
            {
                $set: {
                    items: []
                }
            },
            {new:true}
        )
        if(!cart){
            return res.status(200).json({message:"cart does not exist"});
        }
        return res.status(200).json({message:"cart cleared", cart});
    }catch(error){
        console.log("error clearCart", error);
        res.status(500).json({message:"internal server error"});
    }
}
//todo updateQuantity, getCart