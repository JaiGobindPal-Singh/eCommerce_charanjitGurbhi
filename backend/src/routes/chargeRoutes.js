import { getAllCharges, updateCharge, deleteCharge, createCharge, getApplicableCharges } from "../controllers/chargeController.js";
import { authenticateUser, authorizeAdmin } from '../middleware/authMiddleware.js';
import express from 'express';

const router = express.Router();

router.get('/', authenticateUser, getAllCharges);
router.get('/applicable-charges', authenticateUser, getApplicableCharges);
router.put('/:chargeId', authorizeAdmin, updateCharge);
router.delete('/:chargeId', authorizeAdmin, deleteCharge);
router.post('/', authorizeAdmin, createCharge);

export default router;