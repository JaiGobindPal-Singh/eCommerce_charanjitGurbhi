import { authenticateUser, authorizeAdmin } from "../middleware/authMiddleware.js";
import { createDiscountCoupon, getAllDiscountCoupons, validateDiscountCoupon, updateDiscountCoupon, deleteDiscountCoupon, getDiscountCouponByCode, getDiscountCouponById } from "../controllers/discount.controller.js";
import express from "express";

const router = express.Router();

router.post('/', authorizeAdmin, createDiscountCoupon);
router.get('/', getAllDiscountCoupons);
router.get('/validate', validateDiscountCoupon);
router.get('/:id', authorizeAdmin, getDiscountCouponById);
router.get('/code/:code', getDiscountCouponByCode);
router.put('/:id', authorizeAdmin, updateDiscountCoupon);
router.delete('/:id', authorizeAdmin, deleteDiscountCoupon);

export default router;
