const Booking = require("../models/booking.model");
const Event = require("../models/event.model");
const Ticket = require("../models/ticket.model");
const User = require("../models/user.model");
const emailService = require("./email.service");

// ============================================
// Create booking with ATOMIC overbooking prevention
// ============================================
async function createBooking(userId, data) {
    const { eventId, ticketId, quantity } = data;

    if (!eventId) throw new Error("Event ID is required");
    if (!ticketId) throw new Error("Ticket ID is required");
    if (!quantity || quantity < 1) throw new Error("Quantity must be at least 1");

    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");
    if (new Date(event.date) < new Date()) {
        throw new Error("This event has already passed and can no longer be booked");
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new Error("Ticket not found");
    if (ticket.event.toString() !== eventId.toString()) {
        throw new Error("Ticket does not belong to this event");
    }

    // ============================================
    // ATOMIC check + update
    // Two users buying simultaneously cannot oversell
    // ============================================
    const updatedTicket = await Ticket.findOneAndUpdate(
        {
            _id: ticketId,
            $expr: {
                $lte: [
                    { $add: ["$soldQuantity", quantity] },
                    "$totalQuantity"
                ]
            }
        },
        { $inc: { soldQuantity: quantity } },
        { new: true }
    );

    if (!updatedTicket) {
        throw new Error("Not enough tickets available");
    }

    const totalPrice = updatedTicket.price * quantity;

    const booking = await Booking.create({
        user: userId,
        event: eventId,
        ticket: ticketId,
        quantity,
        totalPrice,
        status: "CONFIRMED"
    });

    // Fire-and-forget confirmation email
    const user = await User.findById(userId);
    emailService.sendBookingConfirmationEmail(user, booking, event, updatedTicket);

    return booking;
}

// ============================================
// User's own bookings
// ============================================
async function getUserBookings(userId, queryParams) {
    let page = parseInt(queryParams.page) || 1;
    let limit = parseInt(queryParams.limit) || 10;
    const maxLimit = 100;
    if (limit > maxLimit) limit = maxLimit;
    if (page < 1) page = 1;
    if (limit < 1) limit = 1;

    const filter = { user: userId };
    if (queryParams.status) filter.status = queryParams.status;

    const skip = (page - 1) * limit;
    const total = await Booking.countDocuments(filter);

    const bookings = await Booking.find(filter)
        .populate("event", "title date location image")
        .populate("ticket", "type price")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalPages = Math.ceil(total / limit);

    return {
        data: bookings,
        pagination: {
            page, limit, total, totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
        }
    };
}

// ============================================
// Cancel booking (restore ticket quantity)
// ============================================
async function cancelBooking(bookingId, userId) {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new Error("Booking not found");

    if (booking.user.toString() !== userId.toString()) {
        throw new Error("You can only cancel your own bookings");
    }

    if (booking.status !== "CONFIRMED") {
        throw new Error("Only confirmed bookings can be cancelled");
    }

    // Restore ticket quantity
    await Ticket.findByIdAndUpdate(booking.ticket, {
        $inc: { soldQuantity: -booking.quantity }
    });

    booking.status = "CANCELLED";
    await booking.save();

    return booking;
}

// ============================================
// Admin: all bookings
// ============================================
async function getAllBookings(queryParams) {
    let page = parseInt(queryParams.page) || 1;
    let limit = parseInt(queryParams.limit) || 10;
    const maxLimit = 100;
    if (limit > maxLimit) limit = maxLimit;
    if (page < 1) page = 1;
    if (limit < 1) limit = 1;

    const filter = {};
    if (queryParams.status) filter.status = queryParams.status;

    const skip = (page - 1) * limit;
    const total = await Booking.countDocuments(filter);

    const bookings = await Booking.find(filter)
        .populate("user", "name email")
        .populate("event", "title date location")
        .populate("ticket", "type price")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalPages = Math.ceil(total / limit);

    return {
        data: bookings,
        pagination: {
            page, limit, total, totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
        }
    };
}

async function deleteBookingsByUser(userId) {
    const result = await Booking.deleteMany({ user: userId });
    return result.deletedCount;
}

async function deleteBookingsByEvent(eventId) {
    const result = await Booking.deleteMany({ event: eventId });
    return result.deletedCount;
}

module.exports = {
    createBooking,
    getUserBookings,
    cancelBooking,
    getAllBookings,
    deleteBookingsByUser,
    deleteBookingsByEvent
};