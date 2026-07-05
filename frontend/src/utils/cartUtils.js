import { getFromLocalStorage } from "./localStorage";
import { getUser } from "./userUtils"
import useCartStore from "../store/cartStore";
import api from "../configs/axiosConfig";

export const getCart = async ()=>{
    //getting cart from store if already stored
    const {cartItems, totalBill} = useCartStore.getState();

    //returning cart from store if already stored
    if(cartItems) return {cartItems, totalBill};

    //checking if user is logged in and getting cart from backend if logged in, else getting cart from local storage
    const user = await getUser();
    if(!user?.id){
        const cartItems = getFromLocalStorage("cartItems") || [];
        const totalBill = getFromLocalStorage("totalBill") || 0;
        return {cartItems, totalBill};
    }

    //making api request
    const cart = await api.get("/cart");
    const payload = cart?.data;

    const {items, billing} = payload?.cart || {};
    const totalBillFromServer = billing?.totalBill || 0;
    return {cartItems: items || [], totalBillFromServer};
}