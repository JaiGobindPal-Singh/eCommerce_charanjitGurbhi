import { getPaymentMethods, updatePaymentMethod, removePaymentMethod,addPaymentMethod } from "../controllers/paymentController.js";
import { authenticateUser, authorizeAdmin } from "../middleware/authMiddleware.js";
import express from 'express';

const router = express.Router();

router.get('/', authenticateUser, getPaymentMethods);
router.put('/update/:paymentOptionId', authorizeAdmin, updatePaymentMethod);
router.delete('/remove/:paymentOptionId', authorizeAdmin, removePaymentMethod);
router.post('/add', authorizeAdmin, addPaymentMethod);

export default router;
