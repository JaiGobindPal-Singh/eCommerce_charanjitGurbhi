import razorpay from "../config/razorpay.config.js";
import { env } from "../config/env.js";
import crypto from 'crypto';
import mongoose from 'mongoose'
import Transaction from '../models/transactions.model.js'
import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";

export const createRazorpayOrder = async (amount) => {
    try {
        const options = {
            amount: amount * 100, // Amount in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`, // Unique receipt identifier
        };
        const order = await razorpay.orders.create(options);
        return order;

    } catch (error) {
        console.log('Error creating Razorpay order:', error);
        throw new Error('Failed to create Razorpay order');
    }
}
export const verifyRazorpaySignature = async (signature,order_id,payment_id) => {
    try {
        const generatedSignature = crypto.createHmac('sha256', env.razorpayWebhookSecret)
            .update(`${order_id}|${payment_id}`)
            .digest('hex');
        return generatedSignature === signature;

    } catch (err) {
        console.log('Error verifying Razorpay payment:', err);
        throw new Error('Failed to verify Razorpay payment');
    }
}

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
        await Order.findByIdAndUpdate(
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
    await Order.findByIdAndUpdate(
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
};