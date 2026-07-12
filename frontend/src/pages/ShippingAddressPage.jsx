
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/userUtils.js";
import { generateNotification } from "../utils/notificationUtils.js";

function ShippingAddressPage() {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [userId, setUserId] = useState("");
    const [phone, setPhone] = useState("");
    const [streetAddress, setStreetAddress] = useState("");
    const [city, setCity] = useState("");
    const [stateValue, setStateValue] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    // const [paymentOption, setPaymentOption] = useState("online");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        getUser().then((user) => {
            if(user?.id){
                setUserId(user.id);
            }else{
                return;
            }
            if (user?.name) {
                setFullName(user.name);
            }
            if (user?.phone) {
                setPhone(user.phone);
            }
            if(user?.streetAddress){
                setStreetAddress(user.streetAddress)
            }
            if(user?.city){
                setCity(user.city);
            }
            if(user?.state){
                setStateValue(user.state);
            }
            if(user?.postalCode){
                setPostalCode(user.postalCode);
            }
        }).catch(() => {
            // ignore if user is not logged in
        });

    }, []);

    const validateForm = () => {
        const nextErrors = {};
        if (!fullName.trim()) nextErrors.fullName = "Full name is required";
        if (!phone.trim() || phone.trim().length !== 10 || isNaN(Number(phone.trim()))) {
            nextErrors.phone = "Enter a valid 10-digit phone number";
        }
        if (!streetAddress.trim()) nextErrors.streetAddress = "Street address is required";
        if (!city.trim()) nextErrors.city = "City is required";
        if (!stateValue.trim()) nextErrors.stateValue = "State is required";
        if (!postalCode.trim() || isNaN(Number(postalCode.trim()))) {
            nextErrors.postalCode = "Enter a valid postal code";
        }
        if (!password.trim() || password.trim().length < 8) {
            nextErrors.password = "Password must be at least 8 characters";
        }
        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        if (!validateForm()) {
            setSubmitting(false);  // setting to true disable submit button
            return;
        }

        // if userid save address and goto checkout page and pass shipping address else register user  tehn goto checkout page
        //todo submit handler

        generateNotification("Shipping details saved successfully")();
    };

    return (
        <div className="min-h-screen bg-main-background px-4 py-10 text-dark-textcolor sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#EBD8C0] bg-white/90 p-8 shadow-sm backdrop-blur sm:p-10">
                <div className="mb-8 text-center">
                    <p className="text-lg font-bold uppercase tracking-[0.3em] text-light-textcolor">Shipping details</p>
                    
                    <p className="mt-2 text-sm text-dark-textcolor/80">
                        Enter your shipping address, contact, and preferences to continue.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block">
                            <span className="text-sm font-medium">Full name</span>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Your full name"
                                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-dark-textcolor outline-none focus:border-light-textcolor focus:ring-2 focus:ring-light-textcolor/30"
                            />
                            {errors.fullName && <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>}
                        </label>
                        <label className="block">
                            <span className="text-sm font-medium">Phone</span>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="10 digit phone number"
                                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-dark-textcolor outline-none focus:border-light-textcolor focus:ring-2 focus:ring-light-textcolor/30"
                            />
                            {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
                        </label>
                    </div>

                    <label className="block">
                        <span className="text-sm font-medium">Street address</span>
                        <input
                            type="text"
                            value={streetAddress}
                            onChange={(e) => setStreetAddress(e.target.value)}
                            placeholder="House number, building, street"
                            className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-dark-textcolor outline-none focus:border-light-textcolor focus:ring-2 focus:ring-light-textcolor/30"
                        />
                        {errors.streetAddress && <p className="mt-2 text-sm text-red-600">{errors.streetAddress}</p>}
                    </label>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <label className="block">
                            <span className="text-sm font-medium">City</span>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="City"
                                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-dark-textcolor outline-none focus:border-light-textcolor focus:ring-2 focus:ring-light-textcolor/30"
                            />
                            {errors.city && <p className="mt-2 text-sm text-red-600">{errors.city}</p>}
                        </label>
                        <label className="block">
                            <span className="text-sm font-medium">State</span>
                            <input
                                type="text"
                                value={stateValue}
                                onChange={(e) => setStateValue(e.target.value)}
                                placeholder="State"
                                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-dark-textcolor outline-none focus:border-light-textcolor focus:ring-2 focus:ring-light-textcolor/30"
                            />
                            {errors.stateValue && <p className="mt-2 text-sm text-red-600">{errors.stateValue}</p>}
                        </label>
                        <label className="block">
                            <span className="text-sm font-medium">Postal code</span>
                            <input
                                type="text"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                                placeholder="Postal code"
                                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-dark-textcolor outline-none focus:border-light-textcolor focus:ring-2 focus:ring-light-textcolor/30"
                            />
                            {errors.postalCode && <p className="mt-2 text-sm text-red-600">{errors.postalCode}</p>}
                        </label>
                    </div>
                    {
                        !userId &&
                    
                    <label className="block">
                        <span className="text-sm font-medium">Password</span>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password for login use"
                            className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-dark-textcolor outline-none focus:border-light-textcolor focus:ring-2 focus:ring-light-textcolor/30"
                        />
                        {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                    </label>
}

                    {/* <div className="rounded-3xl border border-[#EBD8C0] bg-section-background p-5">
                        <p className="text-sm font-semibold text-dark-textcolor">Payment method</p>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <label className={`flex cursor-pointer items-center gap-3 rounded-3xl border px-4 py-4 transition ${paymentOption === "online" ? "border-light-textcolor bg-white" : "border-gray-200 bg-white/80"}`}>
                                <input
                                    type="radio"
                                    name="paymentOption"
                                    value="online"
                                    checked={paymentOption === "online"}
                                    onChange={() => setPaymentOption("online")}
                                    className="h-4 w-4 text-light-textcolor focus:ring-light-textcolor"
                                />
                                <span>
                                    <span className="block text-sm font-semibold">Online payment</span>
                                    <span className="text-sm text-dark-textcolor/70">Card, UPI or net banking</span>
                                </span>
                            </label>
                            <label className={`flex cursor-pointer items-center gap-3 rounded-3xl border px-4 py-4 transition ${paymentOption === "cod" ? "border-light-textcolor bg-white" : "border-gray-200 bg-white/80"}`}>
                                <input
                                    type="radio"
                                    name="paymentOption"
                                    value="cod"
                                    checked={paymentOption === "cod"}
                                    onChange={() => setPaymentOption("cod")}
                                    className="h-4 w-4 text-light-textcolor focus:ring-light-textcolor"
                                />
                                <span>
                                    <span className="block text-sm font-semibold">Cash on Delivery</span>
                                    <span className="text-sm text-dark-textcolor/70">Pay when your order arrives</span>
                                </span>
                            </label>
                        </div>
                    </div> */}

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <button
                            type="submit"
                            className="w-full rounded-full bg-light-textcolor px-6 py-3 text-sm font-semibold text-white transition hover:opacity-95 sm:w-auto"
                        >
                            Continue to Checkout
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/cart")}
                            className="w-full rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-dark-textcolor transition hover:bg-[#f9f0eb] sm:w-auto"
                        >
                            Back to cart
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ShippingAddressPage;
