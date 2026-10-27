import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import Input from "../components/Input";
import Button from "../components/Button";

function AdminEventTickets() {
    const { id } = useParams();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ type: "Regular", price: "", totalQuantity: "" });
    const [error, setError] = useState("");
    const [creating, setCreating] = useState(false);

    async function load() {
        setLoading(true);
        try {
            const res = await api.get(`/tickets/event/${id}`);
            setTickets(res.data.data);
        } catch (err) {
            setError("Failed to load tickets");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, [id]);

    function handleChange(field) {
        return (e) => setForm({ ...form, [field]: e.target.value });
    }

    async function handleCreate(e) {
        e.preventDefault();
        setCreating(true);
        setError("");
        try {
            await api.post("/tickets", {
                eventId: id,
                type: form.type,
                price: Number(form.price),
                totalQuantity: Number(form.totalQuantity)
            });
            setForm({ type: "Regular", price: "", totalQuantity: "" });
            load();
        } catch (err) {
            setError(err.response?.data?.message || "Create failed");
        } finally {
            setCreating(false);
        }
    }

    async function handleDelete(ticketId) {
        if (!window.confirm("Delete this ticket type?")) return;
        try {
            await api.delete(`/tickets/${ticketId}`);
            load();
        } catch (err) {
            alert(err.response?.data?.message || "Delete failed");
        }
    }

    if (loading) return <p style={{ textAlign: "center", marginTop: "80px", color: "#a3a3a3" }}>Loading...</p>;

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 20px" }}>
            <Link to="/admin/events" style={{ fontSize: "14px", color: "#a3a3a3" }}>← Back to Events</Link>
            <h1 style={{ fontSize: "32px", fontWeight: "800", margin: "16px 0 32px 0", letterSpacing: "-0.02em", color: "#f5f5f5" }}>
                Manage Tickets
            </h1>

            <div style={{
                background: "#1a1a1a",
                border: "1.5px solid #262626",
                borderRadius: "14px",
                padding: "28px",
                marginBottom: "32px"
            }}>
                <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", color: "#f5f5f5" }}>Add Ticket Type</h3>
                {error && (
                    <div style={{
                        background: "rgba(239, 68, 68, 0.1)",
                        color: "#f87171",
                        padding: "12px",
                        borderRadius: "8px",
                        marginBottom: "20px",
                        fontSize: "14px",
                        border: "1px solid rgba(239, 68, 68, 0.3)"
                    }}>
                        {error}
                    </div>
                )}
                <form onSubmit={handleCreate}>
                    <label style={{
                        display: "block",
                        marginBottom: "6px",
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#a3a3a3",
                        letterSpacing: "0.02em"
                    }}>
                        Type
                    </label>
                    <select
                        value={form.type}
                        onChange={handleChange("type")}
                        style={{
                            width: "100%",
                            padding: "12px 14px",
                            border: "1.5px solid #262626",
                            borderRadius: "8px",
                            fontSize: "14px",
                            marginBottom: "18px",
                            background: "#1a1a1a",
                            color: "#f5f5f5",
                            outline: "none"
                        }}
                    >
                        <option value="Regular">Regular</option>
                        <option value="VIP">VIP</option>
                        <option value="Premium">Premium</option>
                    </select>

                    <Input label="Price" type="number" value={form.price} onChange={handleChange("price")} />
                    <Input label="Total Quantity" type="number" value={form.totalQuantity} onChange={handleChange("totalQuantity")} />

                    <Button text={creating ? "Creating..." : "Add Ticket"} type="submit" disabled={creating} fullWidth />
                </form>
            </div>

            <h3 style={{ marginBottom: "20px", color: "#f5f5f5", fontSize: "18px" }}>Existing Tickets</h3>
            {tickets.length === 0 && <p style={{ color: "#a3a3a3" }}>No tickets yet.</p>}

            <ul style={{ padding: 0 }}>
                {tickets.map((t) => (
                    <li key={t._id} style={{
                        listStyle: "none",
                        background: "#1a1a1a",
                        border: "1.5px solid #262626",
                        borderRadius: "14px",
                        padding: "24px",
                        marginBottom: "16px"
                    }}>
                        <h4 style={{ margin: "0 0 8px 0", fontSize: "17px", color: "#f5f5f5" }}>
                            {t.type} — <span style={{ color: "#4ade80" }}>${t.price}</span>
                        </h4>
                        <p style={{ margin: "0 0 16px 0", fontSize: "14px", color: "#a3a3a3" }}>
                            Sold: {t.soldQuantity} / {t.totalQuantity}
                        </p>
                        <Button text="Delete" variant="danger" onClick={() => handleDelete(t._id)} />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AdminEventTickets;
