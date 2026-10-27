function Button({ text, onClick, type = "button", disabled = false, variant = "primary", fullWidth = false, size = "md", loading = false }) {
    const sizes = {
        sm: { padding: "8px 14px", fontSize: "13px" },
        md: { padding: "11px 22px", fontSize: "14px" },
        lg: { padding: "14px 32px", fontSize: "16px" }
    };

    const base = {
        border: "none",
        borderRadius: "10px",
        fontWeight: "600",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        width: fullWidth ? "100%" : "auto",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        letterSpacing: "0.01em",
        position: "relative",
        overflow: "hidden",
        ...sizes[size]
    };

    const variants = {
        primary: {
            background: disabled ? "#166534" : "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
            color: disabled ? "#71717a" : "#052e16",
            boxShadow: disabled ? "none" : "0 4px 16px rgba(34, 197, 94, 0.25)"
        },
        danger: {
            background: disabled ? "#7f1d1d" : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            color: disabled ? "#71717a" : "#ffffff",
            boxShadow: disabled ? "none" : "0 4px 16px rgba(239, 68, 68, 0.25)"
        },
        secondary: {
            background: "transparent",
            color: "#4ade80",
            border: "1.5px solid #262626"
        },
        ghost: {
            background: "transparent",
            color: "#a3a3a3"
        }
    };

    const isDisabled = disabled || loading;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            style={{ ...base, ...variants[variant], cursor: isDisabled ? "not-allowed" : "pointer" }}
            onMouseEnter={(e) => {
                if (isDisabled) return;
                e.currentTarget.style.transform = "translateY(-2px)";
                if (variant === "primary") {
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(34, 197, 94, 0.4)";
                }
                if (variant === "secondary") {
                    e.currentTarget.style.borderColor = "#22c55e";
                    e.currentTarget.style.background = "rgba(34, 197, 94, 0.08)";
                }
                if (variant === "danger") {
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(239, 68, 68, 0.4)";
                }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                if (variant === "primary") {
                    e.currentTarget.style.boxShadow = variants.primary.boxShadow;
                }
                if (variant === "secondary") {
                    e.currentTarget.style.borderColor = "#262626";
                    e.currentTarget.style.background = "transparent";
                }
                if (variant === "danger") {
                    e.currentTarget.style.boxShadow = variants.danger.boxShadow;
                }
            }}
            onMouseDown={(e) => {
                if (isDisabled) return;
                e.currentTarget.style.transform = "translateY(0) scale(0.98)";
            }}
            onMouseUp={(e) => {
                if (isDisabled) return;
                e.currentTarget.style.transform = "translateY(-2px) scale(1)";
            }}
        >
            {loading && (
                <span style={{
                    width: "14px",
                    height: "14px",
                    border: "2px solid currentColor",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 0.6s linear infinite",
                    display: "inline-block"
                }} />
            )}
            {text}
        </button>
    );
}

export default Button;
