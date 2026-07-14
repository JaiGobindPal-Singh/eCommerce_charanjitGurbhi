import { generateNotification } from "./notificationUtils";
import api from "../configs/axiosConfig";
export const getCharges = async ()=>{
    try{
        const response = await api.get('/charges/applicable-charges');
        const payload = response.data;
        return payload.charges;
    }catch(e){
        generateNotification(e.response?.data?.error || e.message)();
    }
}