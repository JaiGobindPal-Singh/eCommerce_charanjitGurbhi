export default function OrderListItem({ id, name, phone }) {
    return (
        <div key={id} className="w-full flex flex-col md:flex-row md:items-center md:justify-between p-3 md:p-4 gap-3 md:gap-0 bg-slate-900/90 border border-slate-800 rounded-xl shadow-sm transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/80">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full md:w-auto">
            
                <div className="flex flex-col items-start gap-1 min-w-[80px]">
                    <span className="text-xs font-medium tracking-wider text-slate-500 uppercase">
                        name
                    </span>
                    <div className={"text-slate-200 text-sm uppercase p-1 rounded-md"}>
                        <span>{name}</span>
                    </div>
                </div>

                </div>
    
                <div className="flex flex-col items-start md:items-end gap-1 min-w-[80px]">
                    <span className="text-xs font-medium tracking-wider text-slate-500 uppercase">
                        Phone
                    </span>
                    <div className="text-slate-200 text-sm uppercase p-1 rounded-md">
                        
                        <span>{phone}</span>
                    </div>
            </div>

        </div>
    );
}
