import Razorpay from "razorpay";
import { env } from "./env.js";
import crypto from 'crypto';

const razorpay = new Razorpay({
    key_id: env. razorpayKey,
    key_secret: env.razorpaySecret
});

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
export const verifyRazorpayPayment = async (signature,order_id,payment_id) => {
    try {
        const generatedSignature = crypto.createHmac('sha256', env.razorpaySecret)
            .update(`${order_id}|${payment_id}`)
            .digest('hex');
        return generatedSignature === signature;

    } catch (err) {
        console.log('Error verifying Razorpay payment:', err);
        throw new Error('Failed to verify Razorpay payment');
    }
}

export default razorpay;