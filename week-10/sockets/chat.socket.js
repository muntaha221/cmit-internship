const Message = require("../models/message.model");

module.exports = (io, socket) => {
    socket.on("join-room", async (room, callback) => {
        if (typeof room !== "string" || !room.trim()) {
            return callback?.({ success: false, message: "Invalid room" });
        }

        socket.join(room);

        try {
            const history = await Message.find({ room })
                .sort({ createdAt: -1 })
                .limit(50)
                .populate("from", "name");

            callback?.({ success: true, history: history.reverse() });
        } catch (error) {
            callback?.({ success: false, message: "Could not load history" });
        }
    });

    socket.on("leave-room", (room) => {
        if (typeof room === "string") socket.leave(room);
    });

    socket.on("chat-message", async (payload, callback) => {
        try {
            if (!payload || typeof payload.text !== "string") {
                return callback?.({ success: false, message: "Invalid payload" });
            }

            const room = typeof payload.room === "string" ? payload.room : "general";
            const text = payload.text.trim().slice(0, 500);

            if (!text) return callback?.({ success: false, message: "Empty message" });

            const saved = await Message.create({
                room,
                from: socket.userId,
                text
            });

            const message = {
                _id: saved._id,
                from: socket.userId,
                name: socket.userName,
                room,
                text,
                at: saved.createdAt
            };

            // Send to everyone in room except sender
            socket.to(room).emit("chat-message", message);
            // Confirm back to sender
            callback?.({ success: true, message });
        } catch (error) {
            console.error("chat-message error:", error.message);
            callback?.({ success: false, message: "Something went wrong" });
        }
    });
};