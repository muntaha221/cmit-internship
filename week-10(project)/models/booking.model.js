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
        status: {
            type: String,
            enum: ["PENDING", "ACCEPTED", "REJECTED", "CANCELLED"],
            default: "PENDING"
        }
    },
    { timestamps: true }
);

// Prevent duplicate bookings at DB level too
bookingSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model("Booking", bookingSchema);