import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Input from "../components/Input";
import Button from "../components/Button";

function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(field) {
        return (e) => setForm({ ...form, [field]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await api.post("/auth/login", form);
            localStorage.setItem("token", res.data.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.data.user));

            if (res.data.data.user.role === "ADMIN") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{
            minHeight: "calc(100vh - 80px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
            background: "radial-gradient(circle at 50% 0%, rgba(34, 197, 94, 0.08) 0%, transparent 50%)"
        }}>
            <div style={{
                maxWidth: "420px",
                width: "100%",
                padding: "44px",
                background: "#1a1a1a",
                borderRadius: "20px",
                border: "1.5px solid #262626",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
                animation: "fadeInScale 0.5s ease both"
            }}>
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎫</div>
                    <h1 style={{
                        fontSize: "28px",
                        fontWeight: "800",
                        marginBottom: "8px",
                        letterSpacing: "-0.02em",
                        color: "#f5f5f5"
                    }}>
                        Welcome back
                    </h1>
                    <p style={{ color: "#a3a3a3", fontSize: "14px" }}>
                        Login to your EventHub account
                    </p>
                </div>

                {error && (
                    <div style={{
                        background: "rgba(239, 68, 68, 0.1)",
                        color: "#f87171",
                        padding: "12px",
                        borderRadius: "10px",
                        marginBottom: "24px",
                        fontSize: "14px",
                        textAlign: "center",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        animation: "fadeInUp 0.3s ease"
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <Input label="Email" type="email" value={form.email} onChange={handleChange("email")} placeholder="you@example.com" />
                    <Input label="Password" type="password" value={form.password} onChange={handleChange("password")} placeholder="••••••••" />
                    <Button text={loading ? "Logging in..." : "Login"} type="submit" disabled={loading} loading={loading} fullWidth size="lg" />
                </form>

                <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "#a3a3a3" }}>
                    No account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
