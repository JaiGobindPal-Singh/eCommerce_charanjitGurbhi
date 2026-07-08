import express from 'express';
import { createOrder, getCancelledOrders, getCompletedOrders, getOrderDetails, getPendingOrders, getUserOrders, updateOrderStatus } from '../controllers/order.controller.js';
import { authenticateUser, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateUser, createOrder);
router.get('/', authenticateUser, getUserOrders);

router.patch('/status/:orderId', authorizeAdmin, updateOrderStatus);
router.get('/pending-orders', authorizeAdmin, getPendingOrders);
router.get('/completed-orders', authorizeAdmin, getCompletedOrders);
router.get('/cancelled-orders', authorizeAdmin, getCancelledOrders);

router.get('/:orderId', authenticateUser, getOrderDetails);
export default router;