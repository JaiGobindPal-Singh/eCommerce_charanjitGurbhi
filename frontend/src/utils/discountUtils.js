import api from "../configs/axiosConfig";

export const validateDiscount = async (code, cartValue) => {
    try {
        const damt = await api.post('/discounts/validate', {
            code: code,
            cartValue: cartValue
        });
        const payload = damt.data;
        if (payload.isValid) {
            return payload.discountAmount;
        }
        return 0;
    } catch (e) {
        // console.log(e.response);
        throw e;
    }
}