import { generateNotification } from "./notificationUtils"
import api from "../configs/axiosConfig"
export const createDiscount = async ({code, description, discountType, discountValue, startDate, endDate, conditions} ) => {
    try{
        const response = await api.post("/discounts", {
            code,
            description,
            discountType,
            discountValue,
            startDate,
            endDate,
            conditions:{
                minCartValue: conditions.minCartValue || null,
                maxDiscountAmount: conditions.maxDiscountAmount || null,
            }
        });
        const payload = response.data;
        return payload;
    }catch(e){
        generateNotification("Error creating discount: " )();
        console.log(e);
    }
}

export const getDiscounts = async () => {
    try{
        const response = await api.get("/discounts");
        const payload = response.data;
        return payload;
    }catch(e){
        generateNotification("Error fetching discounts: " )();
        console.log(e);
    }
}

// export const validateDiscountCode = async (code, cartValue) => {
//     try{
//         const response = await api.get(`/discounts/validate`, {
//             code,
//             cartValue
//         });
//         const payload = response.data;
//         return payload;
//     }catch(e){
//         generateNotification("Error validating discount code: " )();
//         console.log(e);
//     }
// }
export const updateDiscount = async ({id, code, description, discountType, discountValue, startDate, endDate, conditions, active} ) => {
    try{
        const response = await api.put(`/discounts/${id}`, {
            code,
            description,
            discountType,
            discountValue,
            startDate,
            endDate,
            active,
            conditions:{
                minCartValue: conditions.minCartValue || null,
                maxDiscountAmount: conditions.maxDiscountAmount || null,
            }
        });
        const payload = response.data;
        return payload;
    }catch(e){
        generateNotification("Error updating discount: " )();
        console.log(e);
    }
}

export const deleteDiscount = async (id) => {
    try{
        const response = await api.delete(`/discounts/${id}`);
        const payload = response.data;
        return payload;
    }
    catch(e){
        generateNotification("Error deleting discount: " )();
        console.log(e);
    }   
}

export const getDiscountByCode = async (code) => {
    try{
        const response = await api.get(`/discounts/code/${code}`);
        const payload = response.data;
        return payload;
    }
    catch(e){
        generateNotification("Error fetching discount by code: " )();
        console.log(e);
    }
}