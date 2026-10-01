const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        token: { type: String, required: true },
        expiresAt: { type: Date, required: true }
    },
    { timestamps: true }
);

tokenSchema.index({ expiresAt: 1 });

module.exports = mongoose.model("Token", tokenSchema);