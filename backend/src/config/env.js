import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = ['MONGO_URI', 'JWT_SECRET', 'ADMIN_PHONE', 'ADMIN_PASSWORD','CLOUDINARY_API', 'CLOUDINARY_SECRET','CLOUDINARY_CLOUD_NAME', 'RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET', 'RAZORPAY_WEBHOOK_SECRET'];

for (const key of requiredEnv) {
    if (!process.env[key]) {
        console.warn(`Missing environment variable: ${key}`);
    }
}

export const env = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    adminPhone: process.env.ADMIN_PHONE,
    adminPassword: process.env.ADMIN_PASSWORD,
    adminName: process.env.ADMIN_NAME || 'Administrator',
    cloudinaryApi:process.env.CLOUDINARY_API,
    cloudinarySecret:process.env.CLOUDINARY_SECRET,
    cloudinaryCloudName:process.env.CLOUDINARY_CLOUD_NAME,
    razorpayKey: process.env.RAZORPAY_KEY_ID,
    razorpaySecret: process.env.RAZORPAY_KEY_SECRET,
    razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET
};