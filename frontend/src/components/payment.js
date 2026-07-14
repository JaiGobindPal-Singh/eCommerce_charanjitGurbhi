import { getUser } from "../utils/userUtils";


export async function verifyOrderPayment(response){
  //todo impliment verification
  return;
}
export function initiatePayment(razorpayKey, razorpayOrderId, order) {
  const user = getUser()
  const options = {
    key: razorpayKey,
    amount: order.totalBill * 100,
    currency: 'INR',
    name: "GH Products",
    order_id: razorpayOrderId,
    handler: function (response) {
      // This block fires upon user payment completion
      alert(`Payment Successful! ID: ${response.razorpay_payment_id}`);
      verifyOrderPayment(response);
    },
    prefill: {
      name: user.name || "",
      contact: user.phone,
    },
    notes: {
      address: "Corporate Office",
    },
    theme: {
      color: "#3399cc",
    }
  };
  const rzp = new window.Razorpay(options);
  rzp.open();
}




