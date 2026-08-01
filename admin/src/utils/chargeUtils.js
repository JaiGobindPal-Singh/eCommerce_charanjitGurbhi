import api from "../configs/axiosConfig";
import { generateNotification } from "./notificationUtils";

export const getCharges = async () =>{
    try{
        const response = await api.get('charges/');
        const payload = response.data;
        return payload?.charges || [];
    }catch(e){
        console.log(e);
    }
}

export const createCharge = async ({chargeName, chargeAmount, fixed, chargePercent, noChargeConditions}) =>{
    try{
        const response = await api.post('charges/', {
            chargeName,
            chargeAmount,
            chargePercent,
            fixed: fixed ?? false,
            noChargeConditions: {
                minAmount:noChargeConditions.minAmount,
                postalCodes: noChargeConditions.postalCodes,
                paymentOption: noChargeConditions.paymentOption
            }
        });
        const payload = response.data;
        generateNotification("new charge Added")();
        return payload.charge;
    }catch(e){
        generateNotification("unable to create charge")();
        console.log(e.response);
    }
    
}

export const updateCharge = async (chargeId, {chargeName, chargeAmount, fixed, chargePercent, noChargeConditions}) =>{
    try{
        const res = api.put(`/charges/${chargeId.trim()}`,{
            chargeName,
            chargeAmount,
            chargePercent,
            fixed: fixed ?? false,
            noChargeConditions: {
                minAmount:noChargeConditions.minAmount,
                postalCodes: noChargeConditions.postalCodes,
                paymentOption: noChargeConditions.paymentOption
            }
        });
        const payload = (await res).data;
        generateNotification("charge Updated")();
        return payload.charge;
    }catch(e){
        generateNotification("unable to update charge")();
        console.log(e);
    }
}

export const deleteCharge = async (chargeId) =>{
    try{
        await api.delete(`charges/${chargeId}`);
        
        generateNotification("Deleted charge success")();
        return;
    }catch(e){
        generateNotification("unable to delete charge")();
        console.log(e);
    }
}