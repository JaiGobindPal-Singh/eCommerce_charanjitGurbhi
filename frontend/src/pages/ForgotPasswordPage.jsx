import { useState } from "react";
import { forgotPassword } from "../utils/userUtils";
import { useNavigate } from "react-router-dom";
function ForgotPasswordPage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmP, setConfirmP] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e)=>{
    e.preventDefault();
    setIsSubmitting(true);
    await forgotPassword(name, phone, password);
    setIsSubmitting(false);
    navigate('/login');

  }
    return (
        <div className="min-h-[30rem] flex items-center justify-center bg-main-background px-4">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8">
                <h1 className="text-2xl font-semibold text-dark-textcolor mb-6 text-center">Forgot Password</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-dark-textcolor mb-1">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => { setName(e.target.value)}}
                            required={true}
                            placeholder="Enter your name"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-light-textcolor"
                        />
                        </div>
                    <div>
                        <label className="block text-sm text-dark-textcolor mb-1">Phone number</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => {setPhone(e.target.value)}}
                            required={true}
                            placeholder="e.g. 555 555 5555"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-light-textcolor"
                        />
          
                    </div>

                    <div>
                        <label className="block text-sm text-dark-textcolor mb-1">New Password</label>
                        <input
                            type="password"
                            value={password}
                            required={true}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-light-textcolor"
                        />
                        {(password && password.length < 8) && <span className="text-sm">password length must be atleast 8</span>}
                    </div>
                    <div>
                        <label className="block text-sm text-dark-textcolor mb-1">Confirm Password</label>
                        <input
                            type="text"
                            value={confirmP}
                            required={true}
                            onChange={(e) => setConfirmP(e.target.value)}
                            placeholder="Confirm Password"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-light-textcolor"
                        />
                        {(confirmP !== password) && <span className="text-sm">password and confirmation must be same</span>}
                    </div>

                    <button
                        type="submit"
                        className={`w-full bg-light-textcolor text-white font-semibold py-2 rounded-lg hover:opacity-95 transition`}
                        disabled = {isSubmitting || confirmP !== password || !name || !phone || !password || !confirmP}
                    >
                        Continue
                    </button>
                </form>

            </div>
        </div>
    );
}

export default ForgotPasswordPage
