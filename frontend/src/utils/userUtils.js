import api from "../configs/axiosConfig";
import userStore from "../store/userStore";

export const getUser = async () => {
    try {
        const { name, phone, role, id } = userStore.getState();
        let user = {};
        if (!name || !phone || !role || !id) {
            const response = await api.get("/check-user");
            const payload = response?.data;
            const serverUser = payload?.user ?? payload?.data ?? payload;
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
    } catch (e) {
        console.error("error getting user", e.message);
        return {};
    }
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
    const serverUser = payload?.user ?? payload?.data ?? payload;
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