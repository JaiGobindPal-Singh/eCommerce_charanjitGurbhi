import { getPaymentMethods, updatePaymentMethod} from "../controllers/paymentOptions.controller.js";
import { authenticateUser, authorizeAdmin } from "../middleware/authMiddleware.js";
import express from 'express';

const router = express.Router();

router.get('/', authenticateUser, getPaymentMethods);
router.put('/', authorizeAdmin, updatePaymentMethod);

export default router;
