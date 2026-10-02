import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import CreateUser from "./pages/CreateUser";
import EditUser from "./pages/EditUser";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem("token");

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <div>
            <nav
                style={{
                    padding: "10px 20px",
                    borderBottom: "1px solid #ddd",
                    display: "flex",
                    gap: "15px",
                    alignItems: "center"
                }}
            >
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
                {isLoggedIn && <Link to="/users">Users</Link>}
                {isLoggedIn && <Link to="/profile">Profile</Link>}
                {isLoggedIn && (
                    <button
                        onClick={handleLogout}
                        style={{ marginLeft: "auto", cursor: "pointer" }}
                    >
                        Logout
                    </button>
                )}
            </nav>

            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/users"
                    element={
                        <ProtectedRoute>
                            <Users />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/users/new"
                    element={
                        <ProtectedRoute>
                            <CreateUser />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/users/:id/edit"
                    element={
                        <ProtectedRoute>
                            <EditUser />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </div>
    );
}

export default App;