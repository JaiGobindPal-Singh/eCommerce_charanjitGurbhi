import crypto from "crypto";
import express from "express";
import { razorpayWebhook } from "../controllers/razorpay.controller.js";
const router = express.Router();

router.post(
    "/razorpay/webhook",
    express.raw({ type: "application/json" }),
    razorpayWebhook
);

export default router;