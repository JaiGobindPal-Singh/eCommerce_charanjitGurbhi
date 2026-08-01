import { useEffect, useState } from 'react';
import ToggleButton from '../utilents/ToggleButton';
import { createCharge, deleteCharge, getCharges, updateCharge } from '../../utils/chargeUtils';

function Field({ label, children }) {
    return (
        <label className="flex flex-col gap-1 text-sm text-slate-300">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
            {children}
        </label>
    );
}

const emptyForm = {
    chargeName: '',
    chargeAmount: '',
    chargePercent: '',
    fixed: false,
    noChargeConditions: {
        minAmount: '',
        postalCodes: [],
        paymentOption: ''
    }
};

export default function ChargesMenu() {
    const [charges, setCharges] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [newPostalCode, setNewPostalCode] = useState('');

    

    useEffect(() => {
        const loadCharges = async () => {
        setLoading(true);
        const result = await getCharges();
        setCharges(result || []);
        setLoading(false);
    };
        loadCharges();
    }, []);

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
        setNewPostalCode('');
    };

    const handleEdit = (charge) => {
        setEditingId(charge.id);
        setForm({
            chargeName: charge.chargeName || '',
            chargeAmount: charge.chargeAmount ?? '',
            chargePercent: charge.chargePercent ?? '',
            fixed: Boolean(charge.fixed),
            noChargeConditions: {
                minAmount: charge.noChargeConditions?.minAmount ?? '',
                postalCodes: Array.isArray(charge.noChargeConditions?.postalCodes) ? charge.noChargeConditions.postalCodes : [],
                paymentOption: charge.noChargeConditions?.paymentOption ?? ''
            }
        });
    };

    const handleAddPostalCode = () => {
        const trimmedCode = newPostalCode.trim();
        if (!trimmedCode) return;

        setForm((prev) => ({
            ...prev,
            noChargeConditions: {
                ...prev.noChargeConditions,
                postalCodes: prev.noChargeConditions.postalCodes.includes(trimmedCode)
                    ? prev.noChargeConditions.postalCodes
                    : [...prev.noChargeConditions.postalCodes, trimmedCode]
            }
        }));
        setNewPostalCode('');
    };

    const handleRemovePostalCode = (postalCode) => {
        setForm((prev) => ({
            ...prev,
            noChargeConditions: {
                ...prev.noChargeConditions,
                postalCodes: prev.noChargeConditions.postalCodes.filter((code) => code !== postalCode)
            }
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!form.chargeName.trim()) return;

        const payload = {
            chargeName: form.chargeName.trim(),
            chargeAmount: Number(form.chargeAmount) || 0,
            chargePercent: Number(form.chargePercent) || 0,
            fixed: form.fixed,
            noChargeConditions: {
                minAmount: Number(form.noChargeConditions.minAmount) || 0,
                postalCodes: form.noChargeConditions.postalCodes || [],
                paymentOption: form.noChargeConditions.paymentOption.trim()
            }
        };

        if (editingId) {
            await updateCharge(editingId, payload);
        } else {
            await createCharge(payload);
        }
        resetForm();
    };

    const handleDelete = async (chargeId) => {
        const yes = confirm('Delete this charge?');
        if (!yes) return;

        await deleteCharge(chargeId);
        
        if (editingId === chargeId) {
            resetForm();
        }
    };

    return (
        <div className="w-full flex gap-2 max-md:flex-col">
            
            <div className="w-full rounded-xl border border-slate-800 bg-slate-900/40 p-3 shadow-sm">
               

                {loading ? (
                    <div className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-4 text-sm text-slate-400">
                        Loading charges...
                    </div>
                ) : charges.length > 0 ? (
                    <div className="space-y-2">
                        {charges.map((charge) => (
                            <div
                                key={charge.id || charge._id}
                                className="rounded-lg border border-slate-800 bg-slate-950/70 p-3"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="text-sm font-semibold text-slate-200">
                                            {charge.chargeName || 'Not specified'}
                                        </div>
                                        <div className="mt-1 text-xs text-slate-400">
                                            Amount: {charge.chargeAmount ?? 0} • Percent: {charge.chargePercent ?? 0} • Fixed: {charge.fixed ? 'Yes' : 'No'}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(charge)}
                                            className="rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(charge.id || charge._id)}
                                            className="rounded-lg bg-rose-600/80 px-2.5 py-1.5 text-xs font-semibold text-slate-100 hover:bg-rose-500"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-4 text-sm text-slate-400">
                        No charges yet. Create your first one above.
                    </div>
                )}
            </div>
            <form
                onSubmit={handleSubmit}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/40 p-3 shadow-sm"
            >
                <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-200 font-mono">
                        {editingId ? 'Update Charge' : 'Add New Charge'}
                    </span>
                    {editingId ? (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                        >
                            Cancel
                        </button>
                    ) : null}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                    <Field label="Charge Name">
                        <input
                            value={form.chargeName}
                            onChange={(event) => setForm((prev) => ({ ...prev, chargeName: event.target.value }))}
                            placeholder="Delivery charge"
                            className="rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500"
                        />
                    </Field>

                    <Field label="Charge Amount">
                        <input
                            type="number"
                            value={form.chargeAmount}
                            onChange={(event) => setForm((prev) => ({ ...prev, chargeAmount: event.target.value }))}
                            placeholder="0"
                            className="rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500"
                        />
                    </Field>

                    <Field label="Charge Percent">
                        <input
                            type="number"
                            value={form.chargePercent}
                            onChange={(event) => setForm((prev) => ({ ...prev, chargePercent: event.target.value }))}
                            placeholder="0"
                            min={0}
                            max={100}
                            className="rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500"
                        />
                    </Field>

                    <Field label="Fixed Charge">
                        <div className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2">
                            <span className="text-sm text-slate-400">Enable fixed pricing</span>
                            <ToggleButton
                                checked={form.fixed}
                                onChange={(value) => setForm((prev) => ({ ...prev, fixed: value }))}
                            />
                        </div>
                    </Field>
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <Field label="Exempted min Amount">
                        <input
                            type="number"
                            value={form.noChargeConditions.minAmount}
                            onChange={(event) => setForm((prev) => ({
                                ...prev,
                                noChargeConditions: { ...prev.noChargeConditions, minAmount: event.target.value }
                            }))}
                            placeholder="0"
                            className="rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500"
                        />
                    </Field>

                    <Field label="Exempted Payment Option">
                        <input
                            value={form.noChargeConditions.paymentOption}
                            onChange={(event) => setForm((prev) => ({
                                ...prev,
                                noChargeConditions: { ...prev.noChargeConditions, paymentOption: event.target.value }
                            }))}
                            placeholder="online / cod"
                            className="rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500"
                        />
                    </Field>
                </div>

                <div className="mt-3 rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-200 font-mono">Exempted Postal Codes</span>
                        <span className="text-xs text-slate-400">
                            {form.noChargeConditions.postalCodes.length} {form.noChargeConditions.postalCodes.length === 1 ? 'code' : 'codes'}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <input
                            value={newPostalCode}
                            onChange={(event) => setNewPostalCode(event.target.value)}
                            onKeyDown={(event) => event.key === 'Enter' && (event.preventDefault(), handleAddPostalCode())}
                            placeholder="Enter postal code"
                            className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500"
                        />
                        <button
                            type="button"
                            onClick={handleAddPostalCode}
                            className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-600"
                        >
                            Add
                        </button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                        {form.noChargeConditions.postalCodes.length > 0 ? (
                            form.noChargeConditions.postalCodes.map((code) => (
                                <div
                                    key={code}
                                    className="flex items-center rounded-full border border-slate-700 bg-slate-800/70 px-2.5 py-1 text-sm text-slate-200"
                                >
                                    <span className="mr-2">{code}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemovePostalCode(code)}
                                        className="text-slate-400 hover:text-red-400"
                                        aria-label={`Remove ${code}`}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))
                        ) : (
                            <span className="text-sm text-slate-500">No postal codes added</span>
                        )}
                    </div>
                </div>

                <div className="mt-3 flex justify-end">
                    <button
                        type="submit"
                        className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-600"
                    >
                        {editingId ? 'Save Changes' : 'Create Charge'}
                    </button>
                </div>
            </form>
        </div>
    );
}
