import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function AnimatedNumber({ value, color }) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        const duration = 800;
        const steps = 30;
        const increment = value / steps;
        let current = 0;
        const interval = setInterval(() => {
            current += increment;
            if (current >= value) {
                setDisplay(value);
                clearInterval(interval);
            } else {
                setDisplay(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(interval);
    }, [value]);

    return (
        <h2 style={{
            margin: 0,
            fontSize: "clamp(40px, 6vw, 56px)",
            fontWeight: "800",
            color,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            textShadow: `0 0 30px ${color}55`
        }}>
            {display}
        </h2>
    );
}

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const res = await api.get("/admin/stats");
                setStats(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) return <p style={{ textAlign: "center", marginTop: "80px", color: "#a3a3a3" }}>Loading...</p>;

    const cards = [
        { label: "Users", value: stats?.users ?? 0, color: "#60a5fa", to: "/admin/users", icon: "👥" },
        { label: "Events", value: stats?.events ?? 0, color: "#22c55e", to: "/admin/events", icon: "🎭" },
        { label: "Tickets", value: stats?.tickets ?? 0, color: "#fbbf24", to: "/admin/events", icon: "🎫" },
        { label: "Bookings", value: stats?.bookings ?? 0, color: "#a78bfa", to: "/admin/bookings", icon: "📊" }
    ];

    return (
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 20px" }}>
            <div style={{ animation: "fadeInUp 0.5s ease both" }}>
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
                    Overview
                </h1>
                <p style={{ color: "#a3a3a3", fontSize: "15px", marginBottom: "48px" }}>
                    Welcome back. Here's what's happening on EventHub today.
                </p>
            </div>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "24px"
            }}>
                {cards.map((c, idx) => (
                    <Link key={c.label} to={c.to} style={{
                        textDecoration: "none",
                        color: "inherit",
                        animation: `fadeInUp 0.5s ease ${idx * 0.1}s both`
                    }}>
                        <div style={{
                            background: "#1a1a1a",
                            border: "1.5px solid #262626",
                            borderRadius: "20px",
                            padding: "36px 24px",
                            textAlign: "center",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            cursor: "pointer",
                            height: "100%",
                            position: "relative",
                            overflow: "hidden"
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = c.color;
                                e.currentTarget.style.transform = "translateY(-6px)";
                                e.currentTarget.style.boxShadow = `0 20px 40px ${c.color}33`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "#262626";
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            <div style={{
                                position: "absolute",
                                top: "-30px",
                                right: "-30px",
                                fontSize: "120px",
                                opacity: 0.04,
                                pointerEvents: "none"
                            }}>
                                {c.icon}
                            </div>
                            <div style={{ fontSize: "32px", marginBottom: "12px" }}>{c.icon}</div>
                            <AnimatedNumber value={c.value} color={c.color} />
                            <p style={{
                                margin: "14px 0 0 0",
                                color: "#a3a3a3",
                                fontSize: "13px",
                                fontWeight: "700",
                                textTransform: "uppercase",
                                letterSpacing: "0.08em"
                            }}>
                                {c.label}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default AdminDashboard;
