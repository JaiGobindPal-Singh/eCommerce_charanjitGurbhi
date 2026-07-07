import { getAllCharges, updateCharge, deleteCharge, createCharge } from "../controllers/chargeController.js";
import { authenticateUser, authorizeAdmin } from '../middleware/authMiddleware.js';
import express from 'express';

const router = express.Router();

router.get('/', authenticateUser, getAllCharges);
router.put('/:chargeId', authorizeAdmin, updateCharge);
router.delete('/:chargeId', authorizeAdmin, deleteCharge);
router.post('/', authorizeAdmin, createCharge);

export default router;