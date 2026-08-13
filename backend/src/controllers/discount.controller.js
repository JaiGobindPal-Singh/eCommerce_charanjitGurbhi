import Discount from "../models/discount.model.js";

export const createDiscountCoupon = async (req, res) => {
    try {

        const { code, description, discountType, discountValue, conditions, startDate, endDate } = req.body;
        const discount = new Discount({
            code,
            description,
            discountType,
            discountValue,
            startDate,
            endDate,
            conditions: {
                minCartValue: conditions?.minCartValue || 0,
                // isNewUserOnly: conditions?.isNewUserOnly || false,
                maxDiscountAmount: conditions?.maxDiscountAmount || null,
                usageLimitTotal: conditions?.usageLimitTotal || null,
            },
        });
        await discount.save();
        return res.status(201).json(discount);
    } catch (e) {
        console.error('Error creating discount:', e);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const getAllDiscountCoupons = async (req, res) => {
    try {
        const discounts = await Discount.find().lean();
        return res.status(200).json(discounts.map(discount => {
            const { _id, ...dis } = discount;
            return {
                id: _id,
                ...dis
            };
        }));
    } catch (e) {
        console.error('Error fetching discounts:', e);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const validateDiscountCoupon = async (req, res) => {
    try {
        const { code, cartValue } = req.body;
        const discount = await Discount.findOne({ code }).lean();
        if(!discount) {
            return res.status(404).json({ message: 'Discount coupon not found' });
        }
        // validation 
        if(!discount.isActive) {
            return res.status(400).json({ message: 'Discount coupon not found' });
        }
        //validate cartValue
        if(discount.conditions.minCartValue && cartValue < discount.conditions.minCartValue) {
            return res.status(400).json({ message: `Minimum cart value for this coupon is ${discount.conditions.minCartValue}` });
        }

        //validate usage limit
        if(discount.conditions.usageLimitTotal !== null && discount.conditions.usageLimitTotal <= 0) {
            return res.status(400).json({ message: 'Discount coupon not found' });
        }

        //calculate discount amount
        let discountAmount = 0;
        if(discount.discountType === 'FIXED') {
            discountAmount = discount.discountValue;
        } else if(discount.discountType === 'PERCENT') {
            discountAmount = (cartValue * discount.discountValue) / 100;
        }

        //apply max discount amount if applicable
        if(discount.conditions.maxDiscountAmount !== null && discountAmount > discount.conditions.maxDiscountAmount) {
            discountAmount = discount.conditions.maxDiscountAmount;
        }

        discountAmount = Math.min(discountAmount, cartValue);

        return res.status(200).json({ isValid: true, discountAmount });

    }catch (e) {
        console.error('Error validating discount:', e);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const updateDiscountCoupon = async (req, res) => {  
    try {
        const { id } = req.params;
        const { code, description, discountType, discountValue, conditions, startDate, endDate, active } = req.body;
        const discount = await Discount.findByIdAndUpdate(id, {
            code,
            description,
            discountType,
            discountValue,
            startDate,
            endDate,
            isActive: active,
            conditions: {
                minCartValue: conditions?.minCartValue || 0,
                // isNewUserOnly: conditions?.isNewUserOnly || false,
                maxDiscountAmount: conditions?.maxDiscountAmount || null,
                usageLimitTotal: conditions?.usageLimitTotal || null,
            },
        }, { new: true });
        return res.status(200).json(discount);
    } catch (e) {
        console.error('Error updating discount:', e);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
export const deleteDiscountCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        await Discount.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Discount coupon deleted successfully' });
    } catch (e) {
        console.error('Error deleting discount:', e);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
export const getDiscountCouponByCode = async (req, res) => {
    try {
        const { code } = req.params;
        const discount = await Discount.findOne({ code }).lean();
        if(!discount) {
            return res.status(404).json({ message: 'Discount coupon not found' });
        }
        const { _id, ...dis } = discount;
        return res.status(200).json({
            id: _id,
            ...dis
        });
    } catch (e) {
        console.error('Error fetching discount:', e);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
export const getDiscountCouponById = async (req, res) => {
    try {
        const { id } = req.params;
        const discount = await Discount.findById(id).lean();
        if(!discount) {
            return res.status(404).json({ message: 'Discount coupon not found' });
        }
        const { _id, ...dis } = discount;
        return res.status(200).json({
            id: _id,
            ...dis
        });
    } catch (e) {
        console.error('Error fetching discount:', e);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
