import Charge from "../models/charge.model.js";

export const getAllCharges = async (req, res)=>{
    try{
        const charges = await Charge.find({}).lean();
        return res.status(200).json({
            charges: charges.map((ch)=>{
                const {_id, __v, ...rest} = ch;
                rest.id = _id;
                return rest;
            })
        })
    }catch(e){
        return res.status(500).json({error:"Internal server error"});
    }
}

export const createCharge = async (req, res)=>{
    try{
        const {chargeName, chargeAmount, noChargeConditions} = req.body;
        //validating charge
        if(!chargeName || !chargeAmount || isNaN(Number(chargeAmount))){
            return res.status(400).json({error:"charge name and amount is required"});
        }
        //finding if charge exist
        const chargeExist = await Charge.find({
            chargeName: chargeName
        }).lean();
        if(chargeExist.length){
            return res.status(400).json({error:"charge already exist"});
        }
        //creating new charge
        const charge = new Charge({
            chargeName: chargeName,
            chargeAmount: chargeAmount,
            noChargeConditions: noChargeConditions
        });
        await charge.save();
        return res.status(201).json({
            charge: {
                chargeName:charge.chargeName,
                chargeAmount: charge.chargeAmount,
                noChargeConditions: charge.noChargeConditions,
                id:charge._id

            }
        });

    }catch(e){
        return res.status(500).json({error:"Internal server error"});
    }
}

export const updateCharge = async (req, res)=>{
    try{
        const {chargeId} = req.params;
        const {chargeName, chargeAmount, noChargeConditions } = req.body;
        //validating charge
        if(isNaN(Number(chargeAmount))){
            return res.status(400).json({error:"charge amount is required and must be a number"});
        }
        //finding if charge exist
        const chargeExist = await Charge.findById(chargeId);

        if(!chargeExist || !(Object.keys(chargeExist).length)){
            return res.status(404).json({error:"charge not found"});
        }
        //updating charge
        chargeExist.chargeName = chargeName? chargeName : chargeExist.chargeName;
        chargeExist.chargeAmount = chargeAmount? chargeAmount : chargeExist.chargeAmount;
        chargeExist.noChargeConditions = noChargeConditions? noChargeConditions : chargeExist.noChargeConditions;
        await chargeExist.save();
        
        return res.status(200).json({
            charge: {
                chargeName: chargeExist.chargeName,
                chargeAmount: chargeExist.chargeAmount,
                noChargeConditions: chargeExist.noChargeConditions,
                id: chargeExist._id
            }
        });
    }catch(e){
        return res.status(500).json({error:"Internal server error"});
    }
}

export const deleteCharge = async (req, res)=>{
    try{
        const {chargeId} = req.params;
        //finding if charge exist
        const chargeExist = await Charge.findById(chargeId).lean();
        if(!chargeExist){
            return res.status(404).json({error:"charge not found"});
        }
        //deleting charge
        await Charge.findByIdAndDelete(chargeId);
        return res.status(200).json({
            success: true,
        });
    }catch(e){
        return res.status(500).json({error:"Internal server error"});
    }
}