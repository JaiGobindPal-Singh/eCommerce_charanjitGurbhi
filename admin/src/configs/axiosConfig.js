import axios from "axios";

const api = axios.create({
    //using server during dev
    baseURL: "http://127.0.0.1:5000/api/v0",
    timeout: 30000,  //30s timeout
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // using cookies
});

export default api;