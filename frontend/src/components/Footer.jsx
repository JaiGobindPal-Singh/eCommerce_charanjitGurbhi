import companyLogo from '../assets/companyLogo.png'
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-dark-textcolor/10 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Footer Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Company */}
          <div className="flex min-h-[240px]  flex-col justify-between rounded-2xl border border-dark-textcolor/20 bg-section-background p-6">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-light-textcolor">
                About Us
              </p>


              <div className="flex justify-center">
                <img
                  className="mb-4 w-36 object-contain"
                  src={companyLogo}
                  alt="GH Products company logo"
                />
              </div>
              <h3 className="text-xl text-center font-bold text-dark-textcolor">
                GH Products
              </h3>
              <p className="mt-4 text-sm leading-6  text-light-textcolor">
                Quality products with a commitment to reliable service and
                customer satisfaction.
              </p>
            </div>

            <div className="mt-6">
              <p className="text-xs font-medium uppercase tracking-widest text-light-textcolor">
                GSTIN
              </p>
              <p className="mt-1 font-semibold text-dark-textcolor">
                03AOKPS9915E1ZQ
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="min-h-[240px] overflow-hidden rounded-2xl border border-dark-textcolor/20 bg-section-background p-2">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3397.6474010290076!2d74.869038!3d31.6161201!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39197b574522d7c5%3A0xc1e18e631c58a6c4!2sGurmukh%20Singh%20Harbhajan%20Singh!5e0!3m2!1sen!2sin!4v1783060218679!5m2!1sen!2sin"
              loading="lazy"
              className="h-full min-h-[236px] w-full rounded-xl border-0"
              title="Company location"
            />
          </div>

          {/* Contact */}
          <div className="min-h-[240px] rounded-2xl border border-dark-textcolor/20 bg-section-background p-6">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-light-textcolor">
              Contact
            </p>

            <div className="space-y-5">
              <div>
                <p className="text-xs uppercase tracking-widest text-light-textcolor">
                  Mail
                </p>
                <a
                  href="mailto:ghmeetproducts@gmail.com"
                  className="mt-1 block break-all font-semibold text-dark-textcolor transition-colors hover:text-light-textcolor"
                >
                  ghmeetproducts@gmail.com
                </a>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-light-textcolor">
                  Phone
                </p>

                <div className="mt-1 space-y-1">
                  <a
                    href="tel:+919780464951"
                    className="block font-semibold text-dark-textcolor transition-colors hover:text-light-textcolor"
                  >
                    +91 9780464951
                  </a>

                  <a
                    href="tel:+919988519066"
                    className="block font-semibold text-dark-textcolor transition-colors hover:text-light-textcolor"
                  >
                    +91 9988519066
                  </a>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-light-textcolor">
                  Address
                </p>

                <p className="mt-1 font-semibold leading-6 text-dark-textcolor">
                  Chowk Quilla Bhangian, Namak Mandi,
                  <br />
                  Amritsar (143001), Punjab
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="min-h-[240px] rounded-2xl border border-dark-textcolor/20 bg-section-background p-6">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-light-textcolor">
              Quick Links
            </p>

            <nav className="grid gap-1">
              <Link
                to="/"
                className="group flex items-center justify-between rounded-lg px-2 py-1.5 font-semibold text-dark-textcolor transition-all duration-200 hover:bg-dark-textcolor/5 hover:text-light-textcolor"
              >
                <span>Home</span>
                <span className="opacity-0 transition-opacity group-hover:opacity-100">
                  →
                </span>
              </Link>

              <Link
                to="/products"
                className="group flex items-center justify-between rounded-lg px-2 py-1.5 font-semibold text-dark-textcolor transition-all duration-200 hover:bg-dark-textcolor/5 hover:text-light-textcolor"
              >
                <span>Products</span>
                <span className="opacity-0 transition-opacity group-hover:opacity-100">
                  →
                </span>
              </Link>

              <Link
                to="/categories"
                className="group flex items-center justify-between rounded-lg px-2 py-1.5 font-semibold text-dark-textcolor transition-all duration-200 hover:bg-dark-textcolor/5 hover:text-light-textcolor"
              >
                <span>Categories</span>
                <span className="opacity-0 transition-opacity group-hover:opacity-100">
                  →
                </span>
              </Link>

              <Link
                to="/orders"
                className="group flex items-center justify-between rounded-lg px-2 py-1.5 font-semibold text-dark-textcolor transition-all duration-200 hover:bg-dark-textcolor/5 hover:text-light-textcolor"
              >
                <span>Orders</span>
                <span className="opacity-0 transition-opacity group-hover:opacity-100">
                  →
                </span>
              </Link>

              <Link
                to="/legal#terms"
                className="group flex items-center justify-between rounded-lg px-2 py-1.5 font-semibold text-dark-textcolor transition-all duration-200 hover:bg-dark-textcolor/5 hover:text-light-textcolor"
              >
                <span>Terms & Conditions</span>
                <span className="opacity-0 transition-opacity group-hover:opacity-100">
                  →
                </span>
              </Link>

              <Link
                to="/legal#privacy-policy"
                className="group flex items-center justify-between rounded-lg px-2 py-1.5 font-semibold text-dark-textcolor transition-all duration-200 hover:bg-dark-textcolor/5 hover:text-light-textcolor"
              >
                <span>Privacy Policy</span>
                <span className="opacity-0 transition-opacity group-hover:opacity-100">
                  →
                </span>
              </Link>
              <Link
                to="/legal#cancel-return-policy"
                className="group flex items-center justify-between rounded-lg px-2 py-1.5 font-semibold text-dark-textcolor transition-all duration-200 hover:bg-dark-textcolor/5 hover:text-light-textcolor"
              >
                <span>Cancellation/Return Policy</span>
                <span className="opacity-0 transition-opacity group-hover:opacity-100">
                  →
                </span>
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-dark-textcolor/10 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-light-textcolor sm:text-sm">
            © {new Date().getFullYear()} GH Products. All rights reserved.
          </p>

          <p className="text-xs text-light-textcolor sm:text-sm">
            Quality • Trust • Service
          </p>
        </div>
      </div>
    </footer>
  );
}