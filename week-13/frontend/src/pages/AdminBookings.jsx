import { useState, useEffect } from "react";
import api from "../api/axios";

function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function load() {
            try {
                const res = await api.get("/admin/bookings", { params: { limit: 100 } });
                setBookings(res.data.data);
            } catch (err) {
                setError("Failed to load bookings");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) return <p style={{ textAlign: "center", marginTop: "80px", color: "#a3a3a3" }}>Loading...</p>;
    if (error) return <p style={{ color: "#ef4444", textAlign: "center", marginTop: "80px" }}>{error}</p>;

    return (
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "48px 20px" }}>
            <h1 style={{ fontSize: "34px", fontWeight: "800", marginBottom: "32px", letterSpacing: "-0.02em" }}>
                All Bookings
            </h1>

            {bookings.length === 0 && <p style={{ color: "#a3a3a3" }}>No bookings yet.</p>}

            <ul style={{ padding: 0 }}>
                {bookings.map((b) => (
                    <li key={b._id} style={{
                        listStyle: "none",
                        background: "#1a1a1a",
                        border: "1.5px solid #262626",
                        borderRadius: "14px",
                        padding: "24px",
                        marginBottom: "16px"
                    }}>
                        <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "700", color: "#f5f5f5" }}>
                            {b.event?.title}
                        </h3>
                        <p style={{ margin: "0 0 6px 0", fontSize: "14px", color: "#a3a3a3" }}>
                            User: {b.user?.name} ({b.user?.email})
                        </p>
                        <p style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#d4d4d4" }}>
                            {b.ticket?.type} × {b.quantity} — <strong>${b.totalPrice}</strong>
                        </p>
                        <span style={{
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "700",
                            background: b.status === "CONFIRMED" ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                            color: b.status === "CONFIRMED" ? "#4ade80" : "#f87171"
                        }}>{b.status}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AdminBookings;
