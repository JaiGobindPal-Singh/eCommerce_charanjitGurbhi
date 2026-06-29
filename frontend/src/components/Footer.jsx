import companyLogo from '../assets/companyLogo.png'
import { NavLink } from 'react-router-dom'
export default function Footer() {
  return (
    <footer className="w-full bg-main-background text-dark-textcolor py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-8 lg:w-1/3">
          <div className="flex items-center gap-4">
            <img src={companyLogo} className="w-36 md:w-48" alt="Company logo" />
            <div>
              <h2 className="text-2xl font-bold">GH Products</h2>
              <p className="text-sm text-light-textcolor/80 mt-1">Quality products delivered fast.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <NavLink to="/" className="hover:underline text-sm text-dark-textcolor transition-colors duration-200 hover:text-light-textcolor">Home</NavLink>
            <NavLink to="/products" className="hover:underline text-sm text-dark-textcolor transition-colors duration-200 hover:text-light-textcolor">Products</NavLink>
            <NavLink to="/categories" className="hover:underline text-sm text-dark-textcolor transition-colors duration-200 hover:text-light-textcolor">Categories</NavLink>
            <NavLink to="/orders" className="hover:underline text-sm text-dark-textcolor transition-colors duration-200 hover:text-light-textcolor">Orders</NavLink>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:w-2/3">
          <div className="grid gap-8 md:grid-cols-[320px_auto] items-start ">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3397.671753076301!2d74.868374!3d31.615452999999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzHCsDM2JzU1LjYiTiA3NMKwNTInMDYuMiJF!5e0!3m2!1sen!2sin!4v1782640435797!5m2!1sen!2sin"
              loading="lazy"
              className="h-56 w-full rounded-xl border border-dark-textcolor  "
              title="Company location"
            ></iframe>
            <div className="flex flex-col justify-center gap-4 rounded-xl border border-dark-textcolor bg-section-background p-6 text-sm sm:text-base">
              <div>
                <p className="text-light-textcolor uppercase tracking-widest text-xs">Mail</p>
                <p className="font-semibold text-dark-textcolor">abc@gmail.com</p>
              </div>
              <div>
                <p className="text-light-textcolor uppercase tracking-widest text-xs">Phone</p>
                <p className="font-semibold text-dark-textcolor">+91 1234567890</p>
              </div>
              <div>
                <p className="text-light-textcolor uppercase tracking-widest text-xs">Address</p>
                <p className="font-semibold text-dark-textcolor leading-relaxed">
                  kallu Da Akadfkjdfkjdksfjksd dkjflkadsjfkjsdf dskjfklds fskdjflkd
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </footer>
  )
}
