import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Input from "../components/input";
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
            navigate("/users");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto", padding: "30px", border: "1px solid #ddd", borderRadius: "10px" }}>
            <h1 style={{ textAlign: "center" }}>Login</h1>

            {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <Input
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    placeholder="Enter your email"
                />
                <Input
                    label="Password"
                    type="password"
                    value={form.password}
                    onChange={handleChange("password")}
                    placeholder="Enter your password"
                />
                <Button
                    text={loading ? "Logging in..." : "Login"}
                    type="submit"
                    disabled={loading}
                />
            </form>

            <p style={{ textAlign: "center", marginTop: "15px" }}>
                No account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
}

export default Login;