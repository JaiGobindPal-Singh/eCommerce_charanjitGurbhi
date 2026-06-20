import express from 'express';
import { createProduct, deleteProduct, getAllProducts, getProductById, getProductsByCategory, getProductsByKeyword, updateProduct } from '../controllers/productController.js';
import upload from '../middleware/multerMiddleware.js'
import { authorizeAdmin } from '../middleware/authMiddleware.js';
const router = express.Router();

//admin routes
router.post('/create', authorizeAdmin, upload.single('img'), createProduct);
router.delete('/delete/:productId', authorizeAdmin, deleteProduct);
router.post('/update', authorizeAdmin, upload.single('img'), updateProduct);

//client routes
router.get('/', getAllProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/keyword/:productSearchKey', getProductsByKeyword);
router.get('/:id', getProductById);
export default router;
