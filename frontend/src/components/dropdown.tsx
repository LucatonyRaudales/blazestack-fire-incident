import { useEffect, useRef, useState } from "react";


const Dropdown = (props: DropdownProps) => {
    const {
        label,
        options,
        value,
        onChange,
        placeholder = "Select an option",
        name,
        id,
        required,
        disabled,
        error,
        className = "",
    } = props
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number>(-1);

    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

    const dropdownId =
        id || name || label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-_]/g, "");
    const selectedIndex = options.findIndex((o) => o.value === value);
    const selected = selectedIndex >= 0 ? options[selectedIndex] : null;

    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (!open) return;
            const t = e.target as Node;
            if (!menuRef.current?.contains(t) && !buttonRef.current?.contains(t)) {
                setOpen(false);
            }
        }
        function onEsc(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }
        document.addEventListener("mousedown", onDocClick);
        document.addEventListener("keydown", onEsc);
        return () => {
            document.removeEventListener("mousedown", onDocClick);
            document.removeEventListener("keydown", onEsc);
        };
    }, [open]);

    // Focus en el item seleccionado al abrir
    useEffect(() => {
        if (open) {
            const idx = Math.max(0, selectedIndex);
            setActiveIndex(idx);
            itemRefs.current[idx]?.focus();
        }
    }, [open, selectedIndex]);

    function choose(idx: number) {
        const opt = options[idx];
        if (!opt) return;
        onChange(opt.value);
        setOpen(false);
        buttonRef.current?.focus();
    }

    return (
        <div className={className}>
            <label
                htmlFor={`${dropdownId}-button`}
                className="block pt-4 mb-1 text-sm font-medium text-gray-900 "
            >
                {label}
                {required && <span className="ml-1 text-red-600">*</span>}
            </label>

            {/* Hidden input por si usas <form> nativo */}
            {name && <input type="hidden" name={name} value={value} />}

            <div className="relative">
                <button
                    ref={buttonRef}
                    id={`${dropdownId}-button`}
                    type="button"
                    disabled={disabled}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    aria-controls={`${dropdownId}-menu`}
                    onClick={() => setOpen((o) => !o)}
                    onKeyDown={(e) => {
                        if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setOpen(true);
                        }
                    }}
                    className={
                        "flex w-full items-center justify-between rounded-lg border p-2.5 text-sm " +
                        "bg-white border-gray-300 text-gray-900 " +
                        "focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500 " +
                        "disabled:opacity-50 " +
                        (error ? " border-red-500 focus:ring-red-500/40 focus:border-red-500" : "")
                    }
                >
                    <span className={selected ? "" : "text-gray-400"}>
                        {selected ? selected.label : placeholder}
                    </span>
                    <svg
                        className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.04l3.71-3.81a.75.75 0 1 1 1.08 1.04l-4.25 4.37a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06z" />
                    </svg>
                </button>

                {open && (
                    <div
                        ref={menuRef}
                        id={`${dropdownId}-menu`}
                        role="listbox"
                        aria-labelledby={`${dropdownId}-button`}
                        className="absolute z-50 mt-2 w-full origin-top-left rounded-2xl border border-neutral-200 bg-white p-1 shadow-lg ring-1 ring-black/5 "
                        onKeyDown={(e) => {
                            if (e.key === "ArrowDown") {
                                e.preventDefault();
                                const next = (activeIndex + 1) % options.length;
                                setActiveIndex(next);
                                itemRefs.current[next]?.focus();
                            } else if (e.key === "ArrowUp") {
                                e.preventDefault();
                                const prev = (activeIndex - 1 + options.length) % options.length;
                                setActiveIndex(prev);
                                itemRefs.current[prev]?.focus();
                            } else if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                choose(activeIndex);
                            }
                        }}
                    >
                        {options.map((opt, i) => {
                            const selected = value === opt.value;
                            return (
                                <button
                                    key={opt.value}
                                    ref={(el) => { itemRefs.current[i] = el; }}

                                    role="option"
                                    aria-selected={selected}
                                    onClick={() => choose(i)}
                                    onMouseEnter={() => setActiveIndex(i)}
                                    className={
                                        "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm " +
                                        (selected
                                            ? "bg-neutral-100 "
                                            : "hover:bg-neutral-100 ")
                                    }
                                >
                                    <span className="flex-1">{opt.label}</span>
                                    {selected && (
                                        <svg className="h-4 w-4 opacity-80" viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                fillRule="evenodd"
                                                d="M16.704 5.29a1 1 0 0 1 0 1.42l-7.01 7.01a1 1 0 0 1-1.42 0L3.296 8.742a1 1 0 1 1 1.414-1.414l3.162 3.162 6.303-6.303a1 1 0 0 1 1.529.103z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {error && (
                <p className="mt-1 text-xs font-medium text-red-600" id={`${dropdownId}-error`}>
                    {error}
                </p>
            )}
        </div>
    );
};

export type Option = { label: string; value: string };

export type DropdownProps = {
    label: string;
    options: Option[];
    value: string | "";
    onChange: (v: any) => void;
    placeholder?: string;
    name?: string;
    id?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    className?: string;
};


export default Dropdown;
