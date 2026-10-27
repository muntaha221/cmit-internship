const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const eventRoutes = require("./routes/event.routes");
const ticketRoutes = require("./routes/ticket.routes");
const bookingRoutes = require("./routes/booking.routes");
const adminRoutes = require("./routes/admin.routes");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ success: true, message: "Event & Ticket Booking API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

// 404
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

// Error handler
app.use(errorMiddleware);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
});