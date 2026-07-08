import mongoose from 'mongoose';

const paymentOptionsSchema = new mongoose.Schema({
    paymentOption: {
        type: String,
        required: true,
        unique: true,
        enum: ["upi", "netbanking", "cod"],
        lowercase: true,
        trim: true
    },
    upiUrl: {
        type: String,
        required: function () {
            return this.paymentOption == "upi"
        },
        trim: true
    },
    bankAccount: {
        type: String,
        required: function () {
            return this.paymentOption == "netbanking"
        },
        trim: true
    },
    bankIfsc: {
        type: String,
        required: function () {
            return this.paymentOption == "netbanking"
        },
        trim: true
    },
    availableCities: {
        type: [{
            type:String,
            lowercase:true
        }],
        required: function () {
            return this.paymentOption == "cod"
        }
    }
})

const PaymentOptions = mongoose.model("PaymentOptions", paymentOptionsSchema);
export default PaymentOptions;
