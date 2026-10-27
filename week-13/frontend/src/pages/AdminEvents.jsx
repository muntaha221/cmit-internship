import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Button from "../components/Button";

function AdminEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    async function load() {
        setLoading(true);
        try {
            const res = await api.get("/events", { params: { limit: 100 } });
            setEvents(res.data.data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    async function handleDelete(id) {
        if (!window.confirm("Delete this event? All its bookings and tickets will also be permanently removed.")) return;
        try {
            const res = await api.delete(`/events/${id}`);
            setEvents((currentEvents) => currentEvents.filter((event) => event._id !== id));
            alert(res.data.message || "Event deleted");
            await load();
        } catch (err) {
            alert(err.response?.data?.message || "Delete failed");
        }
    }

    if (loading) return <p style={{ textAlign: "center", marginTop: "80px", color: "#a3a3a3" }}>Loading...</p>;

    return (
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "48px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
                <h1 style={{ fontSize: "34px", fontWeight: "800", letterSpacing: "-0.02em" }}>
                    Manage Events
                </h1>
                <Link to="/admin/events/new"><Button text="+ New Event" size="lg" /></Link>
            </div>

            {events.length === 0 && (
                <p style={{ color: "#a3a3a3", textAlign: "center", padding: "40px" }}>
                    No events yet.
                </p>
            )}

            <ul style={{ padding: 0 }}>
                {events.map((e) => (
                    <li key={e._id} style={{
                        listStyle: "none",
                        background: "#1a1a1a",
                        border: "1.5px solid #262626",
                        borderRadius: "14px",
                        padding: "24px",
                        marginBottom: "16px",
                        transition: "border-color 0.15s"
                    }}>
                        <h3 style={{ margin: "0 0 8px 0", fontSize: "20px", fontWeight: "700", color: "#f5f5f5" }}>
                            {e.title}
                        </h3>
                        <p style={{ margin: "0 0 16px 0", color: "#a3a3a3", fontSize: "14px" }}>
                            {new Date(e.date).toDateString()} · {e.location} · {e.category}
                        </p>
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            <Link to={`/admin/events/${e._id}/edit`}><Button text="Edit" variant="secondary" /></Link>
                            <Link to={`/admin/events/${e._id}/tickets`}><Button text="Tickets" variant="secondary" /></Link>
                            <Button text="Delete" variant="danger" onClick={() => handleDelete(e._id)} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AdminEvents;
