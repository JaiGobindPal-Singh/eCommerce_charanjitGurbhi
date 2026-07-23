import companyLogo from '../assets/companyLogo.png'
import { NavLink } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="w-full bg-main-background py-12 text-dark-textcolor">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center justify-center rounded-xl border border-dark-textcolor/20 bg-section-background text-center py-2">
            <img src={companyLogo} className="w-48 max-md:w-36" alt="Company logo" />
            
          </div>

          <div className="min-h-[240px] rounded-xl border border-dark-textcolor/20 bg-section-background p-2">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3397.6474010290076!2d74.869038!3d31.6161201!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39197b574522d7c5%3A0xc1e18e631c58a6c4!2sGurmukh%20Singh%20Harbhajan%20Singh!5e0!3m2!1sen!2sin!4v1783060218679!5m2!1sen!2sin"
              loading="lazy"
              className="h-full min-h-[220px] w-full rounded-lg border-0"
              title="Company location"
            ></iframe>
          </div>

          <div className="flex min-h-[240px] flex-col justify-center gap-2 rounded-xl border border-dark-textcolor/20 bg-section-background p-4 text-sm sm:text-base">
            <div>
              <p className="text-xs uppercase tracking-widest text-light-textcolor">Mail</p>
              <p className="font-semibold text-dark-textcolor">ghmeetproducts@gmail.com</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-light-textcolor">Phone</p>
              <p className="font-semibold text-dark-textcolor">+91 9780464951</p>
              <p className="font-semibold text-dark-textcolor">+91 9988519066</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-light-textcolor">Address</p>
              <p className="font-semibold leading-relaxed text-dark-textcolor">
                Chowk Quilla Bhangian, Namak Mandi, Amritsar (143001)
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-light-textcolor">GSTIN</p>
              <p className="font-semibold leading-relaxed text-dark-textcolor">03AOKPS9915E1ZQ</p>
            </div>
          </div>

          <div className="flex min-h-[240px] flex-col  text-left justify-center gap-2 rounded-xl border border-dark-textcolor/20 bg-section-background p-4">

            <NavLink to="/" className="font-semibold text-dark-textcolor transition-colors duration-200 hover:text-light-textcolor hover:underline">
              Home
            </NavLink>
            <NavLink to="/products" className="font-semibold text-dark-textcolor transition-colors duration-200 hover:text-light-textcolor hover:underline">
              Products
            </NavLink>
            <NavLink to="/categories" className="font-semibold text-dark-textcolor transition-colors duration-200 hover:text-light-textcolor hover:underline">
              Categories
            </NavLink>
            <NavLink to="/orders" className="font-semibold text-dark-textcolor transition-colors duration-200 hover:text-light-textcolor hover:underline">
              Orders
            </NavLink>
            <NavLink to="/orders" className="font-semibold text-dark-textcolor transition-colors duration-200 hover:text-light-textcolor hover:underline">
              T&C
            </NavLink>
            <NavLink to="/orders" className="font-semibold text-dark-textcolor transition-colors duration-200 hover:text-light-textcolor hover:underline">
              Privacy Policy
            </NavLink>
          </div>
          </div>
      </div>
    </footer>
  )
}
