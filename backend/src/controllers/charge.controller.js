import Charge from "../models/charge.model.js";
import Cart from "../models/cart.model.js";
export const getAllCharges = async (req, res) => {
    try {
        const charges = await Charge.find({}).lean();
        return res.status(200).json({
            charges: charges.map((ch) => {
                const { _id, __v, ...rest } = ch;
                rest.id = _id;
                return rest;
            })
        })
    } catch (e) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const createCharge = async (req, res) => {
    try {
        const { chargeName, chargeAmount, chargePercent, noChargeConditions, fixed } = req.body;
        //validating charge
        if (chargeAmount && chargePercent) {
            return res.status(400).json({ error: "only single type of charge is applicable" });
        }
        if (!chargeName || (!chargeAmount && !chargePercent) || (isNaN(Number(chargeAmount)) && isNaN(Number(chargePercent)))) {
            return res.status(400).json({ error: "charge name and amount is required" });
        }
        //finding if charge exist
        const chargeExist = await Charge.find({
            chargeName: chargeName
        }).lean();
        if (chargeExist.length) {
            return res.status(400).json({ error: "charge already exist" });
        }
        //creating new charge
        const charge = new Charge({
            chargeName: chargeName,
            chargeAmount: chargeAmount,
            chargePercent: chargePercent,
            noChargeConditions: noChargeConditions,
            fixed: fixed ? true : false
        });
        await charge.save();
        return res.status(201).json({
            charge: {
                chargeName: charge.chargeName,
                chargeAmount: charge.chargeAmount,
                chargePercent: charge.chargePercent,
                noChargeConditions: charge.noChargeConditions,
                fixed: charge.fixed,
                id: charge._id
            }
        });

    } catch (e) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const updateCharge = async (req, res) => {
    try {
        const { chargeId } = req.params;
        const { chargeName, chargeAmount, noChargeConditions, chargePercent, fixed } = req.body;
        //validating charge
        if (isNaN(Number(chargeAmount)) && isNaN(Number(chargePercent))) {
            return res.status(400).json({ error: "charge amount is required and must be a number" });
        }
        //finding if charge exist
        const chargeExist = await Charge.findById(chargeId);

        if (!chargeExist || !(Object.keys(chargeExist).length)) {
            return res.status(404).json({ error: "charge not found" });
        }
        //updating charge
        chargeExist.chargeName = chargeName ? chargeName : chargeExist.chargeName;
        chargeExist.chargeAmount = chargeAmount ? chargeAmount : chargeExist.chargeAmount;
        chargeExist.noChargeConditions = noChargeConditions ? noChargeConditions : chargeExist.noChargeConditions;
        chargeExist.chargePercent = chargePercent ? chargePercent : chargeExist.chargePercent;
        chargeExist.fixed = fixed ? true : false;
        await chargeExist.save();

        return res.status(200).json({
            charge: {
                chargeName: chargeExist.chargeName,
                chargeAmount: chargeExist.chargeAmount,
                chargePercent: chargeExist.chargePercent,
                noChargeConditions: chargeExist.noChargeConditions,
                id: chargeExist._id,
                fixed: chargeExist.fixed
            }
        });
    } catch (e) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const deleteCharge = async (req, res) => {
    try {
        const { chargeId } = req.params;
        //finding if charge exist
        const chargeExist = await Charge.findById(chargeId).lean();
        if (!chargeExist) {
            return res.status(404).json({ error: "charge not found" });
        }
        //deleting charge
        await Charge.findByIdAndDelete(chargeId);
        return res.status(200).json({
            success: true,
        });
    } catch (e) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const getApplicableCharges = async (req, res) => {
    try {
        const findApplicableCharges = async (user, cart) => {
            //getting charges
            const charges = await Charge.find({}).lean();

            //no charges exist
            if (!(Object.keys(charges).length)) {
                return [];
            }

            const calculateChargePercent = (cartTotal, percent) => {
                return cartTotal * percent / 100;
            }
            //getting fixed charges
            const fixedCharges = charges
                .filter((ch) => ch.fixed)
                .map((ch) => ({ [ch.chargeName]: ch.chargeAmount || calculateChargePercent(cartTotal, ch.chargePercent) }));

            //evaluating optional charges
            const userCity = user?.address?.postalCode;
            const optionalCharges = charges
                .filter((ch) => {
                    if (ch.fixed) return false;

                    const cityExempt =
                        ch.noChargeConditions?.postalCodes?.length ? ch.noChargeConditions?.postalCodes?.includes(userCity) ?? false : true;

                    const minAmount = ch.noChargeConditions?.minAmount ?? 0;
                    const amountExempt = minAmount > 0 ? cartTotal >= minAmount : true;

                    return !(cityExempt && amountExempt);
                })
                .map((ch) => ({ [ch.chargeName]: ch.chargeAmount || calculateChargePercent(cartTotal, ch.chargePercent) }));

            return [...fixedCharges, ...optionalCharges]

        }

        //fetching  cart
        const cart = await Cart.findOne({ user: req.user.id })
        .populate("items.product", "price").lean();
        
        //calculate total cart amount 
        const cartTotal = cart?.items?.reduce((sum, item) => {
            return sum + (item.product?.price || 0) * item.quantity;
        }, 0) || 0;

        const charges = await findApplicableCharges(req.user, cart);

        //if no charges exist
        if (!(charges).length) {
            return res.status(200).json({
                charges: []
            })
        }

        return res.status(200).json({
            charges
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: "internal server error" });
    }
}