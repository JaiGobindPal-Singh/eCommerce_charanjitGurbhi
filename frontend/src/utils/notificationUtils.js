import { toast } from "react-toastify"
export const generateNotification = (message) => {
    return () => toast(message, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true
    });
}