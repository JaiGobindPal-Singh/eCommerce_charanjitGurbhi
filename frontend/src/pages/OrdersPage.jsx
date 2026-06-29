
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function OrdersPage() {
    //sample orders
    const [orders, setOrders] = useState([
        {
            _id: "6a3cd7f94a313fb2fdf8255f",
            status: "cancelled",
            items: [
                {
                    product: {
                        _id: "6a365f6207f9c322e4ff0060",
                        name: "Masala Amla Candy"
                    },
                    quantity: 1,
                    priceAtAddition: 149
                }
            ],
            billing: {
                totalBill: 149
            }
        },
        {
            _id: "6a3cd7f94a313fb2fdf8f255f",
            status: "cancelled",
            items: [
                {
                    product: {
                        _id: "6a365f6207f9c322e4ff0060",
                        name: "Masala Amla Candy"
                    },
                    quantity: 1,
                    priceAtAddition: 149
                },
                {
                    product: {
                        _id: "6a365f6207f9c322e4ff0060",
                        name: "Masala Amla Candy"
                    },
                    quantity: 1,
                    priceAtAddition: 149
                },
                {
                    product: {
                        _id: "6a365f6207f9c322e4ff0060",
                        name: "Masala Amla Candy"
                    },
                    quantity: 1,
                    priceAtAddition: 149
                }
            ],
            billing: {
                totalBill: 149
            }
        },
        {
            _id: "6a3cd7f94a31c3fb2fdf8255f",
            status: "cancelled",
            items: [
                {
                    product: {
                        _id: "6a365f6207f9c322e4ff0060",
                        name: "Masala Amla Candy"
                    },
                    quantity: 1,
                    priceAtAddition: 149
                }
            ],
            billing: {
                totalBill: 149
            }
        },
        {
            _id: "6a3cd6594a313fbj2fdf8255d",
            status: "delivered",
            items: [
                {
                    product: {
                        _id: "6a364fbeb5e6e371f53248eb",
                        name: "sweet Amla Candy"
                    },
                    quantity: 4,
                    priceAtAddition: 149
                }
            ],
            billing: {
                totalBill: 596
            }
        }
    ]);
    const navigate = useNavigate();

    const getStatusClasses = (status) => {
        switch (status) {
            case "delivered":
                return "bg-green-100 text-green-700";
            case "cancelled":
                return "bg-red-100 text-red-700";
            case "pending":
                return "bg-amber-100 text-amber-700";
            default:
                return "bg-[#f7e3cf] text-light-textcolor";
        }
    };

    return (
        <div className="min-h-screen bg-main-background shadow-xl shadow-orange-950 px-4 py-8 text-dark-textcolor sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-semibold">My Orders</h1>
                    <div className="inline-flex items-center gap-2 text-sm max-sm:text-xs">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="inline-flex items-center gap-2 hover:bg-slate-200 transition-colors duration-200 text-dark-textcolor"
                        >
                            <span>Home</span>
                        </button>
                        <span className="text-dark-textcolor">&gt;</span>
                        <span className="text-dark-textcolor font-semibold">Orders</span>
                    </div>
                    <p className="mt-2 text-sm text-light-textcolor">
                        Review your recent purchases and order status.
                    </p>
                </div>

                {orders.length === 0 ? (
                    <div className="rounded-2xl border border-[#f2dcc4] bg-section-background p-8 text-center shadow-sm">
                        <p className="text-lg font-medium">No orders yet.</p>
                        <p className="mt-2 text-sm text-light-textcolor">
                            Your placed orders will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">

                        {orders.map((order) => (
                            <article
                                onClick={() => navigate(`/orders/${order._id}`)}
                                key={order._id}
                                className="rounded-2xl border border-[#f2dcc4] bg-section-background p-5 shadow-sm transition-all duration-150 hover:shadow-lg"
                            >
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                    <div className="flex-1 space-y-3">
                                        <div>
                                            <p className="text-sm font-semibold uppercase tracking-[0.1em] text-light-textcolor">
                                                Order ID
                                            </p>
                                            <p className="break-all text-base font-medium text-dark-textcolor">
                                                {order._id}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold uppercase tracking-[0.1em] text-light-textcolor">
                                                Items
                                            </p>
                                            <ul className="mt-2 space-y-2">
                                                {order.items.slice(0, 1).map((item, index) => (
                                                    <li
                                                        key={`${order._id}-${index}`}
                                                        className="rounded-lg bg-white/70 px-3 py-2"
                                                    >
                                                        <div className="flex items-center justify-between gap-3">
                                                            <span className="text-sm font-medium capitalize  text-dark-textcolor">
                                                                {item.product.name}
                                                            </span>
                                                            <span className="text-sm text-light-textcolor">
                                                                Qty: {item.quantity}
                                                            </span>
                                                        </div>
                                                    </li>
                                                ))}
                                                {order.items.length > 2 && <li
                                                    key={"truncate ..."}
                                                    className="rounded-lg bg-gradient-to-r from-white/70 to-main-background px-3 py-2">
                                                    <div className="flex items-center justify-between gap-3">
                                                        {"+" + (order.items.length - 1 + " More")}
                                                    </div>
                                                </li>}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-start gap-3 md:min-w-[180px] md:items-end">
                                        <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold capitalize ${getStatusClasses(order.status)}`}>
                                            {order.status}
                                        </span>

                                        <div className="text-left md:text-right">
                                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-light-textcolor">
                                                Total Bill
                                            </p>
                                            <p className="text-xl font-semibold text-dark-textcolor">
                                                ₹{order.billing.totalBill}
                                            </p>
                                        </div>


                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrdersPage;
