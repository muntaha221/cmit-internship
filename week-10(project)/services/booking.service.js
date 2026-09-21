const Booking = require("../models/booking.model");
const Event = require("../models/event.model");
const User = require("../models/user.model");
const emailService = require("./email.service");

// ============================================
// USER: create booking
// ============================================
async function createBooking(userId, eventId) {
    if (!eventId) throw new Error("Event ID is required");

    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");

    const existing = await Booking.findOne({ user: userId, event: eventId });
    if (existing) throw new Error("You have already requested a booking for this event");

    const acceptedCount = await Booking.countDocuments({
        event: eventId,
        status: "ACCEPTED"
    });
    if (acceptedCount >= event.capacity) {
        throw new Error("Event capacity has been reached");
    }

    const booking = await Booking.create({
        user: userId,
        event: eventId,
        status: "PENDING"
    });

    return booking;
}

// ============================================
// USER: get own bookings
// ============================================
async function getUserBookings(userId, queryParams) {
    let page = parseInt(queryParams.page) || 1;
    let limit = parseInt(queryParams.limit) || 10;

    const maxLimit = 100;
    if (limit > maxLimit) limit = maxLimit;
    if (page < 1) page = 1;
    if (limit < 1) limit = 1;

    const filter = { user: userId };
    if (queryParams.status) {
        filter.status = queryParams.status;
    }

    const skip = (page - 1) * limit;
    const total = await Booking.countDocuments(filter);

    const bookings = await Booking.find(filter)
        .populate("event", "title date location capacity")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalPages = Math.ceil(total / limit);

    return {
        data: bookings,
        pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
        }
    };
}

// ============================================
// USER: cancel own accepted booking
// ============================================
async function cancelBooking(bookingId, userId) {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new Error("Booking not found");

    if (booking.user.toString() !== userId.toString()) {
        throw new Error("You can only cancel your own bookings");
    }

    if (booking.status !== "ACCEPTED") {
        throw new Error("Only accepted bookings can be cancelled");
    }

    booking.status = "CANCELLED";
    await booking.save();

    return booking;
}

// ============================================
// ORGANIZER: get bookings for own event
// ============================================
async function getEventBookings(eventId, organizerId, queryParams) {
    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");

    if (event.organizer.toString() !== organizerId.toString()) {
        throw new Error("You can only view bookings for your own events");
    }

    let page = parseInt(queryParams.page) || 1;
    let limit = parseInt(queryParams.limit) || 10;

    const maxLimit = 100;
    if (limit > maxLimit) limit = maxLimit;
    if (page < 1) page = 1;
    if (limit < 1) limit = 1;

    const filter = { event: eventId };
    if (queryParams.status) {
        filter.status = queryParams.status;
    }

    const skip = (page - 1) * limit;
    const total = await Booking.countDocuments(filter);

    const bookings = await Booking.find(filter)
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalPages = Math.ceil(total / limit);

    return {
        data: bookings,
        pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
        }
    };
}

// ============================================
// ORGANIZER: accept/reject booking + email
// ============================================
async function updateBookingStatus(bookingId, organizerId, newStatus) {
    if (!["ACCEPTED", "REJECTED"].includes(newStatus)) {
        throw new Error("Status must be ACCEPTED or REJECTED");
    }

    const booking = await Booking.findById(bookingId)
        .populate("event")
        .populate("user", "name email");

    if (!booking) throw new Error("Booking not found");

    if (booking.event.organizer.toString() !== organizerId.toString()) {
        throw new Error("You can only manage bookings for your own events");
    }

    if (booking.status !== "PENDING") {
        throw new Error("Only pending bookings can be accepted or rejected");
    }

    // If accepting, check capacity first
    if (newStatus === "ACCEPTED") {
        const acceptedCount = await Booking.countDocuments({
            event: booking.event._id,
            status: "ACCEPTED"
        });
        if (acceptedCount >= booking.event.capacity) {
            throw new Error("Event capacity has been reached");
        }
    }

    booking.status = newStatus;
    await booking.save();

    // Send email (don't fail the request if email fails)
    try {
        await emailService.sendBookingStatusEmail(
            booking.user.email,
            booking.user.name,
            booking,
            booking.event,
            newStatus
        );
    } catch (error) {
        console.error("?????? Booking email failed:", error.message);
    }

    return booking;
}

module.exports = {
    createBooking,
    getUserBookings,
    cancelBooking,
    getEventBookings,
    updateBookingStatus
};