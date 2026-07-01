import { NavLink } from "react-router-dom";
import { UserRound, ShoppingCart, X, Menu, House, ShoppingBasket, List, ReceiptText } from 'lucide-react';
import headerDecorator from "../assets/headerDecorator.png"
import companyLogo from "../assets/companyLogo1.png"
import { useState } from "react";

function HamburgerMenu({ menuOpen, toggleHamburger }) {
    const menuItemStyle = "text-main-background  hover:bg-white/20 transition-all duration-200 rounded-xl px-4 py-2 max-lg:px-2 max-lg:py-1 flex items-center flex gap-4";
    return (
        <>
            {menuOpen && <div onClick={() => toggleHamburger(false)} className="hmBackground absolute z-40 bg-black opacity-40 w-full h-full ">
            </div>}
            <div className={`hamburger z-50 bg-light-textcolor h-full w-48 fixed bottom-0 ${menuOpen ? "right-0" : "-right-52"} transition-all duration-500  `}>
                <X className="text-main-background absolute right-6 top-20 hover:bg-white hover:text-dark-textcolor rounded-lg " onClick={() => toggleHamburger(false)} />
                <div className="links px-5 text-base font-semibold w-full">
                    <div className="h-40 w-full"></div>

                    <NavLink to="/profile"
                        className={menuItemStyle}
                        style={({ isActive }) => ({
                            backgroundColor: isActive ? "var(--color-main-background)" : "",
                            color: isActive ? "var(--color-dark-textcolor" : ""
                        })}><UserRound /> Profile</NavLink>

                    <NavLink to="/"
                        className={menuItemStyle}
                        style={({ isActive }) => ({
                            backgroundColor: isActive ? "var(--color-main-background)" : "",
                            color: isActive ? "var(--color-dark-textcolor" : ""
                        })}><House />Home</NavLink>

                    <NavLink to="/products"
                        className={menuItemStyle}
                        style={({ isActive }) => ({
                            backgroundColor: isActive ? "var(--color-main-background)" : "",
                            color: isActive ? "var(--color-dark-textcolor" : ""
                        })}><ShoppingBasket />Products</NavLink>

                    <NavLink to="/categories"
                        className={menuItemStyle}
                        style={({ isActive }) => ({
                            backgroundColor: isActive ? "var(--color-main-background)" : "",
                            color: isActive ? "var(--color-dark-textcolor" : ""
                        })}><List />Categories</NavLink>

                    <NavLink to="/orders"
                        className={menuItemStyle}
                        style={({ isActive }) => ({
                            backgroundColor: isActive ? "var(--color-main-background)" : "",
                            color: isActive ? "var(--color-dark-textcolor" : ""
                        })}><ReceiptText />Orders</NavLink>
                </div>
            </div>
        </>
    )
}
export default function Header({ profileFunc, cartFunc }) {

    const [menuOpen, setMenuOpen] = useState(false);
    const toggleHamburger = (val) => {
        setMenuOpen(val);
    }
    const linkClass = "text-dark-textcolor hover:bg-light-textcolor hover:text-white transition-all duration-200 rounded-xl px-4 py-2 max-lg:px-2 max-lg:py-1 flex items-center max-md:hidden";

    const btnClass = "text-dark-textcolor hover:bg-light-textcolor hover:text-white transition-all duration-200 rounded-xl p-2";

    const menuClass = "text-dark-textcolor hover:bg-light-textcolor hover:text-white transition-all duration-200 rounded-xl p-2 md:hidden ";


    return (
        <header className="w-full h-38">
            <HamburgerMenu toggleHamburger={toggleHamburger} menuOpen={menuOpen} />
            <img src={headerDecorator} alt="Header design" className="w-full h-7" />
            <div className="flex items-center justify-between w-full gap-8 px-8 max-md:gap-4 max-md:px-4">
                <div className="flex">
                    <img src={companyLogo} alt="companyLogo" className="h-auto max-w-40 max-lg:max-w-32 max-md:max-w-24" />
                </div>

                <nav className="flex gap-5 ">
                    <div className="links flex gap-1 text-lg font-semibold max-lg:text-base">
                        <NavLink to="/"
                            className={linkClass}
                            style={({ isActive }) => ({
                                backgroundColor: isActive ? "var(--color-light-textcolor)" : "",
                                color: isActive ? "white" : ""
                            })}>Home</NavLink>

                        <NavLink to="/products"
                            className={linkClass}
                            style={({ isActive }) => ({
                                backgroundColor: isActive ? "var(--color-light-textcolor)" : "",
                                color: isActive ? "white" : ""
                            })}>Products</NavLink>

                        <NavLink to="/categories"
                            className={linkClass}
                            style={({ isActive }) => ({
                                backgroundColor: isActive ? "var(--color-light-textcolor)" : "",
                                color: isActive ? "white" : ""
                            })}>Categories</NavLink>

                        <NavLink to="/orders"
                            className={linkClass}
                            style={({ isActive }) => ({
                                backgroundColor: isActive ? "var(--color-light-textcolor)" : "",
                                color: isActive ? "white" : ""
                            })}>Orders</NavLink>

                    </div>
                </nav>
                <div className="options flex gap-2 items-center">
                    <button className={btnClass} onClick={cartFunc} ><ShoppingCart /></button>
                    <button className={btnClass + " max-md:hidden"} onClick={profileFunc}><UserRound /></button>
                    <button className={menuClass} onClick={() => { toggleHamburger(true) }} ><Menu /></button>
                </div>
            </div>
        </header>
    );
}
