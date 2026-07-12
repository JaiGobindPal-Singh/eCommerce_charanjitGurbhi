import { getCart, removeFromCart, updateProductQuantity } from "../utils/cartUtils";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, IndianRupee, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { generateNotification } from "../utils/notificationUtils";
function formatCurrency(value) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value);
}

function CartItem({ item, onQuantityChange, onRemove }) {
    return (
        <div className="flex flex-col gap-4 rounded-3xl border border-[#EBD8C0] bg-section-background p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
                <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="h-24 w-24 rounded-2xl object-cover"
                />
                <div>
                    <h3 className="text-lg font-semibold text-dark-textcolor">{item.product.name}</h3>
                    <p className="mt-1 flex items-center gap-1 text-sm text-light-textcolor">
                        <IndianRupee className="h-4 w-4" />
                        {item.product.price}
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end">
                <div className="flex items-center rounded-full border border-[#EBD8C0] bg-main-background p-1">
                    <button
                        type="button"
                        onClick={() => onQuantityChange(item.product.id, item.quantity - 1)}
                        className="rounded-full p-2 text-light-textcolor transition hover:bg-[#f6e3c4]"
                        disabled={item.quantity === 1}
                    >
                        <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-8 text-center text-sm font-semibold text-dark-textcolor">
                        {item.quantity}
                    </span>
                    <button
                        type="button"
                        onClick={() => onQuantityChange(item.product.id, item.quantity + 1)}
                        className="rounded-full p-2 text-light-textcolor transition hover:bg-[#f6e3c4]"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <p className="text-base font-semibold text-dark-textcolor">
                        {formatCurrency(item.product.price * item.quantity)}
                    </p>
                    <button
                        type="button"
                        onClick={() => onRemove(item)}
                        className="rounded-full p-2 text-light-textcolor transition hover:bg-[#f6e3c4]"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function CartPage() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);


    useEffect(() => {
        getCart().then((cartItems) => {
            setItems(cartItems || []);
        }).catch((error) => {
            console.error("Error fetching cart items:", error);
        })
    }, [])

    const cartTotal = useMemo(
        () => items?.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
        [items]
    );

    const updateQuantity = (itemId, quantity) => {
        if (!quantity || quantity < 1) {
            return;
        }
        updateProductQuantity(itemId, quantity).then(() => {
            setItems((currentItems) =>
                currentItems.map((currentItem) =>
                    (currentItem.product?.id ?? currentItem.id) === itemId
                        ? { ...currentItem, quantity }
                        : currentItem
                )
            );
        }).catch((error) => {
            generateNotification("unable to update quantity")();
            console.error(error);
        });
    };

    const removeItem = (item) => {
        const itemId = item?.product?.id || item?.id;
        removeFromCart(item).then(() =>
            setItems((currentItems) =>
                currentItems.filter((currentItem) =>
                    (currentItem.product?.id ?? currentItem.id) !== itemId
                )
            )
        ).catch((error) => {
            console.error("Error removing item from cart:", error);
        });
    };

    return (
        <div className="min-h-screen bg-main-background px-4 py-8 text-dark-textcolor sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <button
                    type="button"
                    onClick={() => navigate("/products")}
                    className="mb-6 inline-flex items-center gap-2 rounded-full bg-section-background px-4 py-2 text-sm font-semibold text-light-textcolor shadow-sm transition hover:-translate-y-0.5"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Continue Shopping
                </button>

                <div className="grid gap-6 lg:grid-cols-[1.6fr_0.8fr]">
                    <section className="rounded-[2rem] border border-[#EBD8C0] bg-white/70 p-4 shadow-sm backdrop-blur sm:p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm uppercase tracking-[0.25em] text-light-textcolor">Your cart</p>
                                <h1 className="text-3xl font-semibold sm:text-4xl">Shopping bag</h1>
                            </div>
                            
                        </div>

                        {items.length === 0 ? (
                            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#EBD8C0] bg-section-background p-8 text-center">
                                <ShoppingBag className="mb-4 h-12 w-12 text-light-textcolor" />
                                <h2 className="text-2xl font-semibold">Your cart is empty</h2>
                                <p className="mt-2 max-w-sm text-sm text-light-textcolor/80">
                                    Add a few handcrafted favorites and they will appear here.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => navigate("/products")}
                                    className="mt-6 rounded-full bg-light-textcolor px-5 py-2.5 text-sm font-semibold text-main-background transition hover:opacity-90"
                                >
                                    Browse products
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <CartItem
                                        key={item.product.id}
                                        item={item}
                                        onQuantityChange={updateQuantity}
                                        onRemove={removeItem}
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                    <aside className="rounded-[2rem] border border-[#EBD8C0] bg-section-background p-6 shadow-sm">
                        <h2 className="text-2xl font-semibold">Order summary</h2>
                        <div className="mt-6 space-y-3 text-sm text-light-textcolor">

                            <div className="mt-4 flex items-center justify-between border-t border-[#EBD8C0] pt-4 text-base font-semibold text-dark-textcolor">
                                <span>Cart Total</span>
                                <span>{formatCurrency(cartTotal)}</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate("/pre-checkout")}
                            className="mt-8 w-full rounded-full bg-light-textcolor px-4 py-3 text-sm font-semibold text-main-background transition hover:opacity-90"
                        >
                            Proceed to checkout
                        </button>
                        
                    </aside>
                </div>
            </div>
        </div>
    );
}
