import mongoose from 'mongoose';
const chargeSchema = new mongoose.Schema({
    chargeName: {
        type: String,
        required: true,
        unique: true
    },
    chargeAmount: {
        type: Number,
        required: function(){
            return !this.chargePercent;
        }
    },
    chargePercent:{
        type: Number,
        required: function(){
            return !this.chargeAmount;
        }
    },
    fixed: {
        type:Boolean,
        default: false
    },
    noChargeConditions:{
        postalCodes:{
            type: [{
                type: String,
                trim: true,
                match: [/^[1-9][0-9]{5}$/, 'Please provide a valid 6-digit Indian postal code'],
                minlength: [6, 'Postal code must be exactly 6 digits'],
                maxlength: [6, 'Postal code must be exactly 6 digits'],
                required: true 
            }],
        },
        minAmount:{
            type: Number,
            default:0
        },
        paymentOption:{
            type: String,
            enum: ['cod',  'online','']
        }
    }
});

const Charge = mongoose.model('Charge',chargeSchema);
export default Charge;