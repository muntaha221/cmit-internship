import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EventList from "./pages/EventList";
import EventDetails from "./pages/EventDetails";
import BookingList from "./pages/BookingList";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminEvents from "./pages/AdminEvents";
import AdminEventForm from "./pages/AdminEventForm";
import AdminEventTickets from "./pages/AdminEventTickets";
import AdminBookings from "./pages/AdminBookings";
import AdminUsers from "./pages/AdminUsers";

function App() {
    return (
        <div>
            <Navbar />
            <Routes>
                <Route path="/" element={<EventList />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/bookings" element={
                    <ProtectedRoute role="USER"><BookingList /></ProtectedRoute>
                } />
                <Route path="/profile" element={
                    <ProtectedRoute><Profile /></ProtectedRoute>
                } />

                <Route path="/admin" element={
                    <ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>
                } />
                <Route path="/admin/events" element={
                    <ProtectedRoute role="ADMIN"><AdminEvents /></ProtectedRoute>
                } />
                <Route path="/admin/events/new" element={
                    <ProtectedRoute role="ADMIN"><AdminEventForm /></ProtectedRoute>
                } />
                <Route path="/admin/events/:id/edit" element={
                    <ProtectedRoute role="ADMIN"><AdminEventForm /></ProtectedRoute>
                } />
                <Route path="/admin/events/:id/tickets" element={
                    <ProtectedRoute role="ADMIN"><AdminEventTickets /></ProtectedRoute>
                } />
                <Route path="/admin/bookings" element={
                    <ProtectedRoute role="ADMIN"><AdminBookings /></ProtectedRoute>
                } />
                <Route path="/admin/users" element={
                    <ProtectedRoute role="ADMIN"><AdminUsers /></ProtectedRoute>
                } />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
}

export default App;