
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, setUserAddress } from "../utils/userUtils.js";
import { generateNotification } from "../utils/notificationUtils.js";
import { createOrder } from "../utils/orderUtils.js";
import { getCharges } from "../utils/chargeUtils.js";
import { getPaymentOptions } from "../utils/paymentUtils.js";
import { clearCartStore, getCartRawTotal, getCartTotal, calculateCartGst } from "../utils/cartUtils.js";
import { validateDiscount } from "../utils/discountUtils.js";
import { initiatePayment } from "../utils/payment.js";
import OrderSuccess from "../components/OrderSuccess.jsx";

function ShippingAddressPage() {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [userId, setUserId] = useState("");
    const [phone, setPhone] = useState("");
    const [orderSucceeded, setOrderSucceeded] = useState(false);
    const [streetAddress, setStreetAddress] = useState("");
    const [city, setCity] = useState("");
    const [stateValue, setStateValue] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [applicableCharges, setApplicableCharges] = useState([]);
    const [availablePaymentOptions, setAvailablePaymentOptions] = useState({});
    const [paymentOption, setPaymentOption] = useState("online");
    const [discountCode, setDiscountCode] = useState("");
    const [discountAmount, setDiscountAmount] = useState(0);
    const [discountMessage, setDiscountMessage] = useState("");
    const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
    const [errors, setErrors] = useState({});
    const [rerender, setRerender] = useState(true);
    const [applicableGst, setApplicableGst] = useState(0);
    const fullNameRef = useRef(null);
    const phoneRef = useRef(null);
    const streetAddressRef = useRef(null);
    const cityRef = useRef(null);
    const stateRef = useRef(null);
    const postalCodeRef = useRef(null);
    const saveButtonRef = useRef(null);
    const [cartTotal, setCartTotal] = useState(0);
    const [payableCartTotal, setPayableCartTotal] = useState(0);
    const [disableSaveAddrBtn, setDisableSaveAddrBtn] = useState(true);


    const handleEnterFocusNext = (e, nextRef) => {
        if (e.key === "Enter") {
            e.preventDefault();
            nextRef?.current?.focus();
        }
    };

    // prompt on refresh
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            // Modern browsers require returnValue to be set
            event.returnValue = 'dsfds';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await getUser();
                if (user?.id) {
                    setUserId(user.id);
                } else {
                    navigate('/products');
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
                const ct = await getCartRawTotal();
                setCartTotal(ct);

                const pct = await getCartTotal();
                setPayableCartTotal(pct);

                const gst = await calculateCartGst();
                setApplicableGst(gst);
            } catch {
                // navigate to home if user is not logged in
                navigate('/');
            }
        }
        fetchData();
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return;
            try {
                const opt = await getPaymentOptions();
                setAvailablePaymentOptions(opt);
            } catch (e) {
                console.error(e);
            }
        };
        fetchData();
    }, [userId]);

    const av = postalCode.trim().length == 6 &&
        availablePaymentOptions?.cod?.enabled && (
            !(availablePaymentOptions?.cod?.allowedPostalCodes?.length) ||
            availablePaymentOptions?.cod?.allowedPostalCodes.includes(postalCode.trim())
        );
    const isCodAvailable = av;


    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!userId) return;
                const charges = await getCharges(cartTotal);
                setApplicableCharges(charges);
            } catch (e) {
                console.error(e);
            }
        };
        fetchData();
    }, [rerender, userId, cartTotal]);

    const isMounted = useRef(false);
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true; // Set flag to true for subsequent renders
            return; // Exit early to skip execution
        }
        setDisableSaveAddrBtn(false);
    }, [city])

    const chargeTotal = applicableCharges?.reduce((acc, item) => acc + Object.values(item)[0], 0) || 0;
    const subtotal = payableCartTotal + chargeTotal;
    const finalBill = Math.max(subtotal - discountAmount, 0);

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
        e?.preventDefault();
        if (!streetAddress || !city || !stateValue || !postalCode || postalCode.length !== 6) {
            validateForm();
            return;
        }
        try {
            await setUserAddress(streetAddress, city, stateValue, postalCode);
        } catch (e) {
            console.error(e);
        } finally {
            setRerender(!rerender);
            setDisableSaveAddrBtn(true);
        }
    }

    const handleApplyDiscount = async (e) => {
        e?.preventDefault();
        if (!discountCode.trim()) {
            setDiscountMessage("Enter a discount code");
            setDiscountAmount(0);
            return;
        }

        try {
            setIsApplyingDiscount(true);
            const amount = await validateDiscount(discountCode.trim(), payableCartTotal);
            if (amount && Number(amount) > 0) {
                setDiscountAmount(Number(amount));
                setDiscountMessage("");
                // setDiscountMessage(`Discount applied - ${Number(amount)}` );
            } else {
                setDiscountAmount(0);
                setDiscountMessage("Invalid or expired discount code");
            }
        } catch (e) {
            setDiscountAmount(0);
            setDiscountMessage("Unable to validate discount code");
            console.error(e);
        } finally {
            setIsApplyingDiscount(false);
        }
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();
        setIsSubmitting(true);

        try {
            //if address is not saved
            if (!disableSaveAddrBtn) {
                await handleSaveAddress(e);
            }
            const res = await createOrder({
                fullName,
                phone,
                streetAddress,
                city,
                state: stateValue,
                postalCode
            }, paymentOption, discountCode);

            //if payment option is cod
            if (paymentOption === "cod") {
                setOrderSucceeded(true);
                clearCartStore();
                return;
            }
            //if payment is online
            await initiatePayment(res.razorpayKey, res.razorpayOrderId, res.order, setOrderSucceeded);
            setIsSubmitting(false);

        } catch (e) {
            setIsSubmitting(false);
            generateNotification(e.response?.data?.error || e.message)();
        }
    };

    return (
        <div className="min-h-full bg-main-background px-4  text-dark-textcolor sm:px-6 lg:px-8 flex  flex-wrap shrink-0 justify-center gap-3 w-full">
            {orderSucceeded && <OrderSuccess />}
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

                            <select
                                ref={stateRef}
                                value={stateValue}
                                required={true}
                                onChange={(e) => setStateValue(e.target.value)}
                                onKeyDown={(e) => handleEnterFocusNext(e, postalCodeRef)}
                                className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-dark-textcolor outline-none focus:border-light-textcolor focus:ring-2 focus:ring-light-textcolor/30"
                            >
                                <option>Select state</option>
                                <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                                <option value="Andhra Pradesh">Andhra Pradesh</option>
                                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                                <option value="Assam">Assam</option>
                                <option value="Bihar">Bihar</option>
                                <option value="Chandigarh">Chandigarh</option>
                                <option value="Chhattisgarh">Chhattisgarh</option>
                                <option value="Dadra and Nagar Haveli">Dadra and Nagar Haveli</option>
                                <option value="Daman and Diu">Daman and Diu</option>
                                <option value="Delhi">Delhi</option>
                                <option value="Goa">Goa</option>
                                <option value="Gujarat">Gujarat</option>
                                <option value="Haryana">Haryana</option>
                                <option value="Himachal Pradesh">Himachal Pradesh</option>
                                <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                                <option value="Jharkhand">Jharkhand</option>
                                <option value="Karnataka">Karnataka</option>
                                <option value="Kerala">Kerala</option>
                                <option value="Ladakh">Ladakh</option>
                                <option value="Lakshadweep">Lakshadweep</option>
                                <option value="Madhya Pradesh">Madhya Pradesh</option>
                                <option value="Maharashtra">Maharashtra</option>
                                <option value="Manipur">Manipur</option>
                                <option value="Meghalaya">Meghalaya</option>
                                <option value="Mizoram">Mizoram</option>
                                <option value="Nagaland">Nagaland</option>
                                <option value="Odisha">Odisha</option>
                                <option value="Puducherry">Puducherry</option>
                                <option value="Punjab">Punjab</option>
                                <option value="Rajasthan">Rajasthan</option>
                                <option value="Sikkim">Sikkim</option>
                                <option value="Tamil Nadu">Tamil Nadu</option>
                                <option value="Telangana">Telangana</option>
                                <option value="Tripura">Tripura</option>
                                <option value="Uttar Pradesh">Uttar Pradesh</option>
                                <option value="Uttarakhand">Uttarakhand</option>
                                <option value="West Bengal">West Bengal</option>
                            </select>
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
                                    disabled={!isCodAvailable}
                                    checked={paymentOption === "cod"}
                                    onChange={(e) => setPaymentOption(e.target.value)}
                                    className="mr-3"
                                />
                                <span className="text-sm text-dark-textcolor">{isCodAvailable ? 'Cash on Delivery' : "Cash on Delivery (Coming soon)"}</span>
                            </label>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        {/* <button
                            ref={saveButtonRef}
                            type="submit"
                            disabled={savingAddr}
                            className={` w-full rounded-full ${!savingAddr ? 'bg-light-textcolor text-white' : 'bg-gray-300 text-white'} px-6 py-3 text-sm font-semibold  transition hover:opacity-95 sm:w-auto `}
                            onClick={handleSaveAddress}
                        >
                            Save Address
                        </button> */}
                        {/* <button
                            type="button"
                            onClick={() => navigate("/cart")}
                            className="w-full rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-dark-textcolor transition hover:bg-[#f9f0eb] sm:w-auto"
                        >
                            Back to cart
                        </button> */}
                    </div>
                </form>
            </div>

            <div className=" rounded-[2rem] border  min-w-72 border-[#EBD8C0] bg-white/20  shadow-sm backdrop-blur-lg px-4 py-4 pt-8">
                <div className="mb-8 text-center">
                    <p className="text-lg font-bold uppercase tracking-[0.3em] text-light-textcolor">Order summary</p>
                    <p className="mt-2 text-sm text-dark-textcolor/80">Review your cart total, shipping charges, taxes, and final bill.</p>
                </div>

                <div className="">
                    <form onSubmit={handleSubmit} className="space-y-2">


                        <div className="flex items-center justify-between  px-5 ">
                            <span className="text-sm text-dark-textcolor/80">Cart total</span>
                            <span className="text-sm font-semibold text-dark-textcolor">₹ {cartTotal}</span>
                        </div>


                        {(!!payableCartTotal && payableCartTotal < cartTotal) && (
                            <div className="flex items-center justify-between  px-5 ">
                                <span className="text-sm text-dark-textcolor/80">Discount</span>
                                <span className="text-sm font-semibold text-green-800">- ₹ {cartTotal - payableCartTotal}</span>
                            </div>
                        )}

                        <div className="pt-8  py-2">
                            <div className="mb-3 text-sm font-semibold text-dark-textcolor">Have a Discount code?</div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={discountCode}
                                    onChange={(e) => setDiscountCode(e.target.value)}
                                    placeholder="Enter code"
                                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-dark-textcolor outline-none focus:border-light-textcolor focus:ring-2 focus:ring-light-textcolor/30"
                                />
                                <button
                                    type="button"
                                    onClick={handleApplyDiscount}
                                    disabled={isApplyingDiscount}
                                    className="rounded-full bg-dark-textcolor px-5 py-2 text-xs font-semibold text-white transition hover:bg-light-textcolor disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {isApplyingDiscount ? "Checking..." : "Apply"}
                                </button>
                            </div>

                            {discountMessage && (
                                <p className={`mt-2 text-sm ${discountMessage.includes("applied") ? "text-green-700" : "text-light-textcolor"}`}>{discountMessage}</p>
                            )}
                            {discountAmount > 0 && (
                                <div className="flex items-center justify-between pr-5 pt-4">
                                    <span className="text-sm text-green-800">Discount Code Applied</span>
                                    <span className="text-sm font-semibold text-green-800">- ₹ {discountAmount}</span>
                                </div>
                            )}
                        </div>


                        {!!chargeTotal && <div className=" px-6 py-2">

                            <div className="">
                                {
                                    applicableCharges?.map((charge) => {
                                        return <div key={Object.keys(charge)[0]} className="flex gap-x-20 items-center justify-between max-md:gap-x-10 flex-nowrap text-nowrap">
                                            <span className="text-sm w-20 text-dark-textcolor/80">{Object.keys(charge)[0]} (inclusive of Taxes): </span>
                                            <span className="text-sm text-dark-textcolor">₹ {Object.values(charge)[0]}</span>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                        }
                        <div className="mt-2 rounded-[2rem] bg-[#f8f3ea] px-6 py-2">

                            <div className="mt-3 flex items-center justify-between text-sm text-dark-textcolor/80">
                                <span className="font-semibold ">Grand Total (Inclusive of Taxes)</span>
                                <span className="text-lg font-bold text-dark-textcolor">₹ {Math.floor(finalBill * 1000) / 1000}</span>
                            </div>
                            <div className="flex flex-col w-full text-sm text-dark-textcolor/80">
                                {
                                    stateValue.toLowerCase().trim() === "punjab" ? (
                                        <>
                                            <div className="mt-3 flex items-center justify-between text-sm text-dark-textcolor/80">
                                                <span className="text-xs">CGST</span>
                                                <span className="text-sm  text-dark-textcolor">₹ {applicableGst.toFixed(2) / 2}</span>
                                            </div>
                                            <div className="mt-3 flex items-center justify-between text-sm text-dark-textcolor/80">
                                                <span className="text-xs">SGST</span>
                                                <span className="text-sm text-dark-textcolor">₹ {applicableGst.toFixed(2) / 2}</span>
                                            </div>
                                        </>
                                    ) : stateValue && (
                                        <div className="mt-3 flex items-center justify-between text-sm text-dark-textcolor/80">
                                            <span className="text-xs">IGST</span>
                                            <span className="text-sm text-dark-textcolor">₹ {applicableGst.toFixed(2)}</span>
                                        </div>
                                    )
                                }

                            </div>
                            <button
                                type="button"
                                onClick={(e) => handleSubmit(e)}
                                disabled={isSubmitting}
                                className={`mt-6 w-full rounded-full ${isSubmitting ? 'bg-gray-100 text-light-textcolor cursor-not-allowed' : 'bg-light-textcolor text-white'} px-6 py-3 text-sm font-semibold  transition hover:opacity-95`}>Proceed to checkout
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div >
    );
}

export default ShippingAddressPage;
