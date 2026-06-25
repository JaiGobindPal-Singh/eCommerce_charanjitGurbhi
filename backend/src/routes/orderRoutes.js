import express from 'express';
import { createOrder, getCancelledOrders, getCompletedOrders, getOrderDetails, getPendingOrders, getUserOrders, updateOrderStatus } from '../controllers/orderController.js';
import { authenticateUser, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', authenticateUser, createOrder);
router.patch('/update-status/:orderId', authorizeAdmin, updateOrderStatus);
router.get('/', authenticateUser, getUserOrders);
router.get('/pending-orders', authorizeAdmin, getPendingOrders);
router.get('/completed-orders', authorizeAdmin, getCompletedOrders);
router.get('/cancelled-orders', authorizeAdmin, getCancelledOrders);

router.get('/:orderId', authenticateUser, getOrderDetails);
export default router;