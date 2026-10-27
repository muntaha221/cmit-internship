import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Input from "../components/Input";
import Button from "../components/Button";

function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(field) {
        return (e) => setForm({ ...form, [field]: e.target.value });
    }

    function validate() {
        const errs = {};
        if (!form.name.trim()) errs.name = "Name is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!form.email.trim()) errs.email = "Email is required";
        else if (!emailRegex.test(form.email)) errs.email = "Invalid email format";
        if (!form.password) errs.password = "Password is required";
        else if (form.password.length < 6) errs.password = "Min 6 characters";
        return errs;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        setServerError("");
        if (Object.keys(errs).length > 0) return;

        setLoading(true);
        try {
            await api.post("/auth/register", form);
            navigate("/login");
        } catch (err) {
            setServerError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{
            maxWidth: "420px",
            margin: "60px auto",
            padding: "40px",
            background: "#1a1a1a",
            borderRadius: "16px",
            border: "1.5px solid #262626"
        }}>
            <h1 style={{
                textAlign: "center",
                fontSize: "28px",
                fontWeight: "800",
                marginBottom: "8px",
                letterSpacing: "-0.02em",
                color: "#f5f5f5"
            }}>
                Create account
            </h1>
            <p style={{ textAlign: "center", color: "#a3a3a3", fontSize: "14px", marginBottom: "30px" }}>
                Join EventHub to start booking tickets
            </p>

            {serverError && (
                <div style={{
                    background: "rgba(239, 68, 68, 0.1)",
                    color: "#f87171",
                    padding: "12px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    fontSize: "14px",
                    textAlign: "center",
                    border: "1px solid rgba(239, 68, 68, 0.3)"
                }}>
                    {serverError}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <Input label="Name" value={form.name} onChange={handleChange("name")} placeholder="Your name" error={errors.name} />
                <Input label="Email" type="email" value={form.email} onChange={handleChange("email")} placeholder="you@example.com" error={errors.email} />
                <Input label="Password" type="password" value={form.password} onChange={handleChange("password")} placeholder="Min 6 characters" error={errors.password} />
                <Button text={loading ? "Creating..." : "Register"} type="submit" disabled={loading} fullWidth />
            </form>

            <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#a3a3a3" }}>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}

export default Register;
