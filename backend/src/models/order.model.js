import mongoose from 'mongoose';
import { cartItemSchema, chargeSchema } from './cart.model.js';

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
        fullAddress: {
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
            trim: true
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
            'order_placed',
            'processing',
            'out_for_delivery',
            'delivered',
            'cancelled',
            'returned'
        ],
        lowercase: true,
        default: 'order_placed',
        trim: true
    },
    statusHistory: [{
        status: {
            type: String,
            required:true,
            enum: [
                'order_placed',
                'processing',
                'out_for_delivery',
                'delivered',
                'cancelled',
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
            type: mongoose.Schema.Types.ObjectId,
            ref: "PaymentOptions",
            required: true
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
        required: function(){
            return this.status === "cancelled"
        },
        trim: true,
        maxlength:150
    }
},{
    timestamps: true
});


const Order = mongoose.model('Order', orderSchema);

export default Order;