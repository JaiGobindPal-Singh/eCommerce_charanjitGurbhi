import mongoose from "mongoose";
import User from "./User.js";

// Schema for individual items within the cart
export const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity cannot be less than 1.'],
        default: 1
    }
}, { _id: false });

export const chargeSchema = new mongoose.Schema({
    chargeName: {
        type: String,
        required: true,
    },
    chargeAmount: {
        type: Number,
        required: true
    }
},{_id: false})

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: {
        type: [cartItemSchema],
        default: []
    },
}, {
    timestamps: true
})

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;