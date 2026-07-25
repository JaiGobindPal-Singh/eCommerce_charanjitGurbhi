import { IndianRupee } from 'lucide-react'; // Or your preferred icon library

// Helper to map status to beautiful, accessible Tailwind colors
const getStatusStyles = (status) => {
    switch (status) {
        case 'delivered':
        case 'return_approved':
            return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

        case 'order_placed':
        case 'processing':
        case 'out_for_delivery':
            return 'bg-blue-500/10 text-blue-400 border-blue-500/20';

        case 'payment_pending':
        case 'return_requested':
        case 'hold':
            return 'bg-amber-500/10 text-amber-400 border-amber-500/20';

        case 'payment_failed':
        case 'abandoned':
        case 'cancelled':
        case 'returned':
            return 'bg-rose-500/10 text-rose-400 border-rose-500/20';

        default:
            return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
};

// Helper to format the status text cleanly (e.g., 'out_for_delivery' -> 'Out For Delivery')
const formatStatusText = (status) => {
    if (!status) return '';
    return status
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export default function OrderListItem({ orderId, totalBill, status }) {
    const statusStyles = getStatusStyles(status);

    return (
        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between p-3 md:p-4 gap-3 md:gap-0 bg-slate-900/90 border border-slate-800 rounded-xl shadow-sm transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/80">

            {/* Left Side: Order Identity */}
            <div className="flex flex-col gap-1">
                <span className="text-xs font-medium tracking-wider text-slate-500 uppercase">
                    Order ID
                </span>
                <span className="text-sm font-semibold text-slate-200 font-mono">
                    #{orderId}
                </span>
            </div>

            {/* Right Side: Status and Financials */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full md:w-auto">
                {/* Status Badge */}
                <div className="flex flex-col items-start sm:items-end gap-1 min-w-[80px]">
                    <span className="text-xs font-medium tracking-wider text-slate-500 uppercase">
                        status
                    </span>
                    <div className={statusStyles + " text-xs uppercase p-1 rounded-md"}>
                        <span>{formatStatusText(status)}</span>
                    </div>
                </div>

                {/* Total Bill Amount */}
                <div className="flex flex-col items-start sm:items-end gap-1 min-w-[80px]">
                    <span className="text-xs font-medium tracking-wider text-slate-500 uppercase">
                        Total
                    </span>
                    <div className="flex items-baseline font-bold text-slate-100 text-base">
                        <IndianRupee size={14} className="self-center mr-0.5 text-slate-400" />
                        <span>{Number(totalBill).toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>

        </div>
    );
}
