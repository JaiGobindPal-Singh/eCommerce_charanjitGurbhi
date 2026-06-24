import express from 'express';
import { createOrder, getOrderDetails, getUserOrders, updateOrderStatus } from '../controllers/orderController.js';
import { authenticateUser, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', authenticateUser, createOrder);
router.patch('/update-status/:orderId', authorizeAdmin, updateOrderStatus);
router.get('/', authenticateUser, getUserOrders);
router.get('/:orderId', authenticateUser, getOrderDetails);

export default router;