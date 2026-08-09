import { useLocation } from "react-router-dom";
import { useEffect } from "react";
export default function Legal() {
    const { hash } = useLocation();
    useEffect(() => {
        if (!hash) return;

        const targetId = hash.replace("#", "");

        // 1. Check if the element already exists on the new page
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            return;
        }
    });
    return (
        <section className="page min-h-screen bg-main-background px-4 py-10 text-dark-textcolor sm:px-6 lg:px-8 space-y-2">
            <div id="terms" className="mx-auto max-w-6xl rounded-[2rem] border border-[#EBD8C0] bg-white/80 p-6 shadow-lg shadow-[#aa6e34]/10 backdrop-blur-sm sm:p-10 lg:p-14">
                <div className="mb-8 text-center">
                    <h1 className="mt-5 text-3xl font-bold leading-tight text-dark-textcolor sm:text-4xl">
                        Terms and Conditions
                    </h1>
                    <p className="mt-3 text-sm text-dark-textcolor sm:text-base">
                        Welcome to Tasti.in. These Terms & Conditions govern your use of this Website, which is owned and operated by GH Products ("Company", "we", "us", or "our"). By accessing or using this Website, you agree to be bound by these terms.
                    </p>
                </div>

                <ol className="space-y-4 pl-7 max-md:pl-5 max-sm:pl-0 text-sm leading-7 list-decimal list-inside text-dark-textcolor/90 sm:text-[15px]">
                    <li className="pl-2">By using the this website, you agree to these Terms &amp; Conditions.</li>
                    <li className="pl-2">You must be at least 18 years old or use the website under the supervision of a parent or legal guardian.</li>
                    <li className="pl-2">All products listed on the website are subject to availability.</li>
                    <li className="pl-2">We reserve the right to change product prices, descriptions, or availability without prior notice.</li>
                    <li className="pl-2">Orders may be cancelled or rejected if incorrect information, pricing errors, or suspected fraudulent activity is detected.</li>
                    <li className="pl-2">Customers must provide accurate billing, shipping, and contact information.</li>
                    <li className="pl-2">You are responsible for maintaining the confidentiality of your account and password.</li>
                    <li className="pl-2">All website content, including text, logos, images, graphics, and designs, is the intellectual property of GH Products and may not be copied or reused without written permission.</li>
                    <li className="pl-2">You agree not to misuse the website, upload harmful content, or engage in fraudulent or illegal activities.</li>
                    <li className="pl-2">We are not liable for delays caused by natural disasters, courier delays, government restrictions, or events beyond our control.</li>
                    <li className="pl-2">We reserve the right to modify these Terms &amp; Conditions at any time.</li>
                    <li className="pl-2">Any disputes shall be governed by the laws of India and subject to the jurisdiction of the courts in your registered business location.</li>
                </ol>
            </div>

            <div id="privacy-policy" className="mx-auto max-w-6xl rounded-[2rem] border border-[#EBD8C0] bg-white/80 p-6 shadow-lg shadow-[#aa6e34]/10 backdrop-blur-sm sm:p-10 lg:p-14">
                <div className="mb-8 text-center">

                    <h1 className="mt-5 text-3xl font-bold leading-tight text-dark-textcolor sm:text-4xl">
                        Privacy Policy
                    </h1>
                    <p className="mt-3 text-sm text-dark-textcolor sm:text-base">
                        At tasti.in, accessible from our Website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by GH Products ("Company", "we", "us", or "our") and how we use it.
                    </p>
                </div>

                <ol className="space-y-4 pl-7 max-md:pl-5 max-sm:pl-0  text-sm leading-7 list-decimal list-inside text-dark-textcolor/90 sm:text-[15px]">
                    <li className="pl-2">GH Products respects your privacy and is deeply committed to protecting your personal information. We ensure all data is handled securely and transparently.</li>
                    <li className="pl-2">We collect personal information necessary to process your transactions. This includes your name, phone number, billing address, shipping address, and payment details collected when you place an order</li>
                    <li className="pl-2">We use the gathered information to process and deliver your orders, provide customer support and improve our services.</li>
                    <li className="pl-2">Your financial safety is our priority. Payment information is securely processed through authenticated, encrypted payment gateways. We do not store your complete credit/debit card or net banking details on our servers.</li>
                    <li className="pl-2">We value your trust above all else. Your personal identification information will never be sold, rented, traded, or shared with third parties for marketing purposes.</li>
                    <li className="pl-2">We value your trust above all else. Your personal identification information will never be sold, rented, traded, or shared with third parties for marketing purposes.</li>
                    <li className="pl-2">We utilize cookies to enhance your browsing experience. Cookies help us understand website traffic, remember your preferences, and improve general website functionality.</li>
                    <li className="pl-2">You retain ownership of your personal details. You may request access to, correction of, or permanent deletion of your personal data at any time by contacting us</li>
                    <li className="pl-2">We reserve the right to update this Privacy Policy whenever necessary.</li>
                </ol>
            </div>

            <div id="cancel-return-policy" className="mx-auto max-w-6xl rounded-[2rem] border border-[#EBD8C0] bg-white/80 p-6 shadow-lg shadow-[#aa6e34]/10 backdrop-blur-sm sm:p-10 lg:p-14">
                <div className="mb-8 text-center">

                    <h1 className="mt-5 text-3xl font-bold leading-tight text-dark-textcolor sm:text-4xl">
                        Cancellation and Return Policy
                    </h1>
                    <p className="mt-3 text-sm text-dark-textcolor sm:text-base">
                        Cancellation & Return Policy outlines the terms and conditions under which orders can be cancelled, returned, or refunded. These policies are managed and enforced by GH Products ("Company", "we", "us", or "our").
                    </p>
                </div>

                <ol className="space-y-4 pl-7 max-md:pl-5 max-sm:pl-0  text-sm leading-7 list-decimal list-inside text-dark-textcolor/90 sm:text-[15px]">
                    <li className="pl-2">Orders can be cancelled before they are processed.</li>
                    <li className="pl-2"> Once an order has been processed, it cannot be cancelled by the customer.</li>
                    <li className="pl-2">GH Products reserves the right to cancel any order due to stock unavailability, pricing errors, or suspected fraud.</li>
                    <li className="pl-2">Due to the perishable nature of our products, returns are not accepted for change of mind or any other reason after delivery. </li>
                    <li className="pl-2"> Returns are accepted only for damaged, defective, or incorrect products.</li>
                    <li className="pl-2">Returned products must be unused and in their original packaging.</li>
                    <li className="pl-2"> Products damaged due to customer misuse are not eligible for return or refund.</li>
                </ol>
            </div>
            <div id="refund-policy" className="mx-auto max-w-6xl rounded-[2rem] border border-[#EBD8C0] bg-white/80 p-6 shadow-lg shadow-[#aa6e34]/10 backdrop-blur-sm sm:p-10 lg:p-14">
                <div className="mb-8 text-center">

                    <h1 className="mt-5 text-3xl font-bold leading-tight text-dark-textcolor sm:text-4xl">
                        Refund Policy
                    </h1>
                    <p className="mt-3 text-sm text-dark-textcolor sm:text-base">
                        At tasti.in, we strive to ensure a transparent and seamless payment experience. This Refund Policy, managed by GH Products ("Company", "we", "us", or "our"), outlines the conditions under which monetary refunds are approved and issued.
                    </p>
                </div>

                <ol className="space-y-4 pl-7 max-md:pl-5 max-sm:pl-0  text-sm leading-7 list-decimal list-inside text-dark-textcolor/90 sm:text-[15px]">
                    <li className="pl-2"> Refunds are issued only for cancelled orders, damaged products, defective products, or incorrect items delivered.</li>
                    <li className="pl-2"> Customers must report damaged or incorrect products within 48 hours of delivery with photos or videos as proof.</li>
                    <li className="pl-2">Approved refunds will be processed to the original payment method within 5–7 business days.</li>
                    <li className="pl-2">Shipping charges are non-refundable unless the mistake is on our part.</li>
                    <li className="pl-2"> Refunds may take additional time depending on your bank or payment provider.</li>
                </ol>
            </div>
        </section>
    )
}
