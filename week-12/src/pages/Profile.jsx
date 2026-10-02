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

    if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading profile...</p>;
    if (error) return <p style={{ color: "red", textAlign: "center", marginTop: "50px" }}>{error}</p>;
    if (!user) return <p style={{ textAlign: "center", marginTop: "50px" }}>No user data.</p>;

    return (
        <div style={{ maxWidth: "500px", margin: "50px auto", padding: "30px", border: "1px solid #ddd", borderRadius: "10px" }}>
            <h1>My Profile</h1>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>User ID:</strong> {user.userId}</p>
        </div>
    );
}

export default Profile;