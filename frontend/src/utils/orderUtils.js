import api from "../configs/axiosConfig";

export const createOrder = async (deliveryDetails, paymentOption) => {
    if (!deliveryDetails || !paymentOption || !(["cod","online"].includes(paymentOption))) {
        throw new Error("delivery details and payment option is required");
    }
    if (!deliveryDetails.fullName ||
        !deliveryDetails.phone ||
        !deliveryDetails.streetAddress ||
        !deliveryDetails.city ||
        !deliveryDetails.state
    ) {
        throw new Error("delivery details and payment option is required");
    }
    try{

        const response =await api.post('/orders',{
            deliveryDetails:{
                deliveryAddress:deliveryDetails
            },
            paymentMode:paymentOption
        })
        const payload = response.data;
        
        if(!(payload.success)){
            throw new Error("unable to place order");
        }
        return payload;
    }catch(e){
        console.log(e);
        throw e;
    }
}