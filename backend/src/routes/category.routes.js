import express from "express";
import {
  getAllCategories,
  createCategory,
  deleteCategory
} from "../controllers/category.controller.js";
import { authorizeAdmin } from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddleware.js";
const router = express.Router();

router.get("/", getAllCategories);
router.post("/", authorizeAdmin, upload.single("icon"), createCategory);
router.delete("/:categoryId", authorizeAdmin, deleteCategory);

export default router;
