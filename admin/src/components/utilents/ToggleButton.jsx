// components/Toggle.jsx
import { useState } from "react";

export default function ToggleButton({
    checked,
    defaultChecked = false,
    onChange,
    disabled = false,
    size = "md",
    label,
    className = "",
}) {
    const [internalChecked, setInternalChecked] = useState(defaultChecked);

    const isControlled = checked !== undefined;
    const isChecked = isControlled ? checked : internalChecked;

    const handleToggle = () => {
        if (disabled) return;

        const newValue = !isChecked;

        if (!isControlled) {
            setInternalChecked(newValue);
        }

        onChange?.(newValue);
    };

    const sizes = {
        sm: {
            track: "w-10 h-5",
            thumb: "w-4 h-4",
            translate: "translate-x-5",
        },
        md: {
            track: "w-12 h-6",
            thumb: "w-5 h-5",
            translate: "translate-x-6",
        },
        lg: {
            track: "w-14 h-7",
            thumb: "w-6 h-6",
            translate: "translate-x-7",
        },
    };

    const s = sizes[size];

    return (
        <button
            type="button"
            role="switch"
            aria-checked={isChecked}
            disabled={disabled}
            onClick={handleToggle}
            className={`inline-flex items-center gap-3 ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                } ${className}`}
        >
            {label && (
                <span className="text-sm text-slate-200 font-medium">
                    {label}
                </span>
            )}

            <div
                className={`
          relative flex items-center rounded-full
          transition-all duration-300 ease-in-out
          ${s.track}
          ${isChecked
                        ? "bg-slate-500"
                        : "bg-slate-800 border border-slate-700"
                    }
        `}
            >
                <span
                    className={`
            absolute left-0.5
            rounded-full
            shadow-md
            transition-all duration-300 ease-in-out
            ${s.thumb}
            ${isChecked
                            ? `${s.translate} bg-white`
                            : "translate-x-0 bg-slate-400"
                        }
          `}
                />
            </div>
        </button>
    );
}