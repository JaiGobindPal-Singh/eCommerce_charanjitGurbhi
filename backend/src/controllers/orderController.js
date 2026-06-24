import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import { verifyMongoId } from "../utils/mongo.utils.js"

export const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            deliveryDetails,
            paymentMode,
        } = req.body;

        //validate payment mode
        if (!paymentMode || !verifyMongoId(paymentMode)) {
            return res.status(400).json({ message: "invalid payment option" });
        }
        //validate delivery details
        if (!deliveryDetails || !deliveryDetails.deliveryAddress) {
            return res.status(400).json({ message: "delivery details required" });
        }
        if (!deliveryDetails.deliveryAddress.fullName ||
            !deliveryDetails.deliveryAddress.phoneNumber ||
            !deliveryDetails.deliveryAddress.fullAddress ||
            !deliveryDetails.deliveryAddress.city ||
            !deliveryDetails.deliveryAddress.state
        ) {
            return res.status(400).json({ message: "all delivery details are required" });
        }

        // Get cart
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                message: 'Cart not found'
            });
        }

        // Check cart is empty
        if (!cart.items?.length) {
            return res.status(400).json({
                message: 'Cart is empty'
            });
        }

        // Create order
        const order = await Order.create({
            user: userId,
            status: 'order_placed',
            statusHistory: [{
                status: 'order_placed'
            }],
            items: cart.items,
            billing: {
                paymentMode,
                charges: cart.billing.charges,
                totalBill: cart.billing.totalBill
            },
            deliveryDetails: deliveryDetails,
        });

        if (!order) {
            return res.status(400).json({ message: "unable to create order" });
        }
        // clear cart after successful order
        cart.items = [];
        cart.billing.charges = [];
        cart.billing.totalBill = 0;
        await cart.save();

        return res.status(201).json({
            message: 'Order created successfully',
            order: order._id
        });

    } catch (error) {
        console.error("error create order", error);
        return res.status(500).json({
            message: 'internal server error'
        });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const {
            status,
            cancellationReason
        } = req.body;

        if (!orderId || !verifyMongoId(orderId)) {
            return res.status(400).json({ message: "invalid order" });
        }
        // Find order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        // Prevent changing completed orders
        if (
            order.status === 'delivered' ||
            order.status === 'cancelled'
        ) {
            return res.status(400).json({
                message: `Cannot update a ${order.status} order`
            });
        }

        // Validate cancellation
        if (
            status === 'cancelled' &&
            !cancellationReason?.trim()
        ) {
            return res.status(400).json({
                message: 'Cancellation reason is required'
            });
        }

        // Skip if status is unchanged
        if (order.status === status) {
            return res.status(400).json({
                message: 'Order already has this status'
            });
        }

        // Update status
        order.status = status;

        // Handle cancellation
        if (status === 'cancelled') {
            order.cancellationReason = cancellationReason;
        }

        // Add history
        order.statusHistory.push({
            status
        });

        await order.save();
        return res.status(200).json({
            message: 'Order updated successfully',
            order
        });

    } catch (error) {
        console.error("error updating order status", error);
        return res.status(500).json({
            message: 'internal server error'
        });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        //fetching orders from db
        const orders = await Order.find({
            user: userId
        }).select('status items billing.totalBill createdAt').sort({ createdAt: -1 }).lean();

        return res.status(200).json({
            orders
        });
    } catch (error) {
        console.error("getuserorder ", error);
        return res.status(500).json({
            message: 'internal server error'
        });
    }
};

export const getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;
        //validating order id
        if (!orderId || !verifyMongoId(orderId)) {
            return res.status(400).json({ message: "invalid order" });
        }
        //fetching order
        const fullOrder = await Order.findOne({
            _id: orderId,
            user: userId
        }).populate('billing.paymentMode');

        if (!fullOrder) {
            return res.status(404).json({ message: "order does not exist" });
        }
        return res.status(200).json({ order: fullOrder });
    } catch (error) {
        console.log("error getting order details", error);
        return res.status(500).json({ message: "internal server error" });
    }
}
