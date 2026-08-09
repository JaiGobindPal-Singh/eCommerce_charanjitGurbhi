import { NavLink } from "react-router-dom";
import { X, House, ShoppingBasket, List, ReceiptText, LogOut, TicketPercent } from 'lucide-react';
import { logoutUser } from "../../utils/userUtils";

function HamburgerMenu({ menuOpen, toggleHamburger }) {
    const menuItemStyle = "text-primary-color  hover:bg-white/20 transition-all duration-200 rounded-xl px-4 py-2 max-lg:px-2 max-lg:py-1 flex items-center flex gap-4";
    const handleLogout = () => {
        const surity = confirm("Are you sure you want to logout?");
        if (surity) {
            logoutUser();
            window.location.href = "/admin/login";  //refresh the page to redirect to login
        }
    }
    return (
        <>
            {menuOpen && <div onClick={() => toggleHamburger(false)} className="hmBackground fixed z-40 bg-black opacity-40 w-full h-screen " >
            </div>}
            <div className={`hamburger z-50 bg-color-heavy h-full w-48 top-0  fixed bottom-0 ${menuOpen ? "right-0" : "-right-52"} transition-all duration-500  `}>
                <X className="text-primary-color absolute right-6 top-4 hover:bg-color-medium hover:text-dark-textcolor rounded-lg " onClick={() => toggleHamburger(false)} />
                <div className="flex  flex-col justify-between h-full pb-8">


                    <div className="links px-5 text-base font-semibold w-full">
                        <div className="h-40 w-full"></div>
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
                            })}><TicketPercent/> Discounts</NavLink>
                    </div>
                    <div className="px-5 relative w-full">
                        <button
                            onClick={handleLogout}
                            className={" bg-primary-color/20 hover:bg-primary-color/60 hover:text-color-heavy font-semibold px-4 py-2 rounded-xl text-primary-color ml-auto flex flex-grow justify-center gap-1 w-full"}><LogOut /> Logout</button>
                    </div>
                </div>
            </div>
        </>
    )
}
export default HamburgerMenu;