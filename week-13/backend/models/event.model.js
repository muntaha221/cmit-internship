const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        category: {
            type: String,
            enum: ["Music", "Tech", "Sports", "Art", "Other"],
            default: "Other"
        },
        image: {
            url: { type: String, default: null },
            publicId: { type: String, default: null }
        },
        date: { type: Date, required: true },
        location: { type: String, required: true, trim: true },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

eventSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Event", eventSchema);