import { NavLink } from "react-router-dom"
import { House } from "lucide-react"
import { ShoppingBasket } from "lucide-react"
import { List } from "lucide-react"
import { ReceiptText, TicketPercent } from "lucide-react"
import { useEffect, useState } from "react";
import { getUser, logoutUser } from "../../utils/userUtils";
import { LogOut } from "lucide-react"
function Sidebar() {
    const handleLogout = () => {
        const surity = confirm("Are you sure you want to logout?");
        if (surity) {
            logoutUser();
            window.location.href = "/admin/login";  //refresh the page to redirect to login
        }
    }
    const [user, setUser] = useState(null);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUser();
                setUser(userData);
            } catch (error) {
                console.error("Failed to fetch user", error);
            }
        };

        fetchUser();
    }, []);
    const menuItemStyle = "text-primary-color  hover:bg-white/20 rounded-xl px-4 py-2 max-lg:px-2 max-lg:py-1 flex items-center flex gap-4";
    return (
        <div className="sticky top-0 z-20 hidden h-screen w-48 shrink-0 flex-col justify-between overflow-y-auto bg-color-heavy py-8 md:flex">
            <div className="links w-full px-5 text-base font-semibold">
                <h1 className="text-primary-color font-bold capitalize text-xl rounded-xl flex items-center gap-4 mb-12 mt-2">Hi {user?.name || "Admin"} 👋</h1>
                <NavLink to="/"
                    className={menuItemStyle}
                    style={({ isActive }) => ({
                        backgroundColor: isActive ? "var(--color-border-subtle)" : "",
                        color: isActive ? "var(--color-text-primary" : ""
                    })}><House />Dashboard</NavLink>

                <NavLink to="/orders"
                    className={menuItemStyle}
                    style={({ isActive }) => ({
                        backgroundColor: isActive ? "var(--color-border-subtle)" : "",
                        color: isActive ? "var(--color-text-primary" : ""
                    })}><ReceiptText />Orders</NavLink>
                    
                <NavLink to="/products"
                    className={menuItemStyle}
                    style={({ isActive }) => ({
                        backgroundColor: isActive ? "var(--color-border-subtle)" : "",
                        color: isActive ? "var(--color-text-primary" : ""
                    })}><ShoppingBasket />Products</NavLink>

                <NavLink to="/categories"
                    className={menuItemStyle}
                    style={({ isActive }) => ({
                        backgroundColor: isActive ? "var(--color-border-subtle)" : "",
                        color: isActive ? "var(--color-text-primary" : ""
                    })}><List />Categories</NavLink>

                <NavLink to="/discounts"
                    className={menuItemStyle}
                    style={({ isActive }) => ({
                        backgroundColor: isActive ? "var(--color-border-subtle)" : "",
                        color: isActive ? "var(--color-text-primary" : ""
                    })}><TicketPercent/>  Discounts</NavLink>



            </div>
            <div className="px-5">
                <button
                    onClick={handleLogout}
                    className={"bg-primary-color/20 hover:bg-primary-color/60 hover:text-color-heavy font-semibold px-4 py-2 rounded-xl text-primary-color ml-auto flex flex-grow justify-center gap-1 w-full"}><LogOut /> Logout</button>
            </div>
        </div>
    )
}

export default Sidebar
