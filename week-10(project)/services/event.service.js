const Event = require("../models/event.model");
const cloudinary = require("../config/cloudinary");

// ============================================
// Create event (organizer only)
// ============================================
async function createEvent(organizerId, data) {
    const { title, description, date, location, capacity } = data;

    if (!title) throw new Error("Title is required");
    if (!description) throw new Error("Description is required");
    if (!date) throw new Error("Date is required");
    if (!location) throw new Error("Location is required");
    if (!capacity) throw new Error("Capacity is required");
    if (capacity < 1) throw new Error("Capacity must be at least 1");

    const event = await Event.create({
        title,
        description,
        date: new Date(date),
        location,
        capacity,
        organizer: organizerId
    });

    return event;
}

// ============================================
// Helpers (reused pattern from user service)
// ============================================
function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildEventFilter(queryParams) {
    const filter = {};

    // Search by title
    if (queryParams.search) {
        const safeSearch = escapeRegex(queryParams.search);
        filter.title = { $regex: safeSearch, $options: "i" };
    }

    // Filter by date range
    if (queryParams.date_gte || queryParams.date_lte) {
        filter.date = {};
        if (queryParams.date_gte) filter.date.$gte = new Date(queryParams.date_gte);
        if (queryParams.date_lte) filter.date.$lte = new Date(queryParams.date_lte);
    }

    // Filter by organizer
    if (queryParams.organizer) {
        filter.organizer = queryParams.organizer;
    }

    return filter;
}

// ============================================
// Get all events with pagination + search + filter
// ============================================
async function getAllEvents(queryParams) {
    let page = parseInt(queryParams.page) || 1;
    let limit = parseInt(queryParams.limit) || 10;

    const maxLimit = 100;
    if (limit > maxLimit) limit = maxLimit;
    if (page < 1) page = 1;
    if (limit < 1) limit = 1;

    const filter = buildEventFilter(queryParams);
    const skip = (page - 1) * limit;

    const total = await Event.countDocuments(filter);
    const events = await Event.find(filter)
        .populate("organizer", "name email")
        .sort({ date: 1 })
        .skip(skip)
        .limit(limit);

    const totalPages = Math.ceil(total / limit);

    return {
        data: events,
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
// Get single event by id
// ============================================
async function getEventById(eventId) {
    const event = await Event.findById(eventId).populate("organizer", "name email");
    if (!event) throw new Error("Event not found");
    return event;
}

// ============================================
// Update event (only its organizer)
// ============================================
async function updateEvent(eventId, organizerId, data) {
    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");

    if (event.organizer.toString() !== organizerId.toString()) {
        throw new Error("You can only update your own events");
    }

    const { title, description, date, location, capacity } = data;

    if (title) event.title = title;
    if (description) event.description = description;
    if (date) event.date = new Date(date);
    if (location) event.location = location;
    if (capacity) event.capacity = capacity;

    await event.save();
    return event;
}

// ============================================
// Delete event (only its organizer)
// ============================================
async function deleteEvent(eventId, organizerId) {
    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");

    if (event.organizer.toString() !== organizerId.toString()) {
        throw new Error("You can only delete your own events");
    }

    // Delete event image from Cloudinary if exists
    if (event.image && event.image.publicId) {
        try {
            await cloudinary.uploader.destroy(event.image.publicId);
        } catch (error) {
            console.error("?????? Failed to delete event image:", error.message);
        }
    }

    await Event.findByIdAndDelete(eventId);
    return { message: "Event deleted successfully" };
}

// ============================================
// Upload / replace event image
// ============================================
async function updateEventImage(eventId, organizerId, url, publicId) {
    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");

    if (event.organizer.toString() !== organizerId.toString()) {
        throw new Error("You can only update your own events");
    }

    // Delete old image from Cloudinary
    if (event.image && event.image.publicId) {
        try {
            await cloudinary.uploader.destroy(event.image.publicId);
        } catch (error) {
            console.error("?????? Failed to delete old image:", error.message);
        }
    }

    event.image = { url, publicId };
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