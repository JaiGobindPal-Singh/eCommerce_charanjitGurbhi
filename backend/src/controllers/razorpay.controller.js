import { env } from "../config/env.js";
import crypto from 'crypto';

import {handleDismissedPayment, handlePaymentCaptured, handlePaymentFailed, verifyRazorpayWebhookSign} from '../services/razorpay.service.js';

export const razorpayWebhook = async (req, res) => {
    try {
        //veryfying signature
        const signature = req.headers["x-razorpay-signature"];
        const isValid = verifyRazorpayWebhookSign(signature,req.body.payload.payment.entity.order_id,req.body.payload.payment.entity.id);

        if (!isValid) {
            return res.status(400).send("Invalid signature");
        }

        //fetching event and calling relevant method
        const event = req.body.event;
        switch (event) {
            case "payment.captured":
                await handlePaymentCaptured(req.body.payload.payment.entity);
                break;

            case "payment.failed":
                await handlePaymentFailed(req.body.payload.payment.entity);
                break;

            default:
                console.log("Unhandled Event:", req.body.event);
        }

        res.status(200).json({
            received: true
        });

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
};
export const managePaymentDismiss = async (req, res) =>{
    try{
        const {razorpayOrderId} = req.params;
        if(!razorpayOrderId || !(String(razorpayOrderId).length)){
            return res.status(400).json({
                success: false,
                error:"Invalid order Id"
            });
        }
        const z = await handleDismissedPayment(razorpayOrderId);
        if(!z || !z.success){
            return res.status(400).json(z);
        }

        return res.status(200).json(z);
    }catch(e){
        return res.status(500).json({
            success: false,
            error:"internal server error -" + e. message
        });
    }
}
