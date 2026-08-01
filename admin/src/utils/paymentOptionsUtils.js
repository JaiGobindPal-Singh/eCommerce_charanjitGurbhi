import api from "../configs/axiosConfig";
import { generateNotification } from "./notificationUtils";

export const updatePaymentOptions = async (options) => {
    try{
        const {onlineStatus, codStatus, allowedPostalCodes } = options;
        const response = await api.put("/payment-options", {
            online: onlineStatus,
            cod: codStatus,
            allowedPostalCodes: Array.isArray(allowedPostalCodes) && allowedPostalCodes.length ? allowedPostalCodes : []
        });
        const payload = response.data;
        if(payload){
            generateNotification("updated payment options")();
            return payload.paymentOptions;
        }
        generateNotification("unable to update payment option")();
    }catch(e){
        generateNotification("unable to update payment option")();
        console.log("Error setting payment options: ", e)
    }
}

export const getPaymentOptions = async () =>{
    try{
        const paymentOptions = await api.get('payment-options');
        const payload = paymentOptions.data;
        return (payload.paymentOptions);
    }catch(e){
        generateNotification(e.response?.data?.error || e.message)();
    }
}