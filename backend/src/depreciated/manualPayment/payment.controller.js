import PaymentOptions from "./paymentOptions.model.js";
import { initializeUpiPayment, confirmPayment } from "../../utils/payment.js";
import { verifyMongoId } from "../../utils/mongo.utils.js";
import Cart from "../../models/cart.model.js";

export const getPaymentMethods = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({
            user: userId
        }).lean();

        if (!cart) {
            return res.status(400).json({ message: "user cart does not exist" });
        }

        const cartAmount = cart.billing.totalBill;

        //validating cart amount
        if (isNaN(cartAmount) || cartAmount < 1) {
            return res.status(400).json({
                message: "cart amount must be at least 1"
            })
        }
        //fetch Payment options from db
        const paymentOptions = await PaymentOptions.find({}).lean();
        if (!paymentOptions.length) {
            return res.status(404).json({
                message: "no payment option available"
            })
        }
        //preparing response
        let response = {};
        paymentOptions.forEach((obj) => {
            //generate the upi url based on cart amount
            if (obj.paymentOption == "upi") {
                const responseUpiUrl = initializeUpiPayment(obj.upiUrl, cartAmount);
                response.upi = {
                    upiUrl: responseUpiUrl
                }
            }
            //bank account transfer
            else if (obj.paymentOption == "netbanking") {
                response.netbanking = {
                    accountNumber: obj.bankAccount,
                    accountIfsc: obj.bankIfsc
                }
            }
            else if (obj.paymentOption == "cod") {
                response.cod = {
                    availableCities: obj.availableCities
                }
            }
        })
        return res.status(200).json(response);
    } catch (error) {
        console.log("error in loadPaymentMethod cont", error);
        return res.status(500).json({
            message: "internal server error"
        })
    }
}

export const addPaymentMethod = async (req, res) => {
    try {
        //standardizing format
        const paymentOption = req.body.paymentOption.trim();
        const upiUrl = req.body.upiUrl?.trim() || "";
        const bankAccount = String(req.body.bankAccount)?.trim() || "";
        const bankIfsc = String(req.body.bankIfsc)?.trim() || "";
        const availableCities = req.body.availableCities || [];

        //check if payment option already exists
        const paymentOptionExists = await PaymentOptions.findOne({paymentOption});
        if(paymentOptionExists){
            return res.status(400).json({ message: "existing payment option" });
        }

        //verifying payment options
        if (!paymentOption || !(["upi", "netbanking", "cod"].includes(paymentOption))) {
            return res.status(400).json({ message: "invalid payment option" });
        }
        if (paymentOption === "upi" && !upiUrl) {
            return res.status(400).json({ message: "upi url is required" });
        }
        else if (paymentOption === "netbanking" && (!bankAccount || !bankIfsc)) {
            return res.status(400).json({ message: " bankAccount and IFSC is required" });
        }
        else if (paymentOption === "cod" && (!Array.isArray(availableCities) || availableCities.length < 1)) {
            return res.status(400).json({ message: " available cities for cod are required" });
        }

        //adding new payment option to db
        const npo = new PaymentOptions({
            paymentOption,
            upiUrl,
            bankAccount,
            bankIfsc,
            availableCities
        })
        await npo.save();
        return res.status(201).json(npo);
    } catch (error) {
        console.log("error adding payment method", error);
        return res.status(500).json({
            message: "internal server error"
        })
    }
}

export const updatePaymentMethod = async (req, res) => {
    try {
        const { paymentOptionId } = req.params;
        const paymentOption = req.body.paymentOption.trim();
        const upiUrl = req.body.upiUrl?.trim() || "";
        const bankAccount = String(req.body.bankAccount)?.trim() || "";
        const bankIfsc = String(req.body.bankIfsc)?.trim() || "";
        const availableCities = req.body.availableCities || [];

        if(!paymentOptionId || !verifyMongoId(paymentOptionId)){
            return res.status(400).json({ message: "invalid payment option" });
        }

        //validating payment option
        if (!(["upi", "netbanking", "cod"].includes(paymentOption)) || !paymentOptionId) {
            return res.status(400).json({ message: "payment option type is required" });
        }
        if (paymentOption === "upi" && !upiUrl) {
            return res.status(400).json({ message: "upi url is required" });
        }
        else if (paymentOption === "netbanking" && (!bankAccount || !bankIfsc)) {
            return res.status(400).json({ message: " bankAccount and IFSC is required" });
        }
        else if (paymentOption === "cod" && !Array.isArray(availableCities) && availableCities.length < 1) {
            return res.status(400).json({ message: " available cities for cod are required" });
        }

        const updatedDoc = {
            paymentOption,
            upiUrl,
            bankAccount,
            bankIfsc,
            availableCities
        }
        //updating db
        const updatedPaymentOption = await PaymentOptions.findByIdAndUpdate(
            paymentOptionId,
            updatedDoc,
            {
                returnDocument:'after',
                runValidators: true
            }
        ).lean();
        if (!updatedPaymentOption) {
            return res.status(400).json({ message: "invalid payment option" });
        }
        return res.status(200).json(updatedPaymentOption);

    } catch (error) {
        console.log("error update payment method", error);
        return res.status(500).json({ message: "internal server error" });
    }
}

export const removePaymentMethod = async (req, res) => {
    try {
        const { paymentOptionId } = req.params;
        if (!paymentOptionId || !verifyMongoId(paymentOptionId)) {
            return res.status(400).json({ message: "payment option is required or invalid option" });
        }
        const deletedPaymentOption = await PaymentOptions.findByIdAndDelete(paymentOptionId);
        if (!deletedPaymentOption) {
            return res.status(400).json({ message: "invalid payment option" });
        }
        return res.status(200).json(deletedPaymentOption);
    } catch (error) {
        console.log("error delete payment option", error);
        return res.status(500).json({ message: "internal server error" });
    }
}