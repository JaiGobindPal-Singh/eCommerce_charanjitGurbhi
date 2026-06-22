import express from 'express';
import {authenticateUser} from '../middleware/authMiddleware.js'
import { addToCart, clearCart, removeFromCart, updateQuantity, getCart, createCart } from '../controllers/cartController.js';
const router = express.Router();

router.post('/add', authenticateUser, addToCart);
router.delete('/remove/:productId', authenticateUser, removeFromCart);

router.delete('/clear', authenticateUser, clearCart);
router.put('/update', authenticateUser, updateQuantity);
router.get('/', authenticateUser, getCart);

router.post('/create', authenticateUser, createCart);

export default router
