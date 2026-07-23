import { generateNotification } from "./notificationUtils";
import api from "../configs/axiosConfig";
import { getUser } from "./userUtils";

const findApplicableCharges = (user, cartTotal, charges) => {

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
    const userCity = user?.postalCode || "";
    const optionalCharges = charges
        .filter((ch) => {
            if (ch.fixed) return false;
            const cityExempt =
                ch.noChargeConditions?.postalCodes?.length ? ch.noChargeConditions?.postalCodes?.includes(userCity.trim()) ?? false : true;

            const minAmount = ch.noChargeConditions?.minAmount ?? 0;
            const amountExempt = minAmount > 0 ? cartTotal >= minAmount : true;
            return !(cityExempt && amountExempt);
        })
        .map((ch) => ({ [ch.chargeName]: ch.chargeAmount || calculateChargePercent(cartTotal, ch.chargePercent) }));

    return [...fixedCharges, ...optionalCharges]

}

export const getCharges = async (cartTotal)=>{
    try{
        const response = await api.get('/charges/');
        const user = await getUser();
        const payload = response.data;
        const charges = findApplicableCharges(user, cartTotal, payload.charges);
        return charges;
    }catch(e){
        generateNotification(e.response?.data?.error || e.message)();
    }
}