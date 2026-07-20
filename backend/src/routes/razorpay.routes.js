import crypto from "crypto";
import express from "express";
import { razorpayWebhook, managePaymentDismiss } from "../controllers/razorpay.controller.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    razorpayWebhook
);

router.post(
    "/dismiss-payment/:razorpayOrderId",
    authenticateUser,
    managePaymentDismiss
)

export default router;