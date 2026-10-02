function Input({
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    error,
    name
}) {
    return (
        <div style={{ marginBottom: "15px" }}>
            {label && (
                <label
                    style={{
                        display: "block",
                        marginBottom: "5px",
                        fontSize: "14px",
                        fontWeight: "500"
                    }}
                >
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
                    padding: "10px",
                    border: `1px solid ${error ? "red" : "#ccc"}`,
                    borderRadius: "5px",
                    fontSize: "14px",
                    boxSizing: "border-box"
                }}
            />
            {error && (
                <small style={{ color: "red", fontSize: "12px" }}>{error}</small>
            )}
        </div>
    );
}

export default Input;