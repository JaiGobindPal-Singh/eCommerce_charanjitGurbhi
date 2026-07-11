import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
    {
        // User who made the payment
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        // Your ecommerce order
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
            index: true,
        },

        // Razorpay IDs
        razorpayOrderId: {
            type: String,
            required: true,
            unique: true,
        },

        razorpayPaymentId: {
            type: String,
            default: null,
        },

        // Amount in smallest currency unit (paise)
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: [
                "initialized",
                "success",
                "failed",
                "refunded",
            ],
            default: "initialized",
        },

        refundId: {
            type: String,
            default: null,
        },

        refundedAmount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Transaction', transactionSchema);