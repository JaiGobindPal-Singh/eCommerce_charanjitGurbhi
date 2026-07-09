import { getAllCharges, updateCharge, deleteCharge, createCharge, getApplicableCharges } from "../controllers/charge.controller.js";
import { authenticateUser, authorizeAdmin } from '../middleware/authMiddleware.js';
import express from 'express';

const router = express.Router();

router.get('/', authorizeAdmin, getAllCharges);
router.post('/', authorizeAdmin, createCharge);

router.get('/applicable-charges', authenticateUser, getApplicableCharges);
router.put('/:chargeId', authorizeAdmin, updateCharge);
router.delete('/:chargeId', authorizeAdmin, deleteCharge);

export default router;