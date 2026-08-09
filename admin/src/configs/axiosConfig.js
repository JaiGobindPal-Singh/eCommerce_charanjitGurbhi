import axios from "axios";

const api = axios.create({
    baseURL: "/api/v0",
    timeout: 30000,  //30s timeout
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // using cookies
});

export default api;