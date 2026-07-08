import express from 'express';
import { getAllCategories, getCategoryByStep, createCategory } from '../controllers/category.controller.js';
import { authorizeAdmin } from '../middleware/authMiddleware.js';
import upload from '../middleware/multerMiddleware.js'
const router = express.Router();

router.get('/', getAllCategories);
router.get('/:step', getCategoryByStep);
router.post('/',authorizeAdmin, upload.single('icon'), createCategory);

export default router;