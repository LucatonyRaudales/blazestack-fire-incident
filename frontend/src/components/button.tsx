import React from "react";

export type ButtonProps = {
    children: React.ReactNode;
    type?: "button" | "submit" | "reset";
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    className?: string;
};

const Button = (props: ButtonProps) => {
    const {
        children,
        type = "button",
        onClick,
        disabled = false,
        loading = false,
        fullWidth = false,
        className = "",
    } = props
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            aria-busy={loading}
            className={[
                "group inline-block rounded-full flex w-full",
                "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/50",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                fullWidth ? "w-full" : "",
                className,
            ].join(" ")}
        >
            <span
                className={[
                    "flex items-center justify-center",
                    "rounded-full bg-white px-8 py-3 text-sm font-medium text-gray-900",
                    "transition-colors group-hover:bg-transparent group-hover:text-white",
                    "w-full",
                ].join(" ")}
            >
                {loading && (
                    <svg
                        className="mr-2 h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                    </svg>
                )}
                {children}
            </span>
        </button>
    );
};

export default Button;
