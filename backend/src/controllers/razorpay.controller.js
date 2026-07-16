import { env } from "../config/env.js";
import crypto from 'crypto';

import {handlePaymentCaptured, handlePaymentFailed, verifyRazorpaySignature} from '../services/razorpay.service.js';

export const razorpayWebhook = async (req, res) => {
    try {
        
        const signature = req.headers["x-razorpay-signature"];

        const isValid = verifyRazorpaySignature(signature,req.body.payload.payment.entity.order_id,req.body.payload.payment.entity.id);

        if (!isValid) {
            return res.status(400).send("Invalid signature");
        }

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
