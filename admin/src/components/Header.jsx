import { NavLink } from "react-router-dom";
import {  X, Menu, House, ShoppingBasket, List, ReceiptText } from 'lucide-react';
import { useEffect, useState } from "react";
import { getUser } from "../utils/userUtils";
function HamburgerMenu({ menuOpen, toggleHamburger }) {
    const menuItemStyle = "text-primary-color  hover:bg-white/20 transition-all duration-200 rounded-xl px-4 py-2 max-lg:px-2 max-lg:py-1 flex items-center flex gap-4";
    return (
        <>
            {menuOpen && <div onClick={() => toggleHamburger(false)} className="hmBackground fixed z-40 bg-black opacity-40 w-full h-screen " >
            </div>}
            <div className={`hamburger z-50 bg-color-heavy h-full w-48 top-0  fixed bottom-0 ${menuOpen ? "right-0" : "-right-52"} transition-all duration-500  `}>
                <X className="text-primary-color absolute right-6 top-4 hover:bg-color-medium hover:text-dark-textcolor rounded-lg " onClick={() => toggleHamburger(false)} />
                <div className="links px-5 text-base font-semibold w-full">
                    <div className="h-40 w-full"></div>
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
        </>
    )
}

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleHamburger = (val) => {
        setMenuOpen(val);
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
    

    const menuClass = "text-dark-textcolor hover:bg-color-heavy hover:text-white transition-all duration-200 rounded-xl p-2 md:hidden ";


    return (
        <>

            <HamburgerMenu toggleHamburger={toggleHamburger} menuOpen={menuOpen} />
            <header className="w-full h-14  z-30 sticky top-0 backdrop-blur-sm bg-gradient-to-r from-color-heavy to-color-medium md:hidden">
                <div className="flex items-center justify-between w-full h-full gap-8 px-4 ">
                    <h1 className="font-bold capitalize text-white text-xl ">Hello {user?.name} 👋</h1>
                    <button className={menuClass} onClick={() => { toggleHamburger(true) }} ><Menu /></button>
                </div>

            </header>
        </>
    );
}
