import Razorpay from "razorpay";
import { env } from "./env.js";
import crypto from 'crypto';

const razorpay = new Razorpay({
    key_id: env. razorpayKey,
    key_secret: env.razorpaySecret
});



export default razorpay;