import { getUser } from "../utils/userUtils"
import companyLogo from '../assets/companyLogo.png'
import { useEffect, useState } from "react";
import { logoutUser } from "../utils/userUtils";
import { generateNotification } from "../utils/notificationUtils";
import { useNavigate } from "react-router-dom";

function ProfilePopup({ isProfileOpen, setIsProfileOpen }) {
    
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        getUser().then((usr) => {
            setUser(usr);
            setIsLoading(false);
        }).catch(() => {
            setIsLoading(false);
        });
    }, [isProfileOpen])

    const manageLogout =async ()=>{
        await logoutUser();
        generateNotification("Logged Out")();
        setIsProfileOpen(false);
        navigate('/login');
    }
    return (
        <>
            {
                isProfileOpen &&
                <div className={` max-md:hidden fixed bg-main-background border-dark-textcolor border-2 rounded-xl p-2 flex flex-col z-50 opacity-100 items-center h-80 w-60 right-6  top-20 gap-2 transition-all overflow-hidden duration-500 `}>
                    <div className="relative w-full h-4">
                        <div className="absolute right-2 px-1 text-xl font-semibold hover:bg-light-textcolor hover:text-main-background rounded-lg cursor-pointer" onClick={()=>setIsProfileOpen(false)}>X</div>
                    </div>
                    <div className="p-2 w-[80%] rounded-full overflow-hidden border-2 border-dark-textcolor"><img src={companyLogo} alt="" /></div>
                    
                    <div className="userD  ">
                        <h1 className="capitalize font-semibold text-2xl">
                        { !isLoading ? user.name : "--"}
                        </h1>
                        <p className="font-light text-sm text-center">
                            {!isLoading ? user.phone : "--"}
                        </p>
                        </div>
                        {user?.id && <button className="bg-light-textcolor px-2 py-1 rounded-xl text-main-background transition-all duration-150 border-2 font-semibold hover:scale-110" onClick={manageLogout}>Logout</button>}
                        {!user?.id && <button className="bg-light-textcolor px-2 py-1 rounded-xl text-main-background transition-all duration-150 border-2 font-semibold hover:scale-110" onClick={()=>{
                            setIsProfileOpen(false);
                            navigate('/register');
                        }}>Register or Login</button>}
                        
                </div>
            }
        </>

    )

}

export default ProfilePopup
