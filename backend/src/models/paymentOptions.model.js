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
        allowedPostalCodes: {
            type: [{
                type: String,
                trim: true,
                match: [/^[1-9][0-9]{5}$/, 'Please provide a valid 6-digit Indian postal code'],
                minlength: [6, 'Postal code must be exactly 6 digits'],
                maxlength: [6, 'Postal code must be exactly 6 digits'],
                required: true 
            }],
            default: [] // if empty, COD is allowed for all postal codes
        },
        strict:{
            type: Boolean,
            default: false
        }
    }
})

const PaymentOptions = mongoose.model("PaymentOptions", paymentOptionsSchema);
export default PaymentOptions;
