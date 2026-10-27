import { useState, useEffect } from "react";
import api from "../api/axios";
import Button from "../components/Button";

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function load() {
        setLoading(true);
        try {
            const res = await api.get("/admin/users", { params: { limit: 100 } });
            setUsers(res.data.data);
        } catch (err) {
            setError("Failed to load users");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    async function handleDelete(id) {
        if (!window.confirm("Delete this user? All their bookings will also be removed.")) return;
        try {
            const res = await api.delete(`/admin/users/${id}`);
            setUsers((currentUsers) => currentUsers.filter((user) => user._id !== id));
            alert(res.data.message || "User deleted");
            await load();
        } catch (err) {
            alert(err.response?.data?.message || "Delete failed");
        }
    }

    if (loading) return <p style={{ textAlign: "center", marginTop: "80px", color: "#a3a3a3" }}>Loading...</p>;
    if (error) return <p style={{ color: "#ef4444", textAlign: "center", marginTop: "80px" }}>{error}</p>;

    return (
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 20px" }}>
            <h1 style={{ fontSize: "34px", fontWeight: "800", marginBottom: "32px", letterSpacing: "-0.02em" }}>
                Users
            </h1>

            {users.length === 0 && <p style={{ color: "#a3a3a3" }}>No users yet.</p>}

            <ul style={{ padding: 0 }}>
                {users.map((u) => (
                    <li key={u._id} style={{
                        listStyle: "none",
                        background: "#1a1a1a",
                        border: "1.5px solid #262626",
                        borderRadius: "14px",
                        padding: "24px",
                        marginBottom: "16px"
                    }}>
                        <h3 style={{ margin: "0 0 6px 0", fontSize: "18px", fontWeight: "700", color: "#f5f5f5" }}>
                            {u.name}
                        </h3>
                        <p style={{ margin: "0 0 12px 0", color: "#a3a3a3", fontSize: "14px" }}>{u.email}</p>
                        <p style={{ margin: "0 0 16px 0", fontSize: "13px" }}>
                            <span style={{
                                padding: "4px 12px",
                                borderRadius: "20px",
                                fontSize: "12px",
                                fontWeight: "700",
                                background: u.role === "ADMIN" ? "rgba(251, 146, 60, 0.15)" : "rgba(34, 197, 94, 0.15)",
                                color: u.role === "ADMIN" ? "#fb923c" : "#4ade80"
                            }}>{u.role}</span>
                        </p>
                        <Button text="Delete" variant="danger" onClick={() => handleDelete(u._id)} />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AdminUsers;
