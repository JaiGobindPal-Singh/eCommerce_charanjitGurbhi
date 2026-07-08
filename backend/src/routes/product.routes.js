import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductsByCategory,
  getProductsByKeyword,
  updateProduct,
  getProductById,
} from "../controllers/product.controller.js";
import { authorizeAdmin } from "../middleware/authMiddleware.js";
const router = express.Router();

//admin routes
router.post("/", authorizeAdmin, createProduct);
router.delete("/", authorizeAdmin, deleteProduct);
router.put("/", authorizeAdmin, updateProduct);

//client routes
router.get("/", getAllProducts);
router.get("/category", getProductsByCategory);
router.get("/keyword", getProductsByKeyword);
router.get("/:id", getProductById);

export default router;
