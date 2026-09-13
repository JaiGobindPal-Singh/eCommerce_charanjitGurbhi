import api from "../configs/axiosConfig";
import userStore from "../store/userStore";
import { clearCartStore, getCart } from "./cartUtils";
import { generateNotification } from "./notificationUtils";
export const getUser = async () => {
        const { name, phone, role, id, streetAddress, city, state, postalCode } = userStore.getState();
        let user = {};
        if (!name || !phone || !role || !id) {
            const response = await api.get("/auth");
            const payload = response?.data;
            const serverUser = payload?.user ;
            if (serverUser) {
                user = {
                    name: serverUser?.name || "",
                    phone: serverUser?.phone || "",
                    id: serverUser?.id || "",
                    role: serverUser?.role || "",
                    streetAddress: serverUser?.streetAddress || "",
                    city: serverUser?.city || "",
                    state: serverUser?.state || "",
                    postalCode: serverUser?.postalCode || ""

                };
                if (user.id) {
                    userStore.getState().setUser({ ...user });
                }
            }
        } else {
            user = { name, phone, role, id, streetAddress, city, state, postalCode};
        }
        return user;
};
export const loginUser = async (phone, password) => {
    if (!phone || !password) {
        throw new Error("phone and password are required");
    }
    const response = await api.post("/auth/login", {
        phone,
        password,
    });
    const payload = response?.data;
    const serverUser = payload?.user;
    if (!serverUser) {
        throw new Error("user not found");
    }
    const normalizedUser = {
        name: serverUser?.name || "",
        phone: serverUser?.phone || "",
        id: serverUser?.id || "",
        role: serverUser?.role || "",
    };
    if (!normalizedUser.id) {
        throw new Error("user id missing from login response");
    }
    
    userStore.getState().setUser({ ...normalizedUser });
    getCart(true);  //to sync the cart with backend
    return normalizedUser;
};
export const registerUser = async(name, phone, password)=>{
    if(!name || !phone || !password){
        throw new Error("All registration credentials are required");
    }
    const response = await api.post("/auth/register", {
        name,
        phone,
        password,
    });
    const payload = response?.data;

    const serverUser = payload?.user ?? payload;
    if (!serverUser) {
        throw new Error("user not found");
    }
    const normalizedUser = {
        name: serverUser?.name || "",
        phone: serverUser?.phone || "",
        id: serverUser?.id || "",
        role: serverUser?.role || "",
    };
    if (!normalizedUser.id) {
        throw new Error("user id missing from registration response");
    }
    
    userStore.getState().setUser({ ...normalizedUser });
    getCart(true);  //to sync the cart with backend
    return normalizedUser;
}
export const logoutUser = async()=>{
    api.post("/auth/logout").then(()=>{
        clearCartStore();  //clearing cart on user logout
        userStore.getState().resetUser();
    });
}
/**
 * 
 * @param {String} name 
 * @param {Number} phone 
 * @param {String} password 
 */
export const forgotPassword = async(name, phone, password)=>{
    if(!name || !phone || !password){
        throw new Error("All credentials are required");
    }
    try{
        await api.post("/auth/forget", {
            name,
            phone,
            password,
        });
        generateNotification("password reset success! Login to Continue")();
    }catch(e){
        // console.log(e);
        generateNotification("unable to forget password")();
    }
        
}
export const setUserAddress = async (streetAddressP, cityP, stateP, postalCodeP) => {
    try{
        
        if(!streetAddressP || !cityP || !stateP || !postalCodeP ){
            generateNotification('Address Details are required')();  
            return;  
        }
        
        const {  streetAddress, city, state, postalCode } = userStore.getState();
        if(streetAddress === streetAddressP && city === cityP && state === stateP && postalCode === postalCodeP){
            return; // No changes, no need to update
        }
        await api.patch('/auth/set-address', {
            streetAddress: streetAddressP,
            city: cityP,
            state: stateP,
            postalCode: postalCodeP
        })
    }catch(e){
        console.error(e);
        generateNotification(e.response?.data?.error || e.message)();
    }
}