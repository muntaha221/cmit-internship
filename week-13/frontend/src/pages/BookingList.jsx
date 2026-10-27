import { useState, useEffect } from "react";
import api from "../api/axios";
import Button from "../components/Button";

function BookingList() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function load() {
        setLoading(true);
        setError("");
        try {
            const res = await api.get("/bookings/my");
            setBookings(res.data.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load bookings");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    async function handleCancel(id) {
        if (!window.confirm("Cancel this booking?")) return;
        try {
            await api.post(`/bookings/${id}/cancel`);
            load();
        } catch (err) {
            alert(err.response?.data?.message || "Cancel failed");
        }
    }

    if (loading) return <p style={{ textAlign: "center", marginTop: "80px", color: "#a3a3a3" }}>Loading...</p>;
    if (error) return <p style={{ color: "#ef4444", textAlign: "center", marginTop: "80px" }}>{error}</p>;

    return (
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 20px" }}>
            <h1 style={{ fontSize: "34px", fontWeight: "800", marginBottom: "32px", letterSpacing: "-0.02em" }}>
                My Bookings
            </h1>

            {bookings.length === 0 && (
                <div style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    background: "#1a1a1a",
                    borderRadius: "14px",
                    border: "1.5px solid #262626"
                }}>
                    <p style={{ color: "#a3a3a3" }}>You have no bookings yet.</p>
                </div>
            )}

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
                        <p style={{ margin: "0 0 8px 0", color: "#a3a3a3", fontSize: "14px" }}>
                            {b.event?.date && new Date(b.event.date).toDateString()} · {b.event?.location}
                        </p>
                        <p style={{ margin: "0 0 14px 0", fontSize: "14px", color: "#d4d4d4" }}>
                            <strong>{b.ticket?.type}</strong> × {b.quantity} — <strong>${b.totalPrice}</strong>
                        </p>
                        <p style={{ margin: "0 0 16px 0" }}>
                            <span style={{
                                padding: "4px 12px",
                                borderRadius: "20px",
                                fontSize: "12px",
                                fontWeight: "700",
                                background: b.status === "CONFIRMED" ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                                color: b.status === "CONFIRMED" ? "#4ade80" : "#f87171"
                            }}>{b.status}</span>
                        </p>
                        {b.status === "CONFIRMED" && (
                            <Button text="Cancel Booking" variant="danger" onClick={() => handleCancel(b._id)} />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default BookingList;
