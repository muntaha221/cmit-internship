const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const userRoutes = require("./routes/user.routes");
const eventRoutes = require("./routes/event.routes");
const bookingRoutes = require("./routes/booking.routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Event Booking System API"
    });
});

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("??? MongoDB connected successfully");
        app.listen(PORT, () => {
            console.log(`???? Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("??? MongoDB connection failed:", error.message);
    });