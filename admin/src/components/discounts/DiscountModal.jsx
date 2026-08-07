import { useEffect, useMemo, useState } from "react";
import { LoaderCircle, X } from "lucide-react";
import { createDiscount, updateDiscount } from "../../utils/discountUtils";

const emptyForm = {
    code: "",
    description: "",
    discountType: "percent",
    discountValue: "",
    startDate: "",
    endDate: "",
    minCartValue: "",
    maxDiscountAmount: "",
};

export default function DiscountModal({ isOpen, setIsOpen, discount, onSaved }) {
    const [formData, setFormData] = useState(emptyForm);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const initialFormData = useMemo(() => {
        if (!discount) {
            return emptyForm;
        }

        return {
            code: discount.code ?? "",
            description: discount.description ?? "",
            discountType: discount.discountType ?? "percent",
            discountValue: discount.discountValue ?? "",
            startDate: discount.startDate ? discount.startDate.slice(0, 10) : "",
            endDate: discount.endDate ? discount.endDate.slice(0, 10) : "",
            minCartValue: discount.conditions?.minCartValue ?? "",
            maxDiscountAmount: discount.conditions?.maxDiscountAmount ?? "",
        };
    }, [discount]);

    useEffect(() => {
        if (!isOpen) return;
        setFormData(initialFormData);
        setError("");
    }, [initialFormData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.code.trim() || !formData.discountValue) {
            setError("Please add a discount code and value.");
            return;
        }

        setIsSubmitting(true);
        setError("");

        const payload = {
            code: formData.code.trim(),
            description: formData.description.trim(),
            discountType: formData.discountType,
            discountValue: Number(formData.discountValue),
            startDate: formData.startDate || null,
            endDate: formData.endDate || null,
            conditions: {
                minCartValue: formData.minCartValue ? Number(formData.minCartValue) : null,
                maxDiscountAmount: formData.maxDiscountAmount ? Number(formData.maxDiscountAmount) : null,
            },
        };

        const yes = confirm(discount ? "Are you sure to update this discount? Changes cannot be reverted." : "Are you sure to create this discount? Changes cannot be reverted.");
        if (!yes) {
            setIsSubmitting(false);
            return;
        }
        try {
            if (discount?.id) {
                await updateDiscount({
                    ...payload,
                    id: discount.id,
                    active: discount.isActive ?? true,
                });
            } else {
                await createDiscount(payload);
            }

            onSaved?.();
            setIsOpen(false);
        } catch (submitError) {
            console.error("Discount submit error", submitError);
            setError("Something went wrong while saving the discount.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/70 px-4 py-4 sm:items-center sm:py-6 backdrop-blur-sm">
            <div className="w-full max-w-2xl max-h-[90dvh] overflow-hidden rounded-3xl border border-slate-800/70 bg-color-heavy shadow-2xl shadow-slate-950/30">
                <div className="sticky top-0 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 px-6 py-5">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.2em]  text-primary-color/80">
                            Discounts
                        </p>
                        <h2 className="text-xl font-semibold text-slate-100">
                            {discount ? "Edit discount" : "Create discount"}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-color-medium text-slate-900 transition hover:opacity-80"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="max-h-[calc(90dvh-88px)] overflow-y-auto space-y-5 p-6 sm:p-8">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300" htmlFor="discount-code">
                                Discount code
                            </label>
                            <input
                                id="discount-code"
                                type="text"
                                value={formData.code}
                                onChange={(event) => handleChange("code", event.target.value)}
                                placeholder="SUMMER10"
                                className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-primary-color focus:ring-2 focus:ring-primary-color/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300" htmlFor="discount-type">
                                Discount type
                            </label>
                            <select
                                id="discount-type"
                                value={formData.discountType}
                                onChange={(event) => handleChange("discountType", event.target.value)}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-primary-color focus:ring-2 focus:ring-primary-color/20"
                            >
                                <option value="percentage">Percent</option>
                                <option value="fixed">Fixed</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="w-full">
                            <label className="text-sm font-medium text-slate-300" htmlFor="discount-value">
                                Discount value
                            </label>
                            <div className="w-full">
                                <input
                                    id="discount-value"
                                    type="number"
                                    min="0"
                                    value={formData.discountValue}
                                    onChange={(event) => handleChange("discountValue", event.target.value)}
                                    placeholder="10"
                                    className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 pr-10 text-sm text-white outline-none transition focus:border-primary-color focus:ring-2 focus:ring-primary-color/20"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300" htmlFor="discount-description">
                                Description
                            </label>
                            <input
                                id="discount-description"
                                type="text"
                                value={formData.description}
                                onChange={(event) => handleChange("description", event.target.value)}
                                placeholder="Offer description"
                                className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-primary-color focus:ring-2 focus:ring-primary-color/20"
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300" htmlFor="discount-start-date">
                                Start date
                            </label>
                            <input
                                id="discount-start-date"
                                type="date"
                                value={formData.startDate}
                                onChange={(event) => handleChange("startDate", event.target.value)}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-primary-color focus:ring-2 focus:ring-primary-color/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300" htmlFor="discount-end-date">
                                End date
                            </label>
                            <input
                                id="discount-end-date"
                                type="date"
                                value={formData.endDate}
                                onChange={(event) => handleChange("endDate", event.target.value)}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-primary-color focus:ring-2 focus:ring-primary-color/20"
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300" htmlFor="discount-min-cart">
                                Minimum cart value
                            </label>
                            <input
                                id="discount-min-cart"
                                type="number"
                                min="0"
                                value={formData.minCartValue}
                                onChange={(event) => handleChange("minCartValue", event.target.value)}
                                placeholder="0"
                                className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-primary-color focus:ring-2 focus:ring-primary-color/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300" htmlFor="discount-max-amount">
                                Maximum discount amount
                            </label>
                            <input
                                id="discount-max-amount"
                                type="number"
                                min="0"
                                value={formData.maxDiscountAmount}
                                onChange={(event) => handleChange("maxDiscountAmount", event.target.value)}
                                placeholder="0"
                                className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-primary-color focus:ring-2 focus:ring-primary-color/20"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-color px-5 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-primary-color/80 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? (
                            <>
                                <LoaderCircle size={18} className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            discount ? "Save changes" : "Create discount"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
