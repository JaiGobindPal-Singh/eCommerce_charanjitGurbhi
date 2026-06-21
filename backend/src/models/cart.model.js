import mongoose from "mongoose";
import User from "./User";

// Schema for individual items within the cart
const cartItemSchema = new mongoose.Schema({
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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: {
        type: [cartItemSchema],
        default: []
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
    //checking if there are items in cart
    if ((this.items || []).length === 0) {
    this.billing.totalBill = 0;
    return next();
    }

    //calculate total bill
    const finalTotal = ((this.items || []).reduce((total, item)=>{
        return total + (item.quantity * item.priceAtAddition);
    }, 0)) + ((this.billing?.charges || []).reduce((rv, charge)=>{
        return rv + charge.chargeAmount;
    }, 0));

    //round off in case charges are in paisa
    this.billing.totalBill = Math.round(finalTotal );

    next();
})

cartSchema.post('findOneAndUpdate', async function(doc, next){
    if(!doc){
        return next();
    }
    //checking if there are items in cart
    if ((doc.items || []).length === 0) {
        doc.billing.totalBill = 0;
        await doc.constructor.updateOne(
            { _id: doc._id }, 
            { $set: { "billing.totalBill": 0 } }
        );
    return next();
    }

    //calculate total bill
    const finalTotal = Math.round(((doc.items || []).reduce((total, item)=>{
        return total + (item.quantity * item.priceAtAddition);
    }, 0)) + ((doc.billing?.charges || []).reduce((rv, charge)=>{
        return rv + charge.chargeAmount;
    }, 0)));

    if (doc.billing.totalBill !== finalTotal) {
        doc.billing.totalBill = finalTotal;
        // Using updateOne prevents an infinite loop back into findOneAndUpdate
        await doc.constructor.updateOne(
            { _id: doc._id }, 
            { $set: { "billing.totalBill": finalTotal } }
        );
    }
    next();
})


const Cart = mongoose.model('Cart', cartSchema);
export default Cart;