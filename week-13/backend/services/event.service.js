const Event = require("../models/event.model");
const bookingService = require("./booking.service");
const ticketService = require("./ticket.service");

function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function createEvent(adminId, data) {
    const { title, description, category, date, location } = data;

    if (!title) throw new Error("Title is required");
    if (!description) throw new Error("Description is required");
    if (!date) throw new Error("Date is required");
    if (!location) throw new Error("Location is required");

    return await Event.create({
        title,
        description,
        category: category || "Other",
        date: new Date(date),
        location,
        createdBy: adminId
    });
}

async function getAllEvents(queryParams) {
    let page = parseInt(queryParams.page) || 1;
    let limit = parseInt(queryParams.limit) || 10;
    const maxLimit = 100;
    if (limit > maxLimit) limit = maxLimit;
    if (page < 1) page = 1;
    if (limit < 1) limit = 1;

    const filter = {};

    if (queryParams.category) filter.category = queryParams.category;

    if (queryParams.search) {
        const safe = escapeRegex(queryParams.search);
        filter.title = { $regex: safe, $options: "i" };
    }

    // date range filter
    if (queryParams.dateFrom || queryParams.dateTo) {
        filter.date = {};
        if (queryParams.dateFrom) filter.date.$gte = new Date(queryParams.dateFrom);
        if (queryParams.dateTo) filter.date.$lte = new Date(queryParams.dateTo);
    }

    const sort = queryParams.sort ? { [queryParams.sort]: 1 } : { date: 1 };
    const skip = (page - 1) * limit;

    const total = await Event.countDocuments(filter);
    const events = await Event.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("createdBy", "name email");
    const eventsWithStatus = events.map((e) => ({
        ...e.toObject(),
        isExpired: new Date(e.date) < new Date()
    }));

    const totalPages = Math.ceil(total / limit);

    return {
        data: eventsWithStatus,
        pagination: {
            page, limit, total, totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
        }
    };
}

async function getEventById(eventId) {
    const event = await Event.findById(eventId).populate("createdBy", "name email");
    if (!event) throw new Error("Event not found");
    const eventObj = event.toObject();
    eventObj.isExpired = new Date(event.date) < new Date();
    return eventObj;
}

async function updateEvent(eventId, data) {
    const { title, description, category, date, location } = data;

    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (category) updates.category = category;
    if (date) updates.date = new Date(date);
    if (location) updates.location = location;

    const event = await Event.findByIdAndUpdate(eventId, updates, {
        new: true,
        runValidators: false
    });

    if (!event) throw new Error("Event not found");
    return event;
}

async function deleteEvent(eventId) {
    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");

    const deletedBookings = await bookingService.deleteBookingsByEvent(eventId);
    const deletedTickets = await ticketService.deleteTicketsByEvent(eventId);

    await Event.findByIdAndDelete(eventId);
    return {
        message: `Event deleted. ${deletedBookings} booking(s) and ${deletedTickets} ticket type(s) also removed.`,
        deletedBookings,
        deletedTickets
    };
}

async function updateEventImage(eventId, fileBuffer) {
    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");

    if (!process.env.IMGBB_API_KEY || process.env.IMGBB_API_KEY === "PLACEHOLDER") {
        throw new Error("IMGBB_API_KEY is not configured in .env");
    }

    const formData = new FormData();
    formData.append("key", process.env.IMGBB_API_KEY);
    formData.append("image", fileBuffer.toString("base64"));

    const response = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: formData
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(result.error?.message || "ImgBB upload failed");
    }

    event.image = {
        url: result.data.url,
        publicId: result.data.id
    };

    await event.save();
    return event;
}

module.exports = {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    updateEventImage
};