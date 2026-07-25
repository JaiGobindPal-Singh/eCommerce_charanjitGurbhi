import api from "../configs/axiosConfig";
import userStore from "../store/userStore";

export const getUser = async () => {
        const { name, phone, role, id } = userStore.getState();
        let user = {};
        if (!name || !phone || !role || !id) {
            const response = await api.get("/auth");
            const payload = response?.data;
            const serverUser = payload?.user ;

            //adminCheck
            if(serverUser?.role?.trim() != "admin"){
                return {};
            }

            if (serverUser) {
                user = {
                    name: serverUser?.name || "",
                    phone: serverUser?.phone || "",
                    id: serverUser?.id || "",
                    role: serverUser?.role || ""
                };
                if (user.id) {
                    userStore.getState().setUser({ ...user });
                }
            }
        } else {
            user = { name, phone, role, id};
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

    //check user logged is admin or not
    if (!serverUser && serverUser?.role?.trim() !== "admin") {
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
    return normalizedUser;
};

export const logoutUser = async()=>{
    api.post("/auth/logout").then(()=>{
        
    });
}
