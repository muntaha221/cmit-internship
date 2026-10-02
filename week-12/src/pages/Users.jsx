import { useState, useEffect } from "react";
import api from "../api/axios";
import Button from "../components/Button";

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadUsers() {
        setLoading(true);
        setError("");
        try {
            const res = await api.get("/users");
            setUsers(res.data.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load users");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadUsers();
    }, []);

    if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading users...</p>;

    if (error) {
        return (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <p style={{ color: "red" }}>{error}</p>
                <Button text="Retry" onClick={loadUsers} />
            </div>
        );
    }

    if (users.length === 0) {
        return <p style={{ textAlign: "center", marginTop: "50px" }}>No users yet.</p>;
    }

    return (
        <div style={{ maxWidth: "600px", margin: "30px auto" }}>
            <h1>Users</h1>
            <ul style={{ padding: 0 }}>
                {users.map((user) => (
                    <li
                        key={user._id}
                        style={{
                            listStyle: "none",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "15px",
                            marginBottom: "10px"
                        }}
                    >
                        <h3 style={{ margin: 0 }}>{user.name}</h3>
                        <p style={{ margin: "5px 0", color: "#666" }}>{user.email}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Users;