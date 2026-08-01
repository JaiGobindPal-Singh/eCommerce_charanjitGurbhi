import express from 'express';
import { createOrder, getCancelledOrders, getCompletedOrders, getOrderDetails, getPendingOrders, getUserOrders, updateOrderStatus, getAllOrders, getShippedOrders, getProcessingOrders } from '../controllers/order.controller.js';
import { authenticateUser, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateUser, createOrder);
router.get('/', authenticateUser, getUserOrders);

router.patch('/status/:orderId', authorizeAdmin, updateOrderStatus);
router.get('/pending', authorizeAdmin, getPendingOrders);
router.get('/completed', authorizeAdmin, getCompletedOrders);
router.get('/cancelled', authorizeAdmin, getCancelledOrders);
router.get('/all', authorizeAdmin, getAllOrders);
router.get('/shipped', authorizeAdmin, getShippedOrders);
router.get('/processing', authorizeAdmin, getProcessingOrders);

router.get('/:orderId', authenticateUser, getOrderDetails);
export default router;
