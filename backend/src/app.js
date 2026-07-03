import express from "express";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
// import adminRoutes from './routes/adminRoutes.js';
// import productRoutes from './routes/productRoutes.js';
// import catalogRoutes from './routes/catalogRoutes.js';
// import cartRoutes from './routes/cartRoutes.js';
// import orderRoutes from './routes/orderRoutes.js';
import { isUserLoggedIn } from "./controllers/authController.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    // 1. Specify your exact frontend URL (DO NOT use a trailing slash '/')
    origin: "http://localhost:5173",

    // 2. Explicitly allow credentials to match your Axios setup
    credentials: true,
  }),
);
app.use("/api/v0/cart", cartRoutes);
app.use("/api/v0/auth", authRoutes);
app.use("/api/v0/categories", categoryRoutes);
app.use("/api/v0/products", productRoutes);
app.use("/api/v0/payment", paymentRoutes);
app.use("/api/v0/orders", orderRoutes);

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});
app.get('/api/v0/check-user', isUserLoggedIn);

export default app;
