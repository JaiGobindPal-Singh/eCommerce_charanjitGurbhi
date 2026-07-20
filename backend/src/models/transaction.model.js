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

        amount: {
            type: Number,
            required: true,
            min: 1
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

        razorpayRefundId: {
            type: String,
        },

        refundedAmount: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

// Inside your Transaction schema file
transactionSchema.index(
    { status: 1, createdAt: -1 },
    {
        partialFilterExpression: {
            status: 'initialized'
        }
    }
);

export default mongoose.model('Transaction', transactionSchema);