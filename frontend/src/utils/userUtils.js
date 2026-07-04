import api from "../configs/axiosConfig";
import userStore from "../store/userStore";

export const getUser = async () => {
        const { name, phone, role, id } = userStore.getState();
        let user = {};
        if (!name || !phone || !role || !id) {
            const response = await api.get("/check-user");
            const payload = response?.data;
            const serverUser = payload?.user ;
            if (serverUser) {
                user = {
                    name: serverUser?.name || "",
                    phone: serverUser?.phone || "",
                    id: serverUser?._id || serverUser?.id || "",
                    role: serverUser?.role || "",
                };
                if (user.id) {
                    userStore.getState().setUser({ ...user });
                }
            }
        } else {
            user = { name, phone, role, id };
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
        id: serverUser?._id || serverUser?.id || "",
        role: serverUser?.role || "",
    };
    if (!normalizedUser.id) {
        throw new Error("user id missing from login response");
    }
    
    userStore.getState().setUser({ ...normalizedUser });
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
        id: serverUser?._id || serverUser?.id || "",
        role: serverUser?.role || "",
    };
    if (!normalizedUser.id) {
        throw new Error("user id missing from registration response");
    }
    
    userStore.getState().setUser({ ...normalizedUser });
    return normalizedUser;
}
export const logoutUser = async()=>{
    api.post("/auth/logout").then(()=>{
        userStore.getState().resetUser();
    });
}