import mongoose from 'mongoose';
const chargeSchema = new mongoose.Schema({
    chargeName: {
        type: String,
        required: true,
        unique: true
    },
    chargeAmount: {
        type: Number,
        required: true
    },
    noChargeConditions:{
        city:{
            type: [String],
            trim: true
        },
        amount:{
            type: Number,
            default:0
        }
    }
});

const Charge = mongoose.model('Charge',chargeSchema);
export default Charge;