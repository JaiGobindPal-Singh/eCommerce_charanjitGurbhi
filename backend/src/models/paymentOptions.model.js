import mongoose from 'mongoose';

const paymentOptionsSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: "payment-options"
    },
    online: {
        enabled:{
            type: Boolean,
            default: true,
            required: true
        }
    },
    cod: {
        enabled:{
            type: Boolean,
            default: false,
            required: true
        },
        availableCities: {
            type: [{
                type: String,
                lowercase: true,
                trim: true
            }],
        }
    }
})

const PaymentOptions = mongoose.model("PaymentOptions", paymentOptionsSchema);
export default PaymentOptions;
