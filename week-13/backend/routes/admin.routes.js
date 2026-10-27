const express = require("express");
const User = require("../models/user.model");
const Event = require("../models/event.model");
const Ticket = require("../models/ticket.model");
const Booking = require("../models/booking.model");
const bookingService = require("../services/booking.service");
const authMiddleware = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const router = express.Router();

// All admin routes require auth + ADMIN role
router.use(authMiddleware, authorize("ADMIN"));

// Dashboard stats
router.get("/stats", async (req, res) => {
    try {
        const [users, events, tickets, bookings] = await Promise.all([
            User.countDocuments(),
            Event.countDocuments(),
            Ticket.countDocuments(),
            Booking.countDocuments()
        ]);

        res.json({
            success: true,
            data: { users, events, tickets, bookings }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// List users
router.get("/users", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await User.countDocuments();
        const users = await User.find()
            .select("-password")
            .skip(skip)
            .limit(limit);

        const totalPages = Math.ceil(total / limit);

        res.json({
            success: true,
            data: users,
            pagination: {
                page, limit, total, totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete user (with cascade: remove all their bookings)
router.delete("/users/:id", async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const deletedBookings = await bookingService.deleteBookingsByUser(userId);
        await User.findByIdAndDelete(userId);

        res.json({
            success: true,
            message: `User deleted. ${deletedBookings} booking(s) also removed.`,
            deletedBookings
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// All bookings
router.get("/bookings", async (req, res) => {
    try {
        const result = await bookingService.getAllBookings(req.query);
        res.json({
            success: true,
            data: result.data,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;