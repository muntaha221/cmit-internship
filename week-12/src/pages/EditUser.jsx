import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Input from "../components/input";
import Button from "../components/Button";

function EditUser() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function load() {
            try {
                const res = await api.get(`/users/${id}`);
                setForm({ name: res.data.data.name, email: res.data.data.email });
            } catch (err) {
                setError("Failed to load user");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    function handleChange(field) {
        return (e) => setForm({ ...form, [field]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            await api.put(`/users/${id}`, form);
            navigate("/users");
        } catch (err) {
            setError(err.response?.data?.message || "Update failed");
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto", padding: "30px", border: "1px solid #ddd", borderRadius: "10px" }}>
            <h1 style={{ textAlign: "center" }}>Edit User</h1>

            {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <Input
                    label="Name"
                    value={form.name}
                    onChange={handleChange("name")}
                />
                <Input
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={handleChange("email")}
                />
                <Button
                    text={saving ? "Saving..." : "Save Changes"}
                    type="submit"
                    disabled={saving}
                />
            </form>
        </div>
    );
}

export default EditUser;