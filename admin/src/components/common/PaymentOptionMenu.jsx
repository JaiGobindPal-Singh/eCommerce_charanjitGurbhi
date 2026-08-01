import { useEffect, useState } from 'react';
import ToggleButton from '../utilents/ToggleButton';
import { getPaymentOptions, updatePaymentOptions } from '../../utils/paymentOptionsUtils';

function Option({ optionName, enabled, onChange }) {
    return (
        <div
            className={`w-full mb-2 max-h-12 items-center flex justify-between p-3  bg-slate-900/90 border border-slate-800 rounded-xl shadow-sm transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/80 `}>
            <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-slate-200 font-mono">
                    {optionName || "Not Specified"}
                </span>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-slate-200 font-mono">
                    <ToggleButton checked={enabled ?? false} onChange={onChange} />
                </span>
            </div>
        </div>
    );
}

export default function PaymentOptionMenu() {
    const [onlineStatus, setOnlineStatus] = useState(false);
    const [codStatus, setCodStatus] = useState(false);
    const [allowedPostalCodes, setAllowedPostalCodes] = useState([]);
    const [newPostalCode, setNewPostalCode] = useState('');

    useEffect(() => {
        const func = async () => {
            const options = await getPaymentOptions();
            setOnlineStatus(options.online.enabled);
            setCodStatus(options.cod.enabled);
            setAllowedPostalCodes(options.cod.allowedPostalCodes || []);
        };
        func();
    }, []);

    const handleAddPostalCode = () => {
        const trimmedCode = newPostalCode.trim();
        if (!trimmedCode) return;

        setAllowedPostalCodes((prev) => {
            if (prev.includes(trimmedCode)) return prev;
            return [...prev, trimmedCode];
        });
        setNewPostalCode('');
    };

    const handleRemovePostalCode = (postalCode) => {
        setAllowedPostalCodes((prev) => prev.filter((code) => code !== postalCode));
    };

    const handleClearPostalCodes = () => {
        const yes = confirm("are you sure to clear all postal codes this will allow delivery at all locations");
        if (yes) setAllowedPostalCodes([]);
    }

    const handleSubmit = async () => {
        const yes = confirm("Are you sure to update payment options? Changes cannot be reverted");
        if (!yes) return;

        const response = updatePaymentOptions({ onlineStatus, codStatus, allowedPostalCodes });
        setOnlineStatus(response.online.enabled);
        setCodStatus(response.cod.enabled);
        setAllowedPostalCodes(response.cod.allowedPostalCodes || []);
    }

    return (
        <div className='w-full'>
            <Option
                optionName={'Online'}
                enabled={onlineStatus}
                onChange={setOnlineStatus}
            />

            <Option
                optionName={'Cash On Delivery'}
                enabled={codStatus}
                onChange={setCodStatus}
            />

            <div className="w-full mb-1 rounded-xl border border-slate-800 bg-slate-900/90 p-3 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-200 font-mono">
                        Allowed Postal Codes
                    </span>
                    <span className="text-xs text-slate-400">
                        {allowedPostalCodes.length} {allowedPostalCodes.length === 1 ? 'code' : 'codes'}
                    </span>
                </div>

                <div className="flex gap-2">
                    <input
                        value={newPostalCode}
                        onChange={(e) => setNewPostalCode(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddPostalCode()}
                        placeholder="Enter postal code"
                        className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500"
                    />
                    <button
                        type="button"
                        onClick={handleAddPostalCode}
                        className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-600"
                    >
                        Add
                    </button>
                    <button
                        type="button"
                        onClick={handleClearPostalCodes}
                        className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-600"
                    >
                        Clear
                    </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                    {allowedPostalCodes.length > 0 ? (
                        allowedPostalCodes.map((code) => (
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
                        <span className="text-sm text-slate-500">No postal codes added || Delivery allowed at all Locations</span>
                    )}
                </div>
            </div>
            <div className="w-full flex max-md:justify-center">

                <button
                    type="button"
                    onClick={handleSubmit}
                    className="mt-2 rounded-lg bg-slate-900/70 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-600"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
}
