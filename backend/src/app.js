import express from "express";
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import chargeRoutes from "./routes/charge.routes.js"
import { isUserLoggedIn } from "./controllers/auth.controller.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import paymentOptionsRoutes from "./routes/paymentOptions.routes.js"
import { initializePaymentOptions } from "./controllers/paymentOptions.controller.js";

const app = express();

initializePaymentOptions();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    // frontend URL (DO NOT use a trailing slash '/')
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use("/api/v0/payment-options",paymentOptionsRoutes);
app.use("/api/v0/cart", cartRoutes);
app.use("/api/v0/auth", authRoutes);
app.use("/api/v0/categories", categoryRoutes);
app.use("/api/v0/products", productRoutes);
app.use("/api/v0/charges", chargeRoutes);
app.use("/api/v0/orders", orderRoutes);

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});
app.get('/api/v0/check-user', isUserLoggedIn);

export default app;
