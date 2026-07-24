import razorpay from "../config/razorpay.config.js";
import { env } from "../config/env.js";
import crypto from 'crypto';
import mongoose from 'mongoose'
import Transaction from '../models/transaction.model.js'
import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";

//update transaction and order db and set payment status
const setPaymentStatus = async (order_id, payment_id, status, t_status) => {
    const dbSession = await mongoose.startSession();
    try {
        dbSession.startTransaction();

        //validating transaction and updating data
        const transaction = await Transaction.findOne({ razorpayOrderId: order_id }).session(dbSession);
        if (!transaction) {
            throw new Error(`Transaction with order ID ${order_id} not found in database.`);
        }
        transaction.razorpayPaymentId = payment_id;
        transaction.status = t_status;
        await transaction.save({ session: dbSession });

        //updating order 
        const order = await Order.findByIdAndUpdate(
            transaction.order,
            {
                $set: {
                    status: status,
                    transaction: transaction._id
                },
                $push: { statusHistory: { status: status } }
            }, {
            session: dbSession,
        }
        ).lean();
        //update stock if payment succeeded
        if (status === "order_placed" && order.status !== "payment_pending") {
            const bulkOperations = order.items.map(item => {
                return {
                    updateOne: {
                        filter: {
                            _id: item.product._id,
                            stockAvailable: { $gte: item.quantity } // Check stock for this item
                        },
                        update: {
                            $inc: { stockAvailable: -item.quantity } // Deduct requested quantity
                        }
                    }
                };
            });
            await mongoose.model('Product').bulkWrite(bulkOperations, {
                ordered: true,
                session:dbSession
            });
        }
        //restock if payment failed or abandoned
        if (status === "payment_pending" || status === "payment_failed" || status === "abandoned") {
            const bulkOperations = order.items.map(item => {
                return {
                    updateOne: {
                        filter: { _id: item.product },
                        // Use positive $inc to add the quantity back
                        update: { $inc: { stockAvailable: item.quantity } }
                    }
                };
            });
            await mongoose.model('Product').bulkWrite(bulkOperations, {
                ordered: true,
                session: dbSession
            });
        }

        await dbSession.commitTransaction();
        return { success: true };

    } catch (e) {
        if (dbSession.inTransaction()) {
            await dbSession.abortTransaction();
        }
        throw e;
    } finally {
        await dbSession.endSession();
    }
}

//creates razorpay transaction order
export const createRazorpayOrder = async (amount) => {
    try {
        const options = {
            amount: Math.round(amount * 100), // Amount in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`, // Unique receipt identifier
        };
        const order = await razorpay.orders.create(options);
        return order;

    } catch (error) {
        console.log(error);
        throw new Error('Failed to create Razorpay order' + error);
    }
}

//verifies the razorpay signature
export const verifyRazorpayWebhookSign = async (signature, order_id, payment_id) => {
    try {
        const generatedSignature = crypto.createHmac('sha256', env.razorpayWebhookSecret)
            .update(`${order_id}|${payment_id}`)
            .digest('hex');
        return generatedSignature === signature;

    } catch (err) {
        throw new Error('Failed to verify Razorpay payment');
    }
}

// manages and updates transaction and orders on payment success
export const handlePaymentCaptured = async (payment) => {

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        //fetching transaction and validating
        const transaction = await Transaction.findOne({
            razorpayOrderId: payment.order_id
        }).session(session);

        if (!transaction) {
            await session.abortTransaction();
            return;
        }

        // Already processed?
        if (transaction.status === "success") {
            await session.commitTransaction();
            return;
        }

        //updating transaction 
        transaction.status = "success";
        transaction.razorpayPaymentId = payment.id;
        await transaction.save({ session });

        //updating order
        const order = await Order.findByIdAndUpdate(
            transaction.order,
            {
                status: "order_placed",
                transaction: transaction._id,
                $push: {
                    statusHistory: {
                        status: "order_placed"
                    }
                }
            },
            { session }
        );

        //update stock if payment succeeded only success after fail or stuck
        if (order.status !== "payment_pending") {
            const bulkOperations = order.items.map(item => {
                return {
                    updateOne: {
                        filter: {
                            _id: item.product._id,
                            stockAvailable: { $gte: item.quantity } // Check stock for this item
                        },
                        update: {
                            $inc: { stockAvailable: -item.quantity } // Deduct requested quantity
                        }
                    }
                };
            });
            await mongoose.model('Product').bulkWrite(bulkOperations, {
                ordered: true,
                session
            });
        }
        //clearing cart
        await Cart.findOneAndUpdate(
            { user: transaction.user },
            {
                $set: {
                    items: []
                }
            },
            { session }
        );

        await session.commitTransaction();

    } catch (err) {
        await session.abortTransaction();
        throw err;

    } finally {
        session.endSession();
    }
};

// manages and updates transaction and orders on payment fail
export const handlePaymentFailed = async (payment) => {
    //updating transaction
    const transaction = await Transaction.findOneAndUpdate(
        {
            razorpayOrderId: payment.order_id
        },
        {
            status: "failed",
            razorpayPaymentId: payment.id
        }
    );


    //updating order
    const order = await Order.findByIdAndUpdate(
        transaction.order,
        {
            status: "payment_failed",
            $push: {
                statusHistory: {
                    status: "payment_failed"
                }
            }
        }
    );
    const bulkOperations = order.items.map(item => {
        return {
            updateOne: {
                filter: { _id: item.product },
                // Use positive $inc to add the quantity back
                update: { $inc: { stockAvailable: item.quantity } }
            }
        };
    });
    await mongoose.model('Product').bulkWrite(bulkOperations, {
        ordered: true
    });

};

// manages and updates transaction and orders on payment dismiss or uncertain close or server crash
export const handleDismissedPayment = async (orderId) => {
    //Fetching Razorpay Order status and order payments
    const [rzpOrder, payments] = await Promise.all([
        razorpay.orders.fetch(orderId),
        razorpay.orders.fetchPayments(orderId)
    ]);

    // Get latest payment details
    const payment = payments?.items?.sort((a, b) => b.created_at - a.created_at)[0];

    //if order is already paid
    if (rzpOrder.status === "paid") {
        return await setPaymentStatus(orderId, payment?.id || '', "order_placed", "success");
    }

    //  If no payments exist, the user definitely closed it without typing details
    if (!payments.items || payments.items.length === 0) {
        return await setPaymentStatus(orderId, payment?.id || '', "abandoned", "failed");

    }

    switch (payment.status) {
        case "captured":
            return await setPaymentStatus(orderId, payment?.id || '', "order_placed", "success");

        //handling payment stuck at authorized state
        case "authorized":
            return await setPaymentStatus(orderId, payment?.id || '', "payment_pending", "initialized");

        case "created":
        case "pending":
            // SAFEGUARD: The user closed the window, but the bank is still processing!
            // DO NOT mark as FAILED yet. Keep it pending and let webhooks resolve it.
            return await setPaymentStatus(orderId, payment?.id || '', "payment_pending", "initialized");

        case "failed":
            return await setPaymentStatus(orderId, payment?.id || '', "payment_failed", "failed");

        default:
            return { success: true, paymentStatus: payment.status };
    }
};