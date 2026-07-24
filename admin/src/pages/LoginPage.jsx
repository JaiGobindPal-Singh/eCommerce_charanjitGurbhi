import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getUser, loginUser } from "../utils/userUtils.js";
import { generateNotification } from "../utils/notificationUtils.js";
export default function LoginPage() {
    const navigate = useNavigate();

    useEffect(() => {
        getUser().then((user) => {
            //user already logged in and is admin navigate to home
            if (user?.id && user?.role?.trim() == "admin") {
                navigate("/");
            }
        }).catch(e=>console.log("error getting user " + e.message));
    }, [navigate])

    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [invalidPhone, setInvalidPhone] = useState(false);
    const [invalidPass, setinvalidPass] = useState(false);


    const handleSubmit = (e) => {
        e.preventDefault();

        if (phone.trim().length != 10 || isNaN(Number(phone.trim()))) {
            setInvalidPhone(true);
            return;
        }
        if (password.trim().length < 2) {
            setinvalidPass(true);
            return;
        }
        loginUser(phone,password).then(()=>{
            generateNotification("Welcome Back")();
            navigate('/');
        }).catch((e)=>{
            generateNotification(e.response?.data?.error || e.message)();
            setPassword("");
        })
        

    };

    return (
        <div className="min-h-screen h-full w-full flex items-center justify-center bg-color-light px-4">
            <div className="w-full max-w-md bg-color-medium/20  backdrop-blur-sm rounded-xl shadow-lg p-8">
                <h1 className="text-2xl font-semibold text-color-heavy mb-6 text-center">Welcome Admin!</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-color-heavy mb-1">Phone number</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => { setInvalidPhone(false); setPhone(e.target.value) }}
                            required={true}
                            placeholder="e.g. 555 555 5555"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-light-textcolor"
                        />
                        {invalidPhone && <span className=" text-sm rounded-xl">! Invalid phone number</span>}
                    </div>

                    <div>
                        <label className="block text-sm text-color-heavy mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            required={true}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-light-textcolor"
                        />
                        {invalidPass && <span className="text-sm">password length must be atleast 8</span>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-color-heavy text-white font-semibold py-2 rounded-lg hover:opacity-95 transition"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
