import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Input from "../components/input";
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
        <div style={{ maxWidth: "400px", margin: "50px auto", padding: "30px", border: "1px solid #ddd", borderRadius: "10px" }}>
            <h1 style={{ textAlign: "center" }}>Register</h1>

            {serverError && <p style={{ color: "red", textAlign: "center" }}>{serverError}</p>}

            <form onSubmit={handleSubmit}>
                <Input
                    label="Name"
                    value={form.name}
                    onChange={handleChange("name")}
                    placeholder="Enter your name"
                    error={errors.name}
                />
                <Input
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    placeholder="Enter your email"
                    error={errors.email}
                />
                <Input
                    label="Password"
                    type="password"
                    value={form.password}
                    onChange={handleChange("password")}
                    placeholder="Enter your password"
                    error={errors.password}
                />
                <Button
                    text={loading ? "Creating account..." : "Register"}
                    type="submit"
                    disabled={loading}
                />
            </form>

            <p style={{ textAlign: "center", marginTop: "15px" }}>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}

export default Register;