import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import OrderCondition from "../models/orderCondition.model.js";
import PaymentOptions from "../models/paymentOptions.model.js";
import { verifyMongoId } from "../utils/mongo.utils.js"
import { createRazorpayOrder, verifyRazorpayPayment } from "../config/razorpay.config.js";
import { env } from "../config/env.js";
import Transaction from '../models/transactions.model.js';
import mongoose from 'mongoose';

const findApplicableCharges = async (user, cart) => {
    //getting charges
    const charges = await Charge.find({}).lean();

    //no charges exist
    if (!(Object.keys(charges).length)) {
        return [];
    }

    const calculateChargePercent = (cartTotal, percent) => {
        return cartTotal * percent / 100;
    }
    //getting fixed charges
    const fixedCharges = charges
        .filter((ch) => ch.fixed)
        .map((ch) => ({ [ch.chargeName]: ch.chargeAmount ?? calculateChargePercent(cartTotal, ch.chargePercent) }));

    //evaluating optional charges
    const userCity = user?.address?.city;
    const optionalCharges = charges
        .filter((ch) => {
            if (ch.fixed) return false;

            const cityExempt =
                ch.noChargeConditions?.city.length ? ch.noChargeConditions?.city?.includes(userCity.toLowerCase()) ?? false : true;

            const minAmount = ch.noChargeConditions?.minAmount ?? 0;
            const amountExempt = minAmount > 0 ? cartTotal >= minAmount : true;

            return !(cityExempt && amountExempt);
        })
        .map((ch) => ({ [ch.chargeName]: ch.chargeAmount ?? calculateChargePercent(cartTotal, ch.chargePercent) }));

    return [...fixedCharges, ...optionalCharges]



}
const calculateTotalPayable = (cart, charges) => {
    //calculating cart total
    const cartTotal = cart?.items?.reduce((sum, item) => {
        return sum + (item.product?.price || 0) * item.quantity;
    }, 0) || 0;

    //calculating charges total
    let totalCharges = 0;
    charges.forEach((ch) => {
        totalCharges += Number(Object.values(ch).reduce((sum, current) => sum + current, 0));
    })

    //return total payable
    return cartTotal + totalCharges;
}

export const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            deliveryDetails,
            paymentMode
        } = req.body;

        //validate payment mode
        if (!paymentMode || !(["cod", "online"].includes(paymentMode))) {
            return res.status(400).json({ error: "invalid payment option" });
        }

        //validate delivery details
        if (!deliveryDetails || !deliveryDetails.deliveryAddress) {
            return res.status(400).json({ error: "delivery details required" });
        }
        if (!deliveryDetails.deliveryAddress.fullName ||
            !deliveryDetails.deliveryAddress.phone ||
            !deliveryDetails.deliveryAddress.streetAddress ||
            !deliveryDetails.deliveryAddress.city ||
            !deliveryDetails.deliveryAddress.state
        ) {
            return res.status(400).json({ error: "all delivery details are required" });
        }

        //verify cod payment is available or not
        if (paymentMode.trim() == "cod") {
            if (!deliveryDetails.deliveryAddress.city) {
                return res.status(400).json({ error: "delivery address is required" });
            }
            const pOp = await PaymentOptions.findOne();
            if (!(
                pOp.cod?.enabled &&
                pOp.cod?.availableCities?.includes((deliveryDetails.deliveryAddress.city).trim().toLowerCase())
            )) {
                return res.status(400).json({ error: "cod not available at this location" });
            }
        }

        // Get cart
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                error: 'Cart not found'
            });
        }
        // Check cart is empty
        if (!cart.items?.length) {
            return res.status(400).json({
                error: 'Cart is empty'
            });
        }

        //getting applicable charges and totalBill
        const charges = await findApplicableCharges(req.user, cart);
        const totalBill = calculateTotalPayable(cart, charges);

        //verifying min order amount
        const minOrderValue = await OrderCondition.findOne().lean();
        if (minOrderValue && totalBill < minOrderValue.minAmount) {
            return res.status(400).json({
                error: `minimum order value must more than or equals ${minOrderValue.minAmount}`
            })
        }

        //*verify stock here not needed now

        //payment mode is cod clear cart and return
        if (paymentMode == "cod") {
            const moSe = await mongoose.startSession();  //starting mongo session
            try {

                moSe.startTransaction();
                // Create order
                const [order] = await Order.create(
                    [{
                        user: userId,
                        status: 'order_placed',
                        statusHistory: [{
                            status: 'order_placed'
                        }],
                        items: cart.items,
                        billing: {
                            paymentMode,
                            charges: charges,
                            totalBill: totalBill
                        },
                        deliveryDetails: deliveryDetails,
                    }],
                    { session: moSe });

                // clear cart after successful order
                cart.items = [];
                await cart.save({ session: moSe });

                await moSe.commitTransaction();    //ending mongo session

                return res.status(201).json({
                    success: true,
                    order: {
                        id: order._id,
                        status: order.status,
                        totalBill
                    }
                })
            } catch (e) {
                //Rollback all changes if any query fails
                await moSe.abortTransaction();
                throw new Error("Server Error Unable to save to db during cod ")
            } finally {
                await moSe.endSession();
            }
        }

        //online payment initialize
        const paymentOrder = await createRazorpayOrder(totalBill);
        if (!paymentOrder) {
            return res.status(502).json({
                error: "Unable to initialize payment."
            });
        }

        const dbSession = await mongoose.startSession();
        try {
            dbSession.startTransaction();

            // Create order for online
            const [order] = await Order.create(
                [{
                    user: userId,
                    status: 'awaiting_payment',
                    statusHistory: [{
                        status: 'awaiting_payment'
                    }],
                    items: cart.items,
                    billing: {
                        paymentMode,
                        charges: charges,
                        totalBill: totalBill
                    },
                    deliveryDetails: deliveryDetails,
                }],
                { session: dbSession }
            );

            //creating payment object
            const [transaction] = await Transaction.create(
                [{
                    user: userId,
                    order: order._id,
                    razorpayOrderId: paymentOrder.id,
                    amount: totalBill * 100,
                    status: 'initialized'
                }],
                { session: dbSession }
            );
            await dbSession.commitTransaction(); //ending session

            return res.status(201).json({
                success: true,
                order: {
                    id: order._id,
                    status: order.status,
                    totalBill
                },
                razorpayOrderId: paymentOrder.id,
                razorpayKey: env.razorpayKey
            });
        } catch (e) {
            //Rollback all changes if any query fails
            await dbSession.abortTransaction();
            throw new Error("error in online db session");
        } finally {
            //end the session
            await dbSession.endSession();
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: 'internal server error'
        });
    }
};

export const verifyOrder = async (req, res) => {
    try {
        const { payment_id, order_id, signature } = req.body;

        // Validate the payment details
        if (!payment_id || !order_id || !signature) {
            return res.status(400).json({ error: "Invalid payment details" });
        }

        // Verify the payment signature
        let isVerified = verifyRazorpayPayment(signature, order_id, payment_id);

        if (!isVerified) {
            return res.status(400).json({ error: "error verifying payment" });
        }

        //Start the session
        const session = await mongoose.startSession();
        try {
            session.startTransaction();
            const transaction = await Transaction.findOneAndUpdate(
                { razorpayOrderId: order_id },
                {
                    $set: {
                        status: 'success',
                        razorpayPaymentId: payment_id
                    }
                },
                {
                    returnDocument: 'after',
                    session
                }
            ).lean();

            if (!transaction) {
                await session.abortTransaction();
                await session.endSession();
                return res.status(404).json({
                    error: "Transaction not found"
                });
            }

            const order = await Order.findByIdAndUpdate(
                transaction.order,
                {
                    $set: {
                        status: 'order_placed',
                        transaction: transaction._id
                    },
                    $push: {
                        statusHistory: {
                            status: 'order_placed'
                        }
                    }
                },
                { session }
            );

            if (!order) {
                await session.abortTransaction();
                await session.endSession();
                return res.status(400).json({ error: "Order don't exist" });
            }

            //clearing cart
            const cart = await Cart.findOne({
                user: transaction.user
            }).session(session);
            cart.items = [];
            await cart.save({ session });

            // Commit the changes if everything succeeds
            await session.commitTransaction();
            return res.status(200).json({ success: true });

        } catch (e) {
            //Rollback all changes if any query fails
            await session.abortTransaction();
            throw e;
        } finally {
            // Always end the session
            await session.endSession()
        }

    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "internal server error" });
    }
}




export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const status = String(req.body.status);
        const cancellationReason = String(req.body.cancellationReason || "");
        const { deliveryPartner, trackingId } = req.body;

        //validate order and status
        if (!orderId || !verifyMongoId(orderId)) {
            return res.status(400).json({ error: "invalid order" });
        }
        if (!status || !([
            'processing',
            'out_for_delivery',
            'delivered',
            'cancelled'
        ].includes(status.trim()))) {
            return res.status(400).json({ error: "invalid status option" })
        }

        // Find order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                error: 'Order not found'
            });
        }

        // Validate cancellation
        if (
            status == 'cancelled' &&
            cancellationReason.length < 3
        ) {
            return res.status(400).json({
                error: 'Cancellation reason is required'
            });
        }

        // Update status
        order.status = status;

        // Handle cancellation
        if (status === 'cancelled') {
            order.cancellationReason = cancellationReason;
        }

        // Handle out for delivery
        if (status === 'out_for_delivery') {
            order.deliveryDetails.deliveryPartner = deliveryPartner || "";
            order.deliveryDetails.trackingId = trackingId || "";
        }
        // Add history
        order.statusHistory.push({
            status
        });

        await order.save();
        return res.status(200).json({
            success: true,
            order: order._id
        });

    } catch (error) {
        console.error("error updating order status", error);
        return res.status(500).json({
            error: 'internal server error'
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
            error: 'internal server error'
        });
    }
};

export const getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        //validating order id
        if (!orderId || !verifyMongoId(orderId)) {
            return res.status(400).json({ error: "invalid order" });
        }
        //fetching order
        const fullOrder = await Order.findOne({
            _id: orderId,
        }).populate({ path: 'billing.paymentMode', select: 'paymentOption' });

        if (!fullOrder) {
            return res.status(404).json({ error: "order does not exist" });
        }
        return res.status(200).json({ order: fullOrder });
    } catch (error) {
        console.log("error getting order details", error);
        return res.status(500).json({ error: "internal server error" });
    }
}
export const getPendingOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            status: { $eq: 'order_placed' }
        }).sort({ createdAt: -1 }).populate({ path: 'billing.paymentMode', select: 'paymentOption' });

        return res.status(200).json({orders});
    } catch (error) {
        console.error('Get pending orders error:', error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
}
export const getCompletedOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            status: { $eq: 'delivered' }
        }).sort({ createdAt: -1 }).populate({ path: 'billing.paymentMode', select: 'paymentOption' });

        return res.status(200).json({orders});
    } catch (error) {
        console.error('Get completed order err:', error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
}
export const getCancelledOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            status: { $eq: 'cancelled' }
        }).sort({ createdAt: -1 }).populate({ path: 'billing.paymentMode', select: 'paymentOption' });

        return res.status(200).json({orders});
    } catch (error) {
        console.error('Get cancelled order err:', error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
}
