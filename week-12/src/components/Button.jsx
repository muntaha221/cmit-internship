function Button({ text, onClick, type = "button", disabled = false }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            style={{
                padding: "10px 20px",
                background: disabled ? "#ccc" : "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: disabled ? "not-allowed" : "pointer",
                fontSize: "14px"
            }}
        >
            {text}
        </button>
    );
}

export default Button;