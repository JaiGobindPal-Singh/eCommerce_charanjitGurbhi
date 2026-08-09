import api from "../configs/axiosConfig";

export const createOrder = async (deliveryDetails, paymentOption, discountCode) => {
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
            paymentMode:paymentOption,
            discountCouponCode: discountCode
        })
        const payload = response.data;
        
        if(!(payload.success)){
            throw new Error("unable to place order");
        }
        return payload;
    }catch(e){
        console.log(e.response);
        throw e;
    }
}

export const getAllOrders = async (pn, ps) =>{
    const url = `/orders?pn=${pn || 1}&ps=${ps || 10}`;
    const res = await api.get(url);
    const orders = res.data;
    return orders;
}
export const getOrderdetails = async(orderId)=>{
    if(!orderId){
        return;
    }
    const url = `/orders/${orderId?.trim()}`
    const res = await api.get(url);
    const order = res.data;
    return order;
}