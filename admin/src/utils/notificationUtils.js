import { toast } from "react-toastify"
export const generateNotification = (message) => {
    return () => toast(message, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        className: "bg-[#FFFFFF] text-[#212529] border border-[#E9ECEF] rounded-lg shadow-sm font-medium",
        progressClassName: "bg-[#6C757D]"
    });
}