import mongoose from "mongoose";
import User from "./User";

// Schema for individual items within the cart
const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity cannot be less than 1.'],
        default: 1
    },
    priceAtAddition: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative.']
    }
}, { _id: false });

const chargeSchema = new mongoose.Schema({
    chargeName: {
        type: String,
        required: true,
    },
    chargeAmount: {
        type: Number,
        required: true
    }
})

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: {
        type: [cartItemSchema]
    },
    billing:{
        charges:{
            type: [chargeSchema],
            default: []
        },
        totalBill:{
            type: Number,
            required: true,
            default: 0
        }
    }
}, {
    timestamps: true
})

//middleware to automatically calculate total
cartSchema.pre('save', function(next){
    //checking if there are products in cart
    if ((this.products || []).length === 0) {
    this.billing.totalBill = 0;
    return next();
    }

    //calculate total bill
    const finalTotal = ((this.products || []).reduce((total, item)=>{
        return total + (item.quantity * item.priceAtAddition);
    }, 0)) + ((this.billing?.charges || []).reduce((rv, charge)=>{
        return rv + charge.chargeAmount;
    }, 0));

    //round off in case charges are in paisa
    this.billing.totalBill = Math.round(finalTotal * 100)/ 100;

    next();
})


const Cart = mongoose.model('Cart', cartSchema);
export default Cart;