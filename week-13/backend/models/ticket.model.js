const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
    {
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true
        },
        type: {
            type: String,
            enum: ["Regular", "VIP", "Premium"],
            required: true
        },
        price: { type: Number, required: true, min: 0 },
        totalQuantity: { type: Number, required: true, min: 1 },
        soldQuantity: { type: Number, default: 0, min: 0 }
    },
    { timestamps: true }
);

ticketSchema.index({ event: 1 });

module.exports = mongoose.model("Ticket", ticketSchema);