const express = require("express");
const bookingService = require("../services/booking.service");
const authMiddleware = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const router = express.Router();

// User: create booking
router.post("/", authMiddleware, authorize("USER"), async (req, res) => {
    try {
        const booking = await bookingService.createBooking(req.user.userId, req.body);
        res.status(201).json({
            success: true,
            message: "Booking confirmed",
            data: booking
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// User: my bookings
router.get("/my", authMiddleware, authorize("USER"), async (req, res) => {
    try {
        const result = await bookingService.getUserBookings(req.user.userId, req.query);
        res.json({
            success: true,
            data: result.data,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// User: cancel booking
router.post("/:id/cancel", authMiddleware, authorize("USER"), async (req, res) => {
    try {
        const booking = await bookingService.cancelBooking(req.params.id, req.user.userId);
        res.json({
            success: true,
            message: "Booking cancelled",
            data: booking
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;