import { getFromLocalStorage, saveToLocalStorage } from "./localStorage";
import { getUser } from "./userUtils"
import useCartStore from "../store/cartStore";
import api from "../configs/axiosConfig";

export const getCart = async ()=>{
    //getting cart from store if already stored
    const {cartItems} = useCartStore.getState();

    //returning cart from store if already stored
    if(cartItems && cartItems.length){
        return {cartItems};
    } 

    //checking if user is logged in and getting cart from backend if logged in, else getting cart from local storage
    const user = await getUser();
    if(!user?.id){
        const cartItems = JSON.parse(getFromLocalStorage("cartItems")) || [];
        useCartStore.getState().setCart(cartItems);
        return {cartItems};
    }

    //making api request
    const cart = await api.get("/cart");
    const payload = cart?.data;
    const {items} = payload?.cart || {};

    //saving data to store adn returning response
    useCartStore.getState().setCart(items || []);
    return {cartItems: items || [],};
}

export const addToCart = async (product, quantity)=>{
    const user = await getUser();
    
    // storing to local storage if user is not logged in
    if(!user?.id){
        const cartItems = JSON.parse(getFromLocalStorage("cartItems")) || [];
        cartItems.push({
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity: quantity,
        });
        saveToLocalStorage("cartItems", JSON.stringify(cartItems));
    }
    else{   
        //storing to backend if user is logged in
        const response = await api.post('/cart/add', {
            productId: product.id,
            quantity: quantity,
        });
        const payload = response?.data;
        if(!payload?.success){
            throw new Error("Failed to add item to cart");
        }
    }
    //storing item to store cache
    useCartStore.getState().addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: quantity,
    });

}

export const removeFromCart = async (product)=>{
    const user = await getUser();
    //removing from local storage if user is not logged in
    if(!user?.id){
        const cartItems = JSON.parse(getFromLocalStorage("cartItems")) || [];
        const updatedCartItems = cartItems.filter((item)=> item.id !== product.id);
        saveToLocalStorage("cartItems", JSON.stringify(updatedCartItems));
    }
    else{
        //removing from backend if user is logged in
        const response = await api.post(`/cart/remove/${product.id}`);
        const payload = response?.data;
        if(!payload?.success){
            throw new Error("Failed to remove item from cart");
        }
    }
    //update store
    useCartStore.getState().removeFromCart(product.id);
}

export const updateQuantity = async (product, quantity)=>{
    //todo here
}