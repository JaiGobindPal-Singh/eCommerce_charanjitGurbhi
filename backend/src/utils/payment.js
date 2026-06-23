
//this function receives the payment amount, upi url and edit it based on amount and return new url
export const initializeUpiPayment = (upiUrl, amount) => {
    try {
        if(!upiUrl){
            throw new Error("upi url is required");
        }
        if(!amount || amount < 1){
            throw new Error("amount must be more than 0");
        }
        const amountUrl = `&am=${amount}`;
        const finalUpiUrl = upiUrl + amountUrl;
        return finalUpiUrl;
    } catch (error) {
        console.log("error initialize payment");
        throw error;
    }
}

//? will be implemented when payment gateway will be use now no need
export const confirmPayment = ()=>{
    return true;
}