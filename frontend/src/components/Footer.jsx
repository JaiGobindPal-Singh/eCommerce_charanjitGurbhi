import companyLogo from '../assets/companyLogo.png'
import zaikaLogo from '../assets/zaikaLogo.png'
import { NavLink } from 'react-router-dom'
export default function Footer() {
  return (
    <footer className="w-full bg-main-background text-dark-textcolor py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-8 lg:w-1/3 justify-center h-[17.5rem]">
          <div className="flex items-center  justify-center gap-4">
            <img src={companyLogo} className="w-36 md:w-48" alt="Company logo" />
            <img src={zaikaLogo} className="w-32 md:w-44" alt="Company logo" />
            
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 justify-items-center">
            <NavLink to="/" className="hover:underline text-sm text-dark-textcolor transition-colors duration-200 hover:text-light-textcolor">Home</NavLink>
            <NavLink to="/products" className="hover:underline text-sm text-dark-textcolor transition-colors duration-200 hover:text-light-textcolor">Products</NavLink>
            <NavLink to="/categories" className="hover:underline text-sm text-dark-textcolor transition-colors duration-200 hover:text-light-textcolor">Categories</NavLink>
            <NavLink to="/orders" className="hover:underline text-sm text-dark-textcolor transition-colors duration-200 hover:text-light-textcolor">Orders</NavLink>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:w-2/3">
          <div className="grid gap-8 md:grid-cols-[320px_auto] items-start ">
            
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d714.2579701982206!2d74.87026927998282!3d31.61734623901238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzHCsDM3JzAxLjciTiA3NMKwNTInMTEuNCJF!5e0!3m2!1sen!2sin!4v1782978337989!5m2!1sen!2sin"
              loading="lazy"
              className="h-[17.5rem] w-full rounded-xl border border-dark-textcolor  "
              title="Company location"
            ></iframe>
            <div className="flex flex-col justify-center gap-4 rounded-xl border border-dark-textcolor bg-section-background p-6 text-sm sm:text-base">
              <div>
                <p className="text-light-textcolor uppercase tracking-widest text-xs">Mail</p>
                <p className="font-semibold text-dark-textcolor">ghmeetproducts@gmail.com</p>
              </div>
              <div>
                <p className="text-light-textcolor uppercase tracking-widest text-xs">Phone</p>
                <p className="font-semibold text-dark-textcolor">+91 9878628020</p>
                <p className="font-semibold text-dark-textcolor">+91 9780464951</p>
                <p className="font-semibold text-dark-textcolor">+91 9988519066</p>
              </div>
              <div>
                <p className="text-light-textcolor uppercase tracking-widest text-xs">Address</p>
                <p className="font-semibold text-dark-textcolor leading-relaxed">
                  Chowk Quilla Bhangian, Namak Mandi, Amritsar (143001)
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  )
}
