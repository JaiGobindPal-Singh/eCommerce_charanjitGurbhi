import { X, Package, Truck, Receipt, PencilLine } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getOrderDetails, updateOrderStatus } from '../../utils/orderUtils';

const formatCurrency = (value) => {
    const numericValue = Number(value ?? 0);
    return `₹${numericValue.toLocaleString('en-IN')}`;
};

const toDisplayValue = (value) => {
    if (value === null || value === undefined || value === '') {
        return 'Not provided';
    }
    try {

        const a = new Date(value).toISOString().split('T')[0];
        return a;
    } catch {
        console.log("e")
    }

};

const formatStatusText = (status) => {
    if (!status) return 'Pending';
    return status
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

function OrderModal({ isOpen, onClose, orderId }) {
    const [order, setOrder] = useState({});
    const [formData, setFormData] = useState({
        status: '',
        deliveryPartner: '',
        trackingId: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!orderId) {
            return;
        }
        getOrderDetails(orderId).then(od => {
            setOrder(od);
            setFormData({
                status: od?.status || '',
                deliveryPartner: od?.deliveryDetails?.deliveryPartner || '',
                trackingId: od?.deliveryDetails?.trackingId || ''
            });
        })
    }, [orderId])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateOrderStatus(orderId, formData.status, '', formData.deliveryPartner, formData.trackingId);
            setOrder((prev) => ({
                ...prev,
                status: formData.status,
                deliveryDetails: {
                    ...prev.deliveryDetails,
                    deliveryPartner: formData.deliveryPartner,
                    trackingId: formData.trackingId
                }
            }));
        } catch (error) {
            console.log(error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen || !order) {
        return null;
    }

    const items = order.items;
    const address = order.deliveryDetails?.deliveryAddress.streetAddress;
    const city = order.deliveryDetails?.deliveryAddress.city;
    const state = order.deliveryDetails?.deliveryAddress.state;
    const pincode = order.deliveryDetails?.deliveryAddress.postalCode;
    const customerName = order.deliveryDetails?.deliveryAddress.fullName;
    const phone = order.deliveryDetails?.deliveryAddress.phone;
    const email = order.deliveryDetails?.deliveryAddress.email || 'Not specified';
    const deliveryPartner = order.deliveryDetails?.deliveryPartner;
    const trackingId = order.deliveryDetails?.trackingId;

    const calculateSubtotal = (totalBill, charges) => {
        let subtotal = totalBill;
        charges?.forEach(ch => {
            subtotal -= ch.chargeAmount
        })
        return subtotal
    }
    const billTotal = order.billing?.totalBill;
    const subtotal = calculateSubtotal(order.billing?.totalBill ?? 0, order.billing?.charges ?? []);
    const discount = order.billing?.discount;
    const paymentMethod = order.billing?.paymentMode;
    const charges = order.billing?.charges;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-3 py-4 backdrop-blur-sm">
            <div
                className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl shadow-slate-950/40"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-start justify-between border-b border-slate-800 px-5 py-4 sm:px-6">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Order details</p>
                        <h2 className="mt-1 text-xl font-semibold text-primary-color">{orderId}</h2>
                        <p className="mt-1 text-sm text-slate-400">
                            {formatStatusText(order.status)} • Placed on {toDisplayValue(order.createdAt || order.date || order.orderedAt)}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-slate-700 bg-slate-800 p-2 text-slate-300 transition hover:bg-slate-700 hover:text-white"
                        aria-label="Close order details"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-[1.55fr_0.95fr]">
                    <div className="space-y-4">
                        <div className="rounded-2xl border border-slate-800 bg-slate-800/70 p-4">
                            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                                <Package size={16} />
                                <span>Items</span>
                            </div>
                            <div className="mt-3 space-y-2">
                                {items?.length > 0 ? (
                                    items.map((item, index) => {

                                        return (
                                            <div key={`${item.product.name}-${index}`} className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-3">
                                                <div>
                                                    <p className="font-medium text-slate-100">{item.product.name}</p>
                                                    <p className="text-sm text-slate-400">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="text-sm font-semibold text-slate-100">{formatCurrency(item.product.price * item.quantity)}</p>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="rounded-xl border border-dashed border-slate-700 px-3 py-4 text-sm text-slate-400">
                                        No item details were provided for this order.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-800/70 p-4">
                            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                                <Receipt size={16} />
                                <span>Billing details</span>
                            </div>
                            <div className="mt-3 space-y-2 text-sm text-slate-300">
                                <div className="flex items-center justify-between">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(subtotal || billTotal)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Discount</span>
                                    <span>- {formatCurrency(discount)}</span>
                                </div>

                                {charges?.map(ch => (
                                    <div key={ch.chargeName + ch.chargeAmount} className="flex items-center justify-between">
                                        <span>{ch.chargeName}</span>
                                        <span>{formatCurrency(ch.chargeAmount)}</span>
                                    </div>
                                ))}

                                <div className="mt-2 flex items-center justify-between border-t border-slate-700 pt-3 text-base font-semibold text-white">
                                    <span>Total</span>
                                    <span>{formatCurrency(billTotal)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {
                            !['payment_failed', 'payment_pending', 'abandoned', 'cancelled'].includes(order.status) &&
                            <div className="rounded-2xl border border-slate-800 bg-slate-800/70 p-4">
                                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                                    <PencilLine size={16} />
                                    <span>Update order</span>
                                </div>
                                <form onSubmit={handleSubmit} className="mt-3 space-y-3">
                                    <div>
                                        <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-slate-500">Status</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-slate-500">Delivery partner</label>
                                        <input
                                            name="deliveryPartner"
                                            value={formData.deliveryPartner}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none"
                                            placeholder="Enter delivery partner"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs uppercase tracking-[0.2em] text-slate-500">Tracking ID</label>
                                        <input
                                            name="trackingId"
                                            value={formData.trackingId}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none"
                                            placeholder="Enter tracking ID"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="w-full rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
                                    >
                                        {isSaving ? 'Updating...' : 'Update Order'}
                                    </button>
                                </form>
                            </div>
                        }
                        <div className="rounded-2xl border border-slate-800 bg-slate-800/70 p-4">
                            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                                <Truck size={16} />
                                <span>Delivery details</span>
                            </div>
                            <div className="mt-3 space-y-3 text-sm text-slate-300">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Customer</p>
                                    <p className="mt-1 font-medium text-slate-100">{(customerName)}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Phone</p>
                                    <p className="mt-1 font-medium text-slate-100">{(phone)}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Email</p>
                                    <p className="mt-1 font-medium text-slate-100">{(email)}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Address</p>
                                    <p className="mt-1 font-medium text-slate-100">{([address, city, state, pincode].filter(Boolean).join(', '))}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Delivery partner</p>
                                    <p className="mt-1 font-medium text-slate-100">{(deliveryPartner)}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Tracking ID</p>
                                    <p className="mt-1 font-medium text-slate-100">{(trackingId)}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Payment method</p>
                                    <p className="mt-1 font-medium text-slate-100">{(paymentMethod)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderModal;