const express = require("express");
const bookingService = require("../services/booking.service");
const authMiddleware = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const router = express.Router();

// ============================================
// USER only: create booking request
// ============================================
router.post(
    "/",
    authMiddleware,
    authorize("USER"),
    async (req, res) => {
        try {
            const booking = await bookingService.createBooking(
                req.user.userId,
                req.body.eventId
            );
            res.status(201).json({
                success: true,
                message: "Booking request sent successfully",
                data: booking
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
);

// ============================================
// USER only: view own bookings
// ============================================
router.get(
    "/my",
    authMiddleware,
    authorize("USER"),
    async (req, res) => {
        try {
            const result = await bookingService.getUserBookings(req.user.userId, req.query);
            res.status(200).json({
                success: true,
                message: "Bookings fetched successfully",
                data: result.data,
                pagination: result.pagination
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
);

// ============================================
// USER only: cancel accepted booking
// ============================================
router.post(
    "/:id/cancel",
    authMiddleware,
    authorize("USER"),
    async (req, res) => {
        try {
            const booking = await bookingService.cancelBooking(req.params.id, req.user.userId);
            res.status(200).json({
                success: true,
                message: "Booking cancelled successfully",
                data: booking
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
);

// ============================================
// ORGANIZER only: view bookings for own event
// ============================================
router.get(
    "/event/:eventId",
    authMiddleware,
    authorize("ORGANIZER"),
    async (req, res) => {
        try {
            const result = await bookingService.getEventBookings(
                req.params.eventId,
                req.user.userId,
                req.query
            );
            res.status(200).json({
                success: true,
                message: "Event bookings fetched successfully",
                data: result.data,
                pagination: result.pagination
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
);

// ============================================
// ORGANIZER only: accept/reject booking
// ============================================
router.patch(
    "/:id/status",
    authMiddleware,
    authorize("ORGANIZER"),
    async (req, res) => {
        try {
            const booking = await bookingService.updateBookingStatus(
                req.params.id,
                req.user.userId,
                req.body.status
            );
            res.status(200).json({
                success: true,
                message: `Booking ${booking.status} successfully`,
                data: booking
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
);

module.exports = router;