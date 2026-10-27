import { useState, useEffect } from "react";
import api from "../api/axios";

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function load() {
            try {
                const res = await api.get("/auth/profile");
                setUser(res.data.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load profile");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) return <p style={{ textAlign: "center", marginTop: "80px", color: "#a3a3a3" }}>Loading...</p>;
    if (error) return <p style={{ color: "#ef4444", textAlign: "center", marginTop: "80px" }}>{error}</p>;
    if (!user) return <p style={{ textAlign: "center", marginTop: "80px" }}>No user data.</p>;

    return (
        <div style={{ maxWidth: "600px", margin: "60px auto", padding: "40px", background: "#1a1a1a", borderRadius: "16px", border: "1.5px solid #262626" }}>
            <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "32px", color: "#f5f5f5" }}>
                My Profile
            </h1>

            <div style={{ textAlign: "center", marginBottom: "32px" }}>
                <div style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    margin: "0 auto 16px",
                    background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "48px",
                    fontWeight: "800",
                    color: "#052e16",
                    border: "4px solid #262626"
                }}>
                    {user.name?.charAt(0).toUpperCase()}
                </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "12px", color: "#737373", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                    Name
                </label>
                <p style={{ margin: 0, fontSize: "16px", color: "#f5f5f5" }}>{user.name}</p>
            </div>

            <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "12px", color: "#737373", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                    Email
                </label>
                <p style={{ margin: 0, fontSize: "16px", color: "#f5f5f5" }}>{user.email}</p>
            </div>

            <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "12px", color: "#737373", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                    User ID
                </label>
                <p style={{ margin: 0, fontSize: "14px", color: "#a3a3a3", fontFamily: "monospace" }}>{user.userId}</p>
            </div>

            <div>
                <label style={{ display: "block", fontSize: "12px", color: "#737373", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                    Role
                </label>
                <span style={{
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "700",
                    background: user.role === "ADMIN" ? "rgba(251, 146, 60, 0.15)" : "rgba(34, 197, 94, 0.15)",
                    color: user.role === "ADMIN" ? "#fb923c" : "#4ade80"
                }}>
                    {user.role}
                </span>
            </div>
        </div>
    );
}

export default Profile;
