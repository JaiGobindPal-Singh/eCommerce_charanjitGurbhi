
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, setUserAddress } from "../utils/userUtils.js";
import { generateNotification } from "../utils/notificationUtils.js";
import { getCharges } from "../utils/chargeUtils.js";
import { getPaymentOptions } from "../utils/paymentUtils.js";
import { getCartTotal } from "../utils/cartUtils.js";


function ShippingAddressPage() {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [userId, setUserId] = useState("");
    const [phone, setPhone] = useState("");
    const [streetAddress, setStreetAddress] = useState("");
    const [city, setCity] = useState("");
    const [stateValue, setStateValue] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [savingAddr, setSavingAddr] = useState(false);
    const [applicableCharges, setApplicableCharges] = useState([]);
    const [availablePaymentOptions, setAvailablePaymentOptions] = useState({});
    const [paymentOption, setPaymentOption] = useState("online");
    const [errors, setErrors] = useState({});
    const [rerender, setRerender] = useState(true);

    const fullNameRef = useRef(null);
    const phoneRef = useRef(null);
    const streetAddressRef = useRef(null);
    const cityRef = useRef(null);
    const stateRef = useRef(null);
    const postalCodeRef = useRef(null);
    const saveButtonRef = useRef(null);
    const [cartTotal, setCartTotal] = useState(0);

    const handleEnterFocusNext = (e, nextRef) => {
        if (e.key === "Enter") {
            e.preventDefault();
            nextRef?.current?.focus();
        }
    };

    useEffect(() => {

        const fetchData = async () => {
            try {
                const user = await getUser();
                if (user?.id) {
                    setUserId(user.id);
                }
                if (user?.name) {
                    setFullName(user.name);
                }
                if (user?.phone) {
                    setPhone(user.phone);
                }
                if (user?.streetAddress) {
                    setStreetAddress(user.streetAddress);
                }
                if (user?.city) {
                    setCity(user.city);
                }
                if (user?.state) {
                    setStateValue(user.state);
                }
                if (user?.postalCode) {
                    setPostalCode(user.postalCode);
                }
                const ct = await getCartTotal();
                setCartTotal(ct);
            } catch {
                // ignore if user is not logged in
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const opt = await getPaymentOptions();
                setAvailablePaymentOptions(opt);
            } catch (e) {
                console.error(e);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const charges = await getCharges();
                setApplicableCharges(charges);
            } catch (e) {
                console.error(e);
            }
        };
        fetchData();
    }, [rerender]);


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
        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        if (!streetAddress || !city || !stateValue || !postalCode || postalCode.length !== 6) {
            validateForm();
            return;
        }
        setSavingAddr(true);
        await setUserAddress(streetAddress, city, stateValue, postalCode);
        setSavingAddr(false);
        setRerender(!rerender);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);


        // if userid save address and goto checkout page and pass shipping address else register user  tehn goto checkout page
        //todo submit handler

        generateNotification("Shipping details saved successfully")();
    };

    return (
        <div className="min-h-full bg-main-background px-4  text-dark-textcolor sm:px-6 lg:px-8 flex  flex-wrap shrink-0 justify-center gap-3 w-full">
            <div className=" max-w-3xl rounded-[2rem] border border-[#EBD8C0] bg-white/90 p-8 shadow-sm backdrop-blur sm:p-10">
                <div className="mb-8 text-center">
                    <p className="text-lg font-bold uppercase tracking-[0.3em] text-light-textcolor">Shipping details</p>

                    <p className="mt-2 text-sm text-dark-textcolor/80">
                        Enter your shipping address, contact, and preferences to continue.
                    </p>
                </div>

                <form onSubmit={handleSaveAddress} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block">
                            <span className="text-sm font-medium">Full name</span>
                            <input
                                ref={fullNameRef}
                                type="text"
                                value={fullName}
                                required={true}
                                onChange={(e) => setFullName(e.target.value)}
                                onKeyDown={(e) => handleEnterFocusNext(e, phoneRef)}
                                placeholder="Your full name"
                                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-dark-textcolor outline-none focus:border-light-textcolor focus:ring-2 focus:ring-light-textcolor/30"
                            />
                            {errors.fullName && <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>}
                        </label>
                        <label className="block">
                            <span className="text-sm font-medium">Phone</span>
                            <input
                                ref={phoneRef}
                                type="tel"
                                value={phone}
                                required={true}
                                onChange={(e) => setPhone(e.target.value)}
                                onKeyDown={(e) => handleEnterFocusNext(e, streetAddressRef)}
                                placeholder="10 digit phone number"
                                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-dark-textcolor outline-none focus:border-light-textcolor focus:ring-2 focus:ring-light-textcolor/30"
                            />
                            {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
                        </label>
                    </div>

                    <label className="block">
                        <span className="text-sm font-medium">Street address</span>
                        <input
                            ref={streetAddressRef}
                            type="text"
                            value={streetAddress}
                            required={true}
                            onChange={(e) => setStreetAddress(e.target.value)}
                            onKeyDown={(e) => handleEnterFocusNext(e, cityRef)}
                            placeholder="House number, building, street"
                            className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-dark-textcolor outline-none focus:border-light-textcolor focus:ring-2 focus:ring-light-textcolor/30"
                        />
                        {errors.streetAddress && <p className="mt-2 text-sm text-red-600">{errors.streetAddress}</p>}
                    </label>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <label className="block">
                            <span className="text-sm font-medium">City</span>
                            <input
                                ref={cityRef}
                                type="text"
                                value={city}
                                required={true}
                                onChange={(e) => setCity(e.target.value)}
                                onKeyDown={(e) => handleEnterFocusNext(e, stateRef)}
                                placeholder="City"
                                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-dark-textcolor outline-none focus:border-light-textcolor focus:ring-2 focus:ring-light-textcolor/30"
                            />
                            {errors.city && <p className="mt-2 text-sm text-red-600">{errors.city}</p>}
                        </label>
                        <label className="block">
                            <span className="text-sm font-medium">State</span>
                            <input
                                ref={stateRef}
                                type="text"
                                value={stateValue}
                                required={true}
                                onChange={(e) => setStateValue(e.target.value)}
                                onKeyDown={(e) => handleEnterFocusNext(e, postalCodeRef)}
                                placeholder="State"
                                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-dark-textcolor outline-none focus:border-light-textcolor focus:ring-2 focus:ring-light-textcolor/30"
                            />
                            {errors.stateValue && <p className="mt-2 text-sm text-red-600">{errors.stateValue}</p>}
                        </label>
                        <label className="block">
                            <span className="text-sm font-medium">Postal code</span>
                            <input
                                ref={postalCodeRef}
                                type="text"
                                value={postalCode}
                                required={true}
                                onChange={(e) => setPostalCode(e.target.value)}
                                onKeyDown={(e) => handleEnterFocusNext(e, saveButtonRef)}
                                placeholder="Postal code"
                                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-dark-textcolor outline-none focus:border-light-textcolor focus:ring-2 focus:ring-light-textcolor/30"
                            />
                            {errors.postalCode && <p className="mt-2 text-sm text-red-600">{errors.postalCode}</p>}
                        </label>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <button
                            ref={saveButtonRef}
                            type="submit"
                            disabled={savingAddr}
                            className={` w-full rounded-full ${!savingAddr ? 'bg-light-textcolor text-white' : 'bg-gray-300 text-white'} px-6 py-3 text-sm font-semibold  transition hover:opacity-95 sm:w-auto `}
                            onClick={handleSaveAddress}
                        >
                            Save Address
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

            <div className=" rounded-[2rem] border max-w-3xl min-w-72 border-[#EBD8C0] bg-white/20 p-8 shadow-sm backdrop-blur-lg sm:p-10">
                <div className="mb-8 text-center">
                    <p className="text-lg font-bold uppercase tracking-[0.3em] text-light-textcolor">Order summary</p>
                    <p className="mt-2 text-sm text-dark-textcolor/80">Review your cart total, shipping charges, taxes, and final bill.</p>
                </div>

                <div className="space-y-4">
                    <div className="rounded-3xl border border-gray-200 bg-white p-5">
                        <p className="mb-3 text-sm font-semibold text-dark-textcolor">Payment Method</p>
                        <div className="space-y-3">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="online"
                                    checked={paymentOption === "online"}
                                    onChange={(e) => setPaymentOption(e.target.value)}
                                    className="mr-3"
                                />
                                <span className="text-sm text-dark-textcolor">Online Payment</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cod"
                                    disabled={!(availablePaymentOptions.cod?.enabled && availablePaymentOptions.cod?.availableCities.includes(city.trim()))}
                                    checked={paymentOption === "cod"}
                                    onChange={(e) => setPaymentOption(e.target.value)}
                                    className="mr-3"
                                />
                                <span className="text-sm text-dark-textcolor">{availablePaymentOptions.cod?.enabled && availablePaymentOptions.cod?.availableCities.includes(city.trim()) ?'Cash on Delivery': "Cash on Delivery (Coming soon)"}</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-3xl border border-gray-200 bg-white px-5 py-4">
                        <span className="text-sm text-dark-textcolor/80">Cart total</span>
                        <span className="text-sm font-semibold text-dark-textcolor">₹ {cartTotal}</span>
                    </div>

                    <div className="rounded-3xl border border-gray-200 bg-white px-5 py-4" >
                        <div className="flex items-center justify-between ">
                            <span className=" flex items-center gap-1 text-sm text-dark-textcolor/80">Charges </span>
                            <span className="text-sm font-semibold text-dark-textcolor">₹ {applicableCharges.reduce((acc, item) => acc + Object.values(item)[0], 0)}</span>

                        </div>
                        <div className=" pt-5">
                            {
                                applicableCharges.map((charge) => {
                                    return <div className="flex gap-5">
                                        <span className="text-sm font-medium w-20 text-dark-textcolor/80">{Object.keys(charge)[0]}: </span>
                                        <span className="text-xs  text-dark-textcolor">₹ {Object.values(charge)[0]}</span>
                                    </div>
                                })
                            }
                        </div>
                    </div>


                </div>

                <div className="mt-6 rounded-[2rem] bg-[#f8f3ea] p-6">
                    <div className="flex items-center justify-between text-sm text-dark-textcolor/80">
                        <span>Total bill</span>
                        <span className="text-lg font-semibold text-dark-textcolor">₹ {applicableCharges.reduce((acc, item) => acc + Object.values(item)[0], 0) + cartTotal}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate("/checkout")}
                        className="mt-6 w-full rounded-full bg-light-textcolor px-6 py-3 text-sm font-semibold text-white transition hover:opacity-95"
                    >
                        Proceed to checkout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ShippingAddressPage;
