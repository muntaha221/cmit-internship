const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        room: { type: String, required: true, index: true },
        from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true, maxlength: 500 }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);