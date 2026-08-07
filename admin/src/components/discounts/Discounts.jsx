import { useEffect, useMemo, useState } from 'react';
import ToggleButton from '../utilents/ToggleButton';
import { getDiscounts, updateDiscount } from '../../utils/discountUtils';
import SpinLoader from '../utilents/SpinLoader';
import { Pencil, Plus, Search } from 'lucide-react';
import DiscountModal from './DiscountModal';

function Option({ discount, onEdit, onToggle }) {
    return (
        <div className="mb-3 flex w-full items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-sm transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/80">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-100">{discount.code || 'Not Specified'}</span>
                    <span className="rounded-full border border-slate-700 bg-slate-800/70 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-400">
                        {discount.discountType || 'percentage'}
                    </span>
                </div>
                <p className="text-sm text-slate-400">{discount.description || 'No description provided'}</p>
                <p className="text-xs text-slate-500">
                    Value: {discount.discountValue ?? '-'} • Active: {discount.isActive ? 'Yes' : 'No'}
                </p>
            </div>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    className="rounded-lg p-2 text-primary-color transition hover:bg-slate-800"
                    onClick={() => onEdit(discount)}
                >
                    <Pencil size={18} />
                </button>
                <ToggleButton checked={discount.isActive ?? false} onChange={(value) => onToggle(discount, value)} />
            </div>
        </div>
    );
}

export default function Discounts() {
    const [discounts, setDiscounts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDiscount, setSelectedDiscount] = useState(null);

    const loadDiscounts = async () => {
        setIsLoading(true);
        try {
            const data = await getDiscounts();
            setDiscounts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch discounts', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadDiscounts();
    }, []);

    const filteredDiscounts = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        if (!query) return discounts;

        return discounts.filter((discount) => {
            const haystack = `${discount.code ?? ''} ${discount.description ?? ''}`.toLowerCase();
            return haystack.includes(query);
        });
    }, [discounts, searchTerm]);

    const handleToggle = async (discount, value) => {
        try {
            await updateDiscount({
                id: discount.id,
                code: discount.code,
                description: discount.description,
                discountType: discount.discountType,
                discountValue: discount.discountValue,
                startDate: discount.startDate,
                endDate: discount.endDate,
                conditions: discount.conditions ?? {},
                active: value,
            });

            setDiscounts((prev) => prev.map((item) => item.id === discount.id ? { ...item, isActive: value } : item));
        } catch (error) {
            console.error('Failed to update discount status', error);
        }
    };

    const handleEdit = (discount) => {
        setSelectedDiscount(discount);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedDiscount(null);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-color-medium p-4">
            <div className="relative flex min-h-[95dvh] w-full flex-col rounded-3xl border border-slate-800/70 bg-color-heavy p-4 shadow-2xl shadow-slate-950/20 sm:p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold text-primary-color">Discounts</h1>
                        <p className="text-sm text-slate-400">Manage promotional codes and availability.</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleCreate}
                        className="inline-flex items-center gap-2 rounded-2xl bg-primary-color px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-primary-color/80"
                    >
                        <Plus size={16} />
                        New discount
                    </button>
                </div>

                <div className="mb-4 flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-2.5">
                    <Search size={16} className="text-slate-400" />
                    <input
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Search discounts"
                        className="w-full border-none bg-transparent text-sm text-slate-100 outline-none"
                    />
                </div>

                {isLoading ? (
                    <SpinLoader message="Loading Discounts..." />
                ) : filteredDiscounts.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-8 text-center text-sm text-slate-400">
                        No discounts found.
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {filteredDiscounts.map((discount) => (
                            <Option
                                key={discount.id}
                                discount={discount}
                                onEdit={handleEdit}
                                onToggle={handleToggle}
                            />
                        ))}
                    </div>
                )}
            </div>

            <DiscountModal
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
                discount={selectedDiscount}
                onSaved={loadDiscounts}
            />
        </div>
    );
}
