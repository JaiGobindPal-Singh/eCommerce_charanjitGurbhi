import { Menu } from "lucide-react";
import HamburgerMenu from "./HamburgerMenu";
import { useState } from "react";
import { useLocation } from "react-router-dom";


export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleHamburger = (val) => {
        setMenuOpen(val);
    }
    const location = useLocation();

    const routeTitles = {
        "/": "Dashboard",
        "/products": "Products",
        "/orders": "Orders",
        "/customers": "Customers",
    };

    const title = routeTitles[location.pathname] || (() => {
        const seg = location.pathname.split("/").filter(Boolean)[0];
        return seg ? seg.charAt(0).toUpperCase() + seg.slice(1) : "";
    })();

    const menuClass = "text-primary-color hover:bg-color-heavy hover:text-white transition-all duration-200 rounded-xl p-2 md:hidden ";
    return (
        <>

            <HamburgerMenu toggleHamburger={toggleHamburger} menuOpen={menuOpen} />
            <header className="w-full h-14  z-30 sticky top-0 backdrop-blur-sm bg-color-heavy to-color-medium md:hidden">
                <div className="flex items-center justify-between w-full h-full gap-8 px-4 ">
                    <div className="text-xl text-primary-color font-bold">{title}</div>
                    <button className={menuClass} onClick={() => { toggleHamburger(true) }} ><Menu /></button>
                </div>

            </header>
        </>
    );
}
