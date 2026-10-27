const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true
        },
        ticket: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ticket",
            required: true
        },
        quantity: { type: Number, required: true, min: 1 },
        totalPrice: { type: Number, required: true, min: 0 },
        status: {
            type: String,
            enum: ["CONFIRMED", "CANCELLED"],
            default: "CONFIRMED"
        }
    },
    { timestamps: true }
);

bookingSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Booking", bookingSchema);