import express from 'express';
import { createProduct, deleteProduct, getAllProducts, getProductsByCategory, getProductsByKeyword, updateProduct } from '../controllers/productController.js';
import { authorizeAdmin } from '../middleware/authMiddleware.js';
const router = express.Router();

//admin routes
router.post('/create', authorizeAdmin, createProduct);
router.delete('/delete', authorizeAdmin, deleteProduct);
router.put('/update', authorizeAdmin, updateProduct);

//client routes
router.get('/', getAllProducts);
router.get('/category', getProductsByCategory);
router.get('/keyword', getProductsByKeyword);

export default router;
