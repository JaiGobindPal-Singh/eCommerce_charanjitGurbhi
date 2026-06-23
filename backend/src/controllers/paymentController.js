import PaymentOptions from "../models/paymentOptions.model.js";
import { initializeUpiPayment, confirmPayment } from "../utils/payment.js";



export const getPaymentMethods = async (req, res)=> {
    try{
        const cartAmount = Number(req.body.cartAmount);

        //validating cart amount
        if( isNaN(cartAmount) || cartAmount < 1 ){
            return res.status(400).json({
                message:"cart amount must be at least 1"
            })
        }
        //fetch Payment options from db
        const paymentOptions = await PaymentOptions.find({}).lean();
        if(!paymentOptions.length){
            return res.status(400).json({
                message:"no payment option available"
            })
        }
        //preparing response
        let response = {};
        paymentOptions.forEach((obj)=>{
            //generate the upi url based on cart amount
            if(obj.paymentOption == "upi"){
                const responseUpiUrl = initializeUpiPayment(obj.upiUrl, cartAmount);
                response.upi = {
                    upiUrl: responseUpiUrl
                }
            }
            //bank account transfer
            else if(obj.paymentOption == "netbanking"){
                response.mobile_banking = {
                    accountNumber: obj.bankAccount,
                    accountIfsc: obj.bankIfsc
                }
            }
            else if(obj.paymentOption == "cod"){
                response.cod = {
                    availableCities: obj.availableCities
                }
            }
        })
        return res.status(200).json(response);
    }catch(error){
        console.log("error in loadPaymentMethod cont", error);
        return res.status(500).json({
            message:"internal server error"
        })
    }
}

export const addPaymentMethod = async(req, res) =>{
    try{
        const {paymentOption, upiUrl = "", bankAccount = "", bankIfsc = "", availableCities = []} = req.body;

        //verifying payment option
        if(!paymentOption || !(["upi", "netbanking","cod"].includes(paymentOption))){
            return res.status(400).json({message:"invalid payment option"})
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

        //retrieving and sending payment options as response
        const allPaymentOptions = await PaymentOptions.find({}).lean();
        return res.status(201).json(allPaymentOptions);
    }catch(error){
        console.log("error adding payment method", error);
        return res.status(500).json({
            message:"internal server error"
        })
    }
}

//todo update payment method adn dlete