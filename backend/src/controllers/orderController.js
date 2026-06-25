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
            !deliveryDetails.deliveryAddress.phone ||
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
        const status = String(req.body.status);
        const cancellationReason = String(req.body.cancellationReason || "");
        const {deliveryPartner, trackingId} = req.body;

        //validate order and status
        if (!orderId || !verifyMongoId(orderId)) {
            return res.status(400).json({ message: "invalid order" });
        }
        if(!status || !([
            'payment_confirmed',
            'processing',
            'out_for_delivery',
            'delivered',
            'cancelled'
        ].includes(status.trim()))){
            return res.status(400).json({message:"invalid status option"})
        }

        // Find order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        // Validate cancellation
        if (
            status == 'cancelled' &&
            cancellationReason.length < 3
        ) {
            return res.status(400).json({
                message: 'Cancellation reason is required'
            });
        }
        
        // Update status
        order.status = status;

        // Handle cancellation
        if (status === 'cancelled') {
            order.cancellationReason = cancellationReason;
        }

        // Handle out for delivery
        if( status === 'out_for_delivery'){
            order.deliveryDetails.deliveryPartner = deliveryPartner || "";
            order.deliveryDetails.trackingId = trackingId || "";
        }
        // Add history
        order.statusHistory.push({
            status
        });

        await order.save();
        return res.status(200).json({
            message: 'Order updated successfully',
            order: order._id
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
        }).select('status items billing.totalBill createdAt')
        .sort({ createdAt: -1 })
        .populate({
            path: 'items.product',
            select: 'name'
        })
        .lean();

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
        //validating order id
        if (!orderId || !verifyMongoId(orderId)) {
            return res.status(400).json({ message: "invalid order" });
        }
        //fetching order
        const fullOrder = await Order.findOne({
            _id: orderId,
        }).populate({path:'billing.paymentMode',select:'paymentOption'});

        if (!fullOrder) {
            return res.status(404).json({ message: "order does not exist" });
        }
        return res.status(200).json({ order: fullOrder });
    } catch (error) {
        console.log("error getting order details", error);
        return res.status(500).json({ message: "internal server error" });
    }
}
export const getPendingOrders = async (req, res) =>{
    try {
        const orders = await Order.find({
            status: { $nin: ['delivered', 'cancelled'] }
        }).sort({ createdAt: -1 }).populate({path:'billing.paymentMode',select:'paymentOption'});

        return res.status(200).json(orders);
    } catch (error) {
        console.error('Get pending orders error:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}
export const getCompletedOrders = async (req, res) =>{
    try {
        const orders = await Order.find({
            status: { $eq: 'delivered' }
        }).sort({ createdAt: -1 }).populate({path:'billing.paymentMode',select:'paymentOption'});

        return res.status(200).json(orders);
    } catch (error) {
        console.error('Get completed order err:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}
export const getCancelledOrders = async (req, res) =>{
    try {
        const orders = await Order.find({
            status: { $eq: 'cancelled' }
        }).sort({ createdAt: -1 }).populate({path:'billing.paymentMode',select:'paymentOption'});

        return res.status(200).json(orders);
    } catch (error) {
        console.error('Get cancelled order err:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}
