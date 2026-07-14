import api from "../configs/axiosConfig";
import { generateNotification } from "./notificationUtils";
export const getPaymentOptions = async () =>{
    try{
        const paymentOptions = await api.get('payment-options');
        const payload = paymentOptions.data;
        return (payload.paymentOptions);
    }catch(e){
        generateNotification(e.response?.data?.error || e.message)();
    }
}