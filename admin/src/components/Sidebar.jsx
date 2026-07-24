import { NavLink } from "react-router-dom"
import { House } from "lucide-react"
import { ShoppingBasket } from "lucide-react"
import { List } from "lucide-react"
import { ReceiptText } from "lucide-react"
import { useEffect, useState } from "react";
import { getUser } from "../utils/userUtils";

function Sidebar() {
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

    <div className={`z-20 bg-color-heavy min-w-48 max-w-48 h-[100dvh] py-8 max-md:hidden`}>
                
                <div className="links px-5 text-base font-semibold w-full">
                    <h1 className="text-primary-color font-bold capitalize text-xl rounded-xl flex items-center gap-4 mb-12 mt-2">Hi {user?.name || "Admin"} 👋</h1>
                    <NavLink to="/"
                        className={menuItemStyle}
                        style={({ isActive }) => ({
                            backgroundColor: isActive ? "var(--color-border-subtle)" : "",
                            color: isActive ? "var(--color-text-primary" : ""
                        })}><House />Dashboard</NavLink>

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

                    <NavLink to="/orders"
                        className={menuItemStyle}
                        style={({ isActive }) => ({
                            backgroundColor: isActive ? "var(--color-border-subtle)" : "",
                            color: isActive ? "var(--color-text-primary" : ""
                        })}><ReceiptText />Orders</NavLink>
                </div>
            </div>  
  )
}

export default Sidebar
