import React from "react";



const Input: React.FC<InputProps> = (props: InputProps) => {
    const {
        label,
        value,
        onChange,
        placeholder,
        name,
        id,
        required,
        disabled,
        type = "text",
        inputMode,
        min,
        max,
        step,
        autoComplete,
        helperText,
        error,
        className = "",
    } = props
    const inputId =
        id || name || label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-_]/g, "");
    const describedBy =
        [helperText ? `${inputId}-help` : null, error ? `${inputId}-error` : null]
            .filter(Boolean)
            .join(" ") || undefined;

    const base =
        "block w-full rounded-lg border p-2.5 text-sm outline-none " +
        "bg-white border-gray-300 text-gray-900 " +
        "focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500 " +
        "dark:focus:ring-gray-300 dark:focus:border-gray-300";

    return (
        <div className={className}>
            <label htmlFor={inputId} className="block py-1 mb-1 text-sm font-medium text-gray-900">
                {label}{required && <span className="ml-1 text-red-600">*</span>}
            </label>
            <input
                id={inputId}
                name={name}
                type={type}
                inputMode={inputMode}
                min={min}
                max={max}
                step={step}
                autoComplete={autoComplete}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                aria-invalid={!!error}
                aria-describedby={describedBy}
                className={base + (error ? " border-red-500 focus:ring-red-500/40 focus:border-red-500" : "")}
            />
            {helperText && !error && (
                <p id={`${inputId}-help`} className="mt-1 text-xs text-gray-500">{helperText}</p>
            )}
            {error && (
                <p id={`${inputId}-error`} className="mt-1 text-xs font-medium text-red-600">{error}</p>
            )}
        </div>
    );
};

type InputProps = {
    label: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    name?: string;
    id?: string;
    required?: boolean;
    disabled?: boolean;
    type?: React.HTMLInputTypeAttribute; // "text" | "number" | ...
    inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]; // "decimal" | "numeric" | ...
    min?: number;
    max?: number;
    step?: number | "any";
    autoComplete?: string;
    helperText?: string;
    error?: string;
    className?: string;
};
export default Input;
