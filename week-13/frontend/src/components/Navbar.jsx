import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const isAdmin = user?.role === "ADMIN";

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    }

    const baseLink = {
        fontSize: "14px",
        fontWeight: "500",
        padding: "8px 12px",
        borderRadius: "8px",
        transition: "all 0.15s",
        color: "#a3a3a3"
    };

    const adminLink = {
        fontSize: "14px",
        fontWeight: "700",
        padding: "8px 14px",
        borderRadius: "8px",
        transition: "all 0.15s",
        color: "#4ade80",
        background: "rgba(34, 197, 94, 0.08)",
        border: "1.5px solid rgba(34, 197, 94, 0.25)"
    };

    const activeStyle = {
        background: "#22c55e",
        color: "#052e16",
        border: "1.5px solid #22c55e"
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav style={{
            background: "#111111",
            borderBottom: "1px solid #262626",
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap"
        }}>
            <Link to="/" style={{
                color: "#22c55e",
                fontSize: "20px",
                fontWeight: "800",
                letterSpacing: "-0.02em"
            }}>
                EventHub
            </Link>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                {!isAdmin && (
                    <Link
                        to="/"
                        style={isActive("/") ? { ...baseLink, ...activeStyle } : baseLink}
                    >
                        Events
                    </Link>
                )}

                {!token && (
                    <Link to="/login" style={isActive("/login") ? { ...baseLink, ...activeStyle } : baseLink}>
                        Login
                    </Link>
                )}
                {!token && (
                    <Link to="/register" style={isActive("/register") ? { ...baseLink, ...activeStyle } : baseLink}>
                        Register
                    </Link>
                )}

                {token && !isAdmin && (
                    <Link to="/bookings" style={isActive("/bookings") ? { ...baseLink, ...activeStyle } : baseLink}>
                        My Bookings
                    </Link>
                )}
                {token && !isAdmin && (
                    <Link to="/profile" style={isActive("/profile") ? { ...baseLink, ...activeStyle } : baseLink}>
                        Profile
                    </Link>
                )}

                {token && isAdmin && (
                    <div style={{
                        display: "flex",
                        gap: "10px",
                        padding: "4px 8px",
                        marginLeft: "8px",
                        borderLeft: "2px solid #262626",
                        paddingLeft: "16px"
                    }}>
                        <Link
                            to="/admin"
                            style={isActive("/admin") ? { ...adminLink, ...activeStyle } : adminLink}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/admin/events"
                            style={isActive("/admin/events") ? { ...adminLink, ...activeStyle } : adminLink}
                        >
                            Event Management
                        </Link>
                        <Link
                            to="/admin/bookings"
                            style={isActive("/admin/bookings") ? { ...adminLink, ...activeStyle } : adminLink}
                        >
                            Bookings
                        </Link>
                        <Link
                            to="/admin/users"
                            style={isActive("/admin/users") ? { ...adminLink, ...activeStyle } : adminLink}
                        >
                            Users
                        </Link>
                    </div>
                )}
            </div>

            {token && (
                <button
                    onClick={handleLogout}
                    style={{
                        marginLeft: "auto",
                        background: "transparent",
                        color: "#a3a3a3",
                        border: "1.5px solid #262626",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: "600",
                        transition: "all 0.15s"
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#1a1a1a";
                        e.currentTarget.style.color = "#4ade80";
                        e.currentTarget.style.borderColor = "#22c55e";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#a3a3a3";
                        e.currentTarget.style.borderColor = "#262626";
                    }}
                >
                    Logout
                </button>
            )}
        </nav>
    );
}

export default Navbar;
