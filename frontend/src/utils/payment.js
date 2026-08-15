import { getUser } from "./userUtils";
import companyLogo from '../assets/companyLogo.png'
import api from "../configs/axiosConfig";
import { clearCartStore } from "./cartUtils";

export async function verifyOrderPayment(response) {
  const res = await api.post('/orders/verify', {
    payment_id: response.razorpay_payment_id,
    order_id: response.razorpay_order_id,
    signature: response.razorpay_signature
  });
  const payload = res.data;
  if (payload.success) {
    clearCartStore();
  }
  return payload;

}

export async function initiatePayment(razorpayKey, razorpayOrderId, order, toggleSuccessPage) {
  const user = await getUser()
  const options = {
    key: razorpayKey,
    amount: order.totalBill * 100,
    currency: 'INR',
    name: "GH Products",
    image: companyLogo,
    order_id: razorpayOrderId,

    handler: function () {
      clearCartStore();
      toggleSuccessPage(true);
    },
    modal:{
      ondismiss: async function(){
        try{
          await api.post(`/razorpay/dismiss-payment/${razorpayOrderId}`);
        }catch(e){
          console.log(e);
          //ignore erorrs
        }
      }
    },

    prefill: {
      name: user.name || "",
      contact: user.phone,
      phone: user.phone
    },
    theme: {
      color: "#FDF5E9",
    },
    retry: {
      "enabled": false
    },
  };
  const rzp = new window.Razorpay(options);
  rzp.open();
}




