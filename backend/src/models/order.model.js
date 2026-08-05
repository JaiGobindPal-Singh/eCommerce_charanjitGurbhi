import mongoose from 'mongoose';
import { cartItemSchema } from './cart.model.js';

export const chargeSchema = new mongoose.Schema({
    chargeName: {
        type: String,
        required: true,
    },
    chargeAmount: {
        type: Number,
        required: true
    }
}, { _id: false })


const addressSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        streetAddress: {
            type: String,
            required: true,
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        state: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        postalCode: {
            type: String,
            trim: true,
            required: true,
            match: [/^[1-9][0-9]{5}$/, 'Please provide a valid 6-digit Indian postal code'],
            minlength: [6, 'Postal code must be exactly 6 digits'],
            maxlength: [6, 'Postal code must be exactly 6 digits']
        },
        country: {
            type: String,
            trim: true,
            default: "India"
        }
    },
    { _id: false }
);
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: [
            'payment_failed',
            'payment_pending',
            'abandoned',
            'order_placed',
            'processing',
            'hold',
            'shipped',
            'delivered',
            'cancelled',
            'return_requested',
            'return_approved',
            'returned'
        ],
        lowercase: true,
        trim: true,
        required: true,
        default: 'payment_pending'
    },
    statusHistory: [{
        status: {
            type: String,
            required: true,
            enum: [
                'payment_failed',
                'payment_pending',
                'abandoned',
                'order_placed',
                'processing',
                'hold',
                'shipped',
                'delivered',
                'cancelled',
                'return_requested',
                'return_approved',
                'returned'
            ],
            lowercase: true
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }],
    items: {
        type: [cartItemSchema],
        required: true,
    },
    billing: {
        paymentMode: {
            type: String,
            enum: ["cod", "online"],
            required: true,
            trim: true
        },
        subtotal: {
            type: Number,
            required: true
        },
        discount: {
            type: Number,
            default: 0
        },
        charges: { type: [chargeSchema], default: [] },
        totalBill: { type: Number, required: true }
    },
    deliveryDetails: {
        deliveryAddress: {
            type: addressSchema,
            required: true,
        },
        deliveryPartner: {
            type: String,
            trim: true,
            default: ""
        },
        trackingId: {
            type: String,
            trim: true,
            default: ""
        }
    },
    cancellationReason: {
        type: String,
        trim: true,
        maxlength: 150
    },
    returnReason: {
        type: String,
        trim: true,
        maxLength: 150
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
        default: null
    }
}, {
    timestamps: true
});


const Order = mongoose.model('Order', orderSchema);

export default Order;