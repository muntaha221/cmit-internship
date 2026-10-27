import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Button from "../components/Button";
import Input from "../components/Input";

function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [bookingError, setBookingError] = useState("");
    const [booking, setBooking] = useState(false);

    const user = JSON.parse(localStorage.getItem("user") || "null");

    useEffect(() => {
        async function load() {
            try {
                const [eventRes, ticketRes] = await Promise.all([
                    api.get(`/events/${id}`),
                    api.get(`/tickets/event/${id}`)
                ]);
                setEvent(eventRes.data.data);
                setTickets(ticketRes.data.data);
            } catch (err) {
                setError("Failed to load event");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    async function handleBook() {
        if (!user) { navigate("/login"); return; }
        if (!selectedTicket) { setBookingError("Please select a ticket type"); return; }

        setBooking(true);
        setBookingError("");

        try {
            await api.post("/bookings", {
                eventId: id,
                ticketId: selectedTicket._id,
                quantity: parseInt(quantity)
            });
            navigate("/bookings");
        } catch (err) {
            setBookingError(err.response?.data?.message || "Booking failed");
        } finally {
            setBooking(false);
        }
    }

    if (loading) return <p style={{ textAlign: "center", marginTop: "80px", color: "#a3a3a3" }}>Loading...</p>;
    if (error) return <p style={{ color: "#ef4444", textAlign: "center", marginTop: "80px" }}>{error}</p>;
    if (!event) return <p style={{ textAlign: "center", marginTop: "80px" }}>Event not found.</p>;

    return (
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 20px" }}>
            <button
                onClick={() => navigate(-1)}
                style={{
                    background: "none",
                    border: "none",
                    color: "#a3a3a3",
                    marginBottom: "24px",
                    fontSize: "14px",
                    padding: 0,
                    fontWeight: "500"
                }}
            >
                ← Back
            </button>

            <div style={{ borderRadius: "16px", overflow: "hidden", marginBottom: "32px" }}>
                {event.image?.url ? (
                    <img
                        src={event.image.url}
                        alt={event.title}
                        style={{ width: "100%", maxHeight: "440px", objectFit: "cover" }}
                    />
                ) : (
                    <div style={{
                        width: "100%",
                        height: "clamp(200px, 30vw, 340px)",
                        background: "linear-gradient(135deg, #166534 0%, #14532d 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#4ade80",
                        fontSize: "clamp(60px, 10vw, 100px)",
                        fontWeight: "800"
                    }}>
                        {event.title?.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>

            <span style={{
                display: "inline-block",
                background: "rgba(34, 197, 94, 0.15)",
                color: "#4ade80",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "700",
                marginBottom: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.05em"
            }}>
                {event.category}
            </span>

            <h1 style={{
                fontSize: "clamp(26px, 4vw, 38px)",
                fontWeight: "800",
                margin: "0 0 16px 0",
                letterSpacing: "-0.02em",
                color: "#f5f5f5"
            }}>
                {event.title}
            </h1>

            {event.isExpired && (
                <div style={{
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1.5px solid rgba(239, 68, 68, 0.3)",
                    color: "#f87171",
                    padding: "16px 20px",
                    borderRadius: "12px",
                    marginBottom: "24px",
                    fontSize: "15px",
                    fontWeight: "600"
                }}>
                    ⚠️ This event has passed and is no longer available for booking.
                </div>
            )}

            <div style={{
                display: "flex",
                gap: "24px",
                color: "#a3a3a3",
                fontSize: "15px",
                marginBottom: "32px",
                flexWrap: "wrap"
            }}>
                <span>📅 {new Date(event.date).toDateString()}</span>
                <span>📍 {event.location}</span>
            </div>

            <p style={{
                fontSize: "16px",
                lineHeight: "1.75",
                color: "#d4d4d4",
                marginBottom: "48px"
            }}>
                {event.description}
            </p>

            {event.isExpired ? (
                <p style={{ color: "#a3a3a3", fontSize: "15px" }}>
                    Booking is closed for this event.
                </p>
            ) : (
                <>
                    <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "20px", color: "#f5f5f5" }}>
                        Select Tickets
                    </h2>

                    {tickets.length === 0 && (
                        <p style={{ color: "#a3a3a3" }}>No tickets available for this event yet.</p>
                    )}

                    {tickets.length > 0 && (
                        <>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: "16px",
                        marginBottom: "32px"
                    }}>
                        {tickets.map((t) => {
                            const available = t.totalQuantity - t.soldQuantity;
                            const soldOut = available <= 0;
                            const selected = selectedTicket?._id === t._id;

                            return (
                                <div
                                    key={t._id}
                                    onClick={() => !soldOut && setSelectedTicket(t)}
                                    style={{
                                        background: "#1a1a1a",
                                        border: selected ? "2px solid #22c55e" : "1.5px solid #262626",
                                        padding: "20px",
                                        borderRadius: "12px",
                                        cursor: soldOut ? "not-allowed" : "pointer",
                                        opacity: soldOut ? 0.5 : 1,
                                        transition: "all 0.15s",
                                        boxShadow: selected ? "0 4px 16px rgba(34, 197, 94, 0.2)" : "none"
                                    }}
                                >
                                    <h3 style={{ margin: "0 0 8px 0", fontSize: "17px", fontWeight: "700", color: "#f5f5f5" }}>
                                        {t.type}
                                    </h3>
                                    <p style={{
                                        margin: "0 0 10px 0",
                                        fontSize: "26px",
                                        fontWeight: "800",
                                        color: "#4ade80",
                                        letterSpacing: "-0.02em"
                                    }}>
                                        ${t.price}
                                    </p>
                                    <p style={{ margin: 0, fontSize: "13px", color: "#a3a3a3", fontWeight: "500" }}>
                                        {soldOut ? "Sold out" : `${available} available`}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {user?.role !== "ADMIN" && (
                        <div style={{
                            background: "#1a1a1a",
                            border: "1.5px solid #262626",
                            padding: "28px",
                            borderRadius: "14px",
                            maxWidth: "420px"
                        }}>
                            <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", color: "#f5f5f5" }}>Book Tickets</h3>
                            <Input
                                label="Quantity"
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                            {bookingError && (
                                <p style={{ color: "#f87171", marginBottom: "16px", fontSize: "14px" }}>
                                    {bookingError}
                                </p>
                            )}
                            <Button
                                text={booking ? "Booking..." : "Confirm Booking"}
                                onClick={handleBook}
                                disabled={booking || !selectedTicket}
                                fullWidth
                            />
                        </div>
                    )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default EventDetails;
