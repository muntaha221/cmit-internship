function Input({ label, type = "text", value, onChange, placeholder, error, name }) {
    return (
        <div style={{ marginBottom: "18px" }}>
            {label && (
                <label style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#a3a3a3",
                    letterSpacing: "0.02em"
                }}>
                    {label}
                </label>
            )}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: `1.5px solid ${error ? "#ef4444" : "#262626"}`,
                    borderRadius: "10px",
                    fontSize: "14px",
                    background: "#1a1a1a",
                    color: "#f5f5f5",
                    outline: "none",
                    transition: "all 0.2s ease"
                }}
                onFocus={(e) => {
                    if (!error) {
                        e.currentTarget.style.borderColor = "#22c55e";
                        e.currentTarget.style.boxShadow = "0 0 0 4px rgba(34, 197, 94, 0.1)";
                        e.currentTarget.style.background = "#1f1f1f";
                    }
                }}
                onBlur={(e) => {
                    if (!error) {
                        e.currentTarget.style.borderColor = "#262626";
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.background = "#1a1a1a";
                    }
                }}
            />
            {error && (
                <small style={{
                    color: "#ef4444",
                    fontSize: "12px",
                    marginTop: "6px",
                    display: "block",
                    fontWeight: "500",
                    animation: "fadeInUp 0.3s ease"
                }}>
                    {error}
                </small>
            )}
        </div>
    );
}

export default Input;
