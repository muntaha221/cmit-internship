import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Input from "../components/Input";
import Button from "../components/Button";

function EventList() {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function load() {
        setLoading(true);
        setError("");
        try {
            const res = await api.get("/events", {
                params: { page, limit: 6, search, category }
            });
            setEvents(res.data.data);
            setPagination(res.data.pagination);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load events");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, [page, search, category]);

    return (
        <div className="container">
            <div style={{ marginBottom: "40px", animation: "fadeInUp 0.5s ease both" }}>
                <h1 style={{
                    fontSize: "clamp(28px, 5vw, 42px)",
                    fontWeight: "800",
                    marginBottom: "10px",
                    letterSpacing: "-0.03em",
                    background: "linear-gradient(135deg, #f5f5f5 0%, #a3a3a3 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                }}>
                    Upcoming Events
                </h1>
                <p style={{ color: "#a3a3a3", fontSize: "15px" }}>
                    Discover and book tickets for the best events near you.
                </p>
            </div>

            <div style={{
                display: "flex",
                gap: "12px",
                marginBottom: "40px",
                flexWrap: "wrap",
                animation: "fadeInUp 0.5s ease 0.1s both"
            }}>
                <div style={{ flex: "1 1 240px", minWidth: "200px" }}>
                    <Input
                        placeholder="Search events by title..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>
                <select
                    value={category}
                    onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                    style={{
                        padding: "12px 14px",
                        border: "1.5px solid #262626",
                        borderRadius: "10px",
                        fontSize: "14px",
                        height: "47px",
                        background: "#1a1a1a",
                        color: "#f5f5f5",
                        cursor: "pointer",
                        minWidth: "160px",
                        outline: "none",
                        transition: "all 0.2s"
                    }}
                >
                    <option value="">All categories</option>
                    <option value="Music">Music</option>
                    <option value="Tech">Tech</option>
                    <option value="Sports">Sports</option>
                    <option value="Art">Art</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            {loading && (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "24px"
                }}>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} style={{
                            background: "#1a1a1a",
                            borderRadius: "16px",
                            overflow: "hidden",
                            border: "1.5px solid #262626"
                        }}>
                            <div className="skeleton" style={{ height: "180px", borderRadius: 0 }} />
                            <div style={{ padding: "20px" }}>
                                <div className="skeleton" style={{ height: "14px", width: "40%", marginBottom: "12px" }} />
                                <div className="skeleton" style={{ height: "20px", width: "80%", marginBottom: "12px" }} />
                                <div className="skeleton" style={{ height: "14px", width: "60%" }} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {error && (
                <div style={{ textAlign: "center", padding: "60px 20px", animation: "fadeIn" }}>
                    <p style={{ color: "#f87171", marginBottom: "20px", fontSize: "15px" }}>{error}</p>
                    <Button text="Retry" onClick={load} />
                </div>
            )}

            {!loading && !error && events.length === 0 && (
                <div style={{
                    textAlign: "center",
                    padding: "80px 20px",
                    background: "#1a1a1a",
                    borderRadius: "16px",
                    border: "1.5px solid #262626",
                    animation: "fadeIn"
                }}>
                    <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎭</div>
                    <h3 style={{ fontSize: "20px", marginBottom: "8px", color: "#f5f5f5" }}>No events found</h3>
                    <p style={{ color: "#a3a3a3", fontSize: "14px" }}>Try adjusting your search or check back later.</p>
                </div>
            )}

            {!loading && !error && events.length > 0 && (
                <>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                        gap: "24px"
                    }}>
                        {events.map((event, idx) => (
                            <Link
                                key={event._id}
                                to={`/events/${event._id}`}
                                style={{
                                    textDecoration: "none",
                                    color: "inherit",
                                    animation: `fadeInUp 0.5s ease ${Math.min(idx * 0.08, 0.5)}s both`
                                }}
                            >
                                <div style={{
                                    background: "#1a1a1a",
                                    borderRadius: "16px",
                                    overflow: "hidden",
                                    border: "1.5px solid #262626",
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    position: "relative",
                                    opacity: event.isExpired ? 0.6 : 1
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translateY(-6px)";
                                        e.currentTarget.style.boxShadow = "0 20px 40px rgba(34, 197, 94, 0.15)";
                                        e.currentTarget.style.borderColor = "#22c55e";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "none";
                                        e.currentTarget.style.borderColor = "#262626";
                                    }}
                                >
                                    {event.image?.url ? (
                                        <div style={{ overflow: "hidden", height: "200px" }}>
                                            <img
                                                src={event.image.url}
                                                alt={event.title}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                    transition: "transform 0.5s ease"
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.08)"}
                                                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                                            />
                                        </div>
                                    ) : (
                                        <div style={{
                                            width: "100%",
                                            height: "200px",
                                            background: "linear-gradient(135deg, #166534 0%, #14532d 50%, #22c55e 100%)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "#f5f5f5",
                                            fontSize: "64px",
                                            fontWeight: "800",
                                            position: "relative",
                                            overflow: "hidden"
                                        }}>
                                            <div style={{
                                                position: "absolute",
                                                inset: 0,
                                                background: "radial-gradient(circle at 30% 40%, rgba(74, 222, 128, 0.3) 0%, transparent 60%)"
                                            }} />
                                            <span style={{ position: "relative" }}>
                                                {event.title?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                    <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                                        <span style={{
                                            display: "inline-block",
                                            alignSelf: "flex-start",
                                            background: "rgba(34, 197, 94, 0.15)",
                                            color: "#4ade80",
                                            padding: "4px 12px",
                                            borderRadius: "20px",
                                            fontSize: "11px",
                                            fontWeight: "700",
                                            marginBottom: "12px",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.05em",
                                            border: "1px solid rgba(34, 197, 94, 0.2)"
                                        }}>
                                            {event.category}
                                        </span>
                                        {event.isExpired && (
                                            <span style={{
                                                display: "inline-block",
                                                alignSelf: "flex-start",
                                                background: "rgba(239, 68, 68, 0.15)",
                                                color: "#f87171",
                                                padding: "4px 12px",
                                                borderRadius: "20px",
                                                fontSize: "11px",
                                                fontWeight: "700",
                                                marginBottom: "8px",
                                                marginLeft: "6px",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.05em",
                                                border: "1px solid rgba(239, 68, 68, 0.3)"
                                            }}>
                                                Expired
                                            </span>
                                        )}
                                        <h3 style={{
                                            margin: "0 0 12px 0",
                                            fontSize: "18px",
                                            fontWeight: "700",
                                            lineHeight: "1.3",
                                            color: "#f5f5f5"
                                        }}>
                                            {event.title}
                                        </h3>
                                        <div style={{ marginTop: "auto" }}>
                                            <p style={{ margin: "0 0 6px 0", color: "#a3a3a3", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
                                                📅 {new Date(event.date).toDateString()}
                                            </p>
                                            <p style={{ margin: 0, color: "#a3a3a3", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
                                                📍 {event.location}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {pagination && (
                        <div style={{
                            display: "flex",
                            gap: "16px",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "48px",
                            flexWrap: "wrap",
                            animation: "fadeIn 0.5s ease both"
                        }}>
                            <Button
                                text="← Prev"
                                variant="secondary"
                                onClick={() => setPage(p => p - 1)}
                                disabled={!pagination.hasPrev}
                            />
                            <span style={{ color: "#a3a3a3", fontSize: "14px", fontWeight: "500" }}>
                                Page {pagination.page} of {pagination.totalPages}
                            </span>
                            <Button
                                text="Next →"
                                variant="secondary"
                                onClick={() => setPage(p => p + 1)}
                                disabled={!pagination.hasNext}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default EventList;
