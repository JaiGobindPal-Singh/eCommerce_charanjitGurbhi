import express from "express";
import {
  getAllCategories,
  createCategory,
} from "../controllers/category.controller.js";
import { authorizeAdmin } from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddleware.js";
const router = express.Router();

router.get("/", getAllCategories);
router.post("/", authorizeAdmin, upload.single("icon"), createCategory);

export default router;
