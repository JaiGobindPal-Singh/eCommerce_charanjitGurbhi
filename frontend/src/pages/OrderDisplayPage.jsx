import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderdetails } from "../utils/orderUtils";

function OrderDisplayPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    useEffect(() => {
        getOrderdetails(orderId).then(odr => {
            setOrder(odr.order);
        })
    }, [orderId])



    const getStatusClasses = (status = "") => {
        switch (status.toLowerCase()) {
            case "delivered":
                return "bg-green-100 text-green-700";
            case "cancelled":
                return "bg-red-100 text-red-700";
            case "pending":
            case "processing":
                return "bg-amber-100 text-amber-700";
            default:
                return "bg-[#f7e3cf] text-light-textcolor";
        }
    };

    const formatDate = (value) => {
        if (!value) return "-";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;
        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit"
        });
    };

    const address = order?.deliveryDetails?.deliveryAddress;
    const billing = order?.billing;
    const paymentMode = billing?.paymentMode || "-";
    const statusHistory = order?.statusHistory || [];
    console.log(billing);
    if (!order) {
        return (
            <div className="page min-h-screen bg-main-background px-4 py-8 text-dark-textcolor sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl rounded-2xl border border-[#f2dcc4] bg-section-background p-8 text-center shadow-sm">
                    <h1 className="text-2xl font-semibold">Order not found</h1>
                    <p className="mt-2 text-sm text-light-textcolor">
                        The requested order could not be located yet.
                    </p>
                    <button
                        type="button"
                        onClick={() => navigate("/orders")}
                        className="mt-5 rounded-full bg-light-textcolor px-4 py-2 text-sm font-semibold text-white transition hover:bg-dark-textcolor"
                    >
                        Back to orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-main-background px-4 py-8 text-dark-textcolor sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <button
                    type="button"
                    onClick={() => navigate("/orders")}
                    className="mb-4 text-sm font-semibold text-light-textcolor transition hover:text-dark-textcolor"
                >
                    ← Back to Orders
                </button>

                <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-[#f2dcc4] bg-section-background p-5 shadow-sm md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-light-textcolor">Order Details</p>
                        <h1 className="mt-1 text-2xl font-semibold max-md:text-xl">{order._id}</h1>
                        <p className="mt-2 text-sm text-light-textcolor">
                            Placed on {formatDate(order.createdAt)}
                        </p>
                    </div>
                    <span className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-semibold capitalize ${getStatusClasses(order.status)}`}>
                        {order.status}
                    </span>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
                    <section className="space-y-4">
                        <div className="rounded-2xl border border-[#f2dcc4] bg-section-background p-5 shadow-sm">
                            <h2 className="text-lg font-semibold">Items</h2>
                            <div className="mt-4 space-y-3">
                                {(order.items || []).map((item, index) => (
                                    <div key={`${item.product?.id + index}-${index}`} className="rounded-xl border border-[#f7e3cf] bg-white/70 p-4">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <p className="font-medium text-dark-textcolor">
                                                    {item.product?.name || item.product || `Item ${index + 1}`}
                                                </p>
                                                <p className="text-sm text-light-textcolor">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-semibold text-dark-textcolor">
                                                ₹{(item.product.price || 0) * (item.quantity || 0)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-[#f2dcc4] bg-section-background p-5 shadow-sm">
                            <h2 className="text-lg font-semibold">Delivery Information</h2>
                            <div className="mt-4 space-y-2 text-sm text-light-textcolor">
                                <p>
                                    <span className="font-semibold text-dark-textcolor">Address:</span>{" "}
                                    {address
                                        ? `${address.fullName}, ${address.streetAddress}, ${address.city}, ${address.state} - ${address.postalCode}, ${address.country}`
                                        : "Not available"}
                                </p>
                                <p>
                                    <span className="font-semibold text-dark-textcolor">Phone:</span>{" "}
                                    {address?.phone || "-"}
                                </p>
                                <p>
                                    <span className="font-semibold text-dark-textcolor">Delivery Partner:</span>{" "}
                                    {order.deliveryDetails?.deliveryPartner || "-"}
                                </p>
                                <p>
                                    <span className="font-semibold text-dark-textcolor">Tracking ID:</span>{" "}
                                    {order.deliveryDetails?.trackingId || "-"}
                                </p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-[#f2dcc4] bg-section-background p-5 shadow-sm">
                            <h2 className="text-lg font-semibold">Status History</h2>
                            <div className="mt-4 space-y-3">
                                {statusHistory.length > 0 ? (
                                    statusHistory.map((entry) => (
                                        <div key={entry.id} className="flex items-start gap-3 rounded-xl border border-[#f7e3cf] bg-white/70 p-3">
                                            <div className="mt-1 h-2.5 w-2.5 rounded-full bg-light-textcolor" />
                                            <div>
                                                <p className="text-sm font-semibold capitalize text-dark-textcolor">{entry.status.replace(/_/g, " ")}</p>
                                                <p className="text-sm text-light-textcolor">{formatDate(entry.updatedAt)}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-light-textcolor">No status history available.</p>
                                )}
                            </div>
                        </div>
                    </section>

                    <aside className="space-y-4">
                        <div className="rounded-2xl border border-[#f2dcc4] bg-section-background p-5 shadow-sm">
                            <h2 className="text-lg font-semibold">Billing Summary</h2>
                            <div className="mt-4 space-y-3 text-sm">
                                <div className="flex items-center justify-between text-light-textcolor">
                                    <span>Subtotal</span>
                                    <span>₹{order.items.reduce((total, item) => {
                                        // Safe check in case product wasn't populated or is missing
                                        const price = item.product?.price || 0;
                                        return total + (price * item.quantity);
                                    }, 0)
                                    }</span>
                                </div>
                                {

                                    billing?.charges.map((charge) => {
                                        return (

                                            <div className="flex items-center justify-between text-light-textcolor">

                                                <span>{charge.chargeName}</span>
                                                <span>{charge.chargeAmount}</span>
                                            </div>
                                        )
                                    })}
                                <div className="my-2 h-px bg-[#f2dcc4]" />
                                <div className="flex items-center justify-between text-base font-semibold text-dark-textcolor">
                                    <span>Total</span>
                                    <span>₹{billing?.totalBill || 0}</span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-[#f2dcc4] bg-section-background p-5 shadow-sm">
                            <h2 className="text-lg font-semibold">Payment Details</h2>
                            <div className="mt-4 space-y-2 text-sm text-light-textcolor">
                                <p>
                                    <span className="font-semibold text-dark-textcolor">Mode:</span>{" "}
                                    {paymentMode}
                                </p>
                                {paymentMode === "online" &&
                                    <p>
                                        <span className="font-semibold text-dark-textcolor">Transaction Id:</span>{" "}
                                        {order.transaction || "none"}
                                    </p>
                                }

                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

export default OrderDisplayPage;
