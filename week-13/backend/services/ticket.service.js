const Ticket = require("../models/ticket.model");
const Event = require("../models/event.model");

async function createTicket(adminId, data) {
    const { eventId, type, price, totalQuantity } = data;

    if (!eventId) throw new Error("Event ID is required");
    if (!type) throw new Error("Ticket type is required");
    if (price === undefined || price < 0) throw new Error("Valid price required");
    if (!totalQuantity || totalQuantity < 1) throw new Error("Quantity must be at least 1");

    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");

    return await Ticket.create({
        event: eventId,
        type,
        price,
        totalQuantity
    });
}

async function getTicketsByEvent(eventId) {
    return await Ticket.find({ event: eventId });
}

async function updateTicket(ticketId, data) {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new Error("Ticket not found");

    const { type, price, totalQuantity } = data;
    if (type) ticket.type = type;
    if (price !== undefined) ticket.price = price;
    if (totalQuantity !== undefined) {
        if (totalQuantity < ticket.soldQuantity) {
            throw new Error("Cannot reduce quantity below sold amount");
        }
        ticket.totalQuantity = totalQuantity;
    }

    await ticket.save();
    return ticket;
}

async function deleteTicket(ticketId) {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new Error("Ticket not found");

    if (ticket.soldQuantity > 0) {
        throw new Error("Cannot delete ticket with existing bookings");
    }

    await Ticket.findByIdAndDelete(ticketId);
    return { message: "Ticket deleted successfully" };
}

async function deleteTicketsByEvent(eventId) {
    const result = await Ticket.deleteMany({ event: eventId });
    return result.deletedCount;
}

module.exports = {
    createTicket,
    getTicketsByEvent,
    updateTicket,
    deleteTicket,
    deleteTicketsByEvent
};