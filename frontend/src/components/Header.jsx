import { NavLink } from "react-router-dom";
import { Search, UserRound, ShoppingCart } from 'lucide-react';
import headerDecorator from "../assets/headerDecorator.png"
import companyLogo from "../assets/companyLogo1.png"

export default function Header({searchFunc, profileFunc, cartFunc}) {
    const linkClass = "text-dark-textcolor hover:bg-light-textcolor hover:text-white transition-all transition-normal rounded-xl pl-4 pr-4 pt-2 pb-2 max-lg:pl-2 max-lg:pr-2 max-lg:pt-1 max-lg:pb-1 flex items-center";

    const btnClass = "text-dark-textcolor hover:bg-light-textcolor hover:text-white transition-all transition-normal rounded-xl p-2 ";

    return (
        <header className="w-full">
            <img src={headerDecorator} alt="Header design" className="w-full h-7" />
            <div className="flex items-center justify-between w-full gap-8 pl-15 pr-15 max-lg:pl-10 max-lg:pr-10 ">
                <div className="flex ">
                    <img src={companyLogo} alt="companyLogo" className="h-auto max-w-40 max-lg:max-w-30" />
                </div>
                
                    <nav className="flex gap-5 max-lg:gap-5">
                        <div className="links flex gap-1 text-[1.2rem] font-semibold max-lg:text-[1rem]">
                            <NavLink to="/"
                                className={linkClass}
                                style={({ isActive }) => ({
                                    backgroundColor: isActive? "var(--color-light-textcolor)":"",
                                    color:isActive?"white":""
                                })}>Home</NavLink>

                            <NavLink to="/products"
                                className={linkClass}
                                style={({ isActive }) => ({
                                    backgroundColor: isActive? "var(--color-light-textcolor)":"",
                                    color:isActive?"white":""
                                })}>Products</NavLink>

                            <NavLink to="/categories"
                                className={linkClass}
                                style={({ isActive }) => ({
                                    backgroundColor: isActive? "var(--color-light-textcolor)":"",
                                    color:isActive?"white":""
                                })}>Categories</NavLink>

                            <NavLink to="/orders"
                                className={linkClass}
                                style={({ isActive }) => ({
                                    backgroundColor: isActive? "var(--color-light-textcolor)":"",
                                    color:isActive?"white":""
                                })}>Orders</NavLink>

                            <NavLink to="/about"
                                className={linkClass}
                                style={({ isActive }) => ({
                                    backgroundColor: isActive? "var(--color-light-textcolor)":"",
                                    color:isActive?"white":""
                                })}>About</NavLink>

                            <NavLink to="/contact"
                                className={linkClass}
                                style={({ isActive }) => ({
                                    backgroundColor: isActive? "var(--color-light-textcolor)":"",
                                    color:isActive?"white":""
                                })}>Contact</NavLink>
                        </div>
                    </nav>
                        <div className="options flex gap-2 items-center">
                            <button className={btnClass} onClick={searchFunc}><Search  /></button>
                            <button className={btnClass} onClick={profileFunc}><UserRound  /></button>
                            <button className={btnClass} onClick={cartFunc} ><ShoppingCart /></button>
                        </div>
                </div>
        </header>
    );
}
