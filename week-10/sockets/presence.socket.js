const { userSockets, socketUser, onlineUsers } = require("../utils/socketState");

module.exports = (io, socket) => {
    const userId = socket.userId?.toString();
    const userName = socket.userName || "Unknown";

    if (userId) {
        // Add to maps
        if (!userSockets.has(userId)) userSockets.set(userId, []);
        userSockets.get(userId).push(socket.id);
        socketUser.set(socket.id, userId);
        onlineUsers.set(socket.id, { userId, name: userName });

        // Broadcast user-online
        io.emit("user-online", { userId, name: userName });
        io.emit("online-count", onlineUsers.size);
    }
    socket.on("disconnect", () => {
        if (!userId) return;
        // Remove this socket
        const remaining = (userSockets.get(userId) || []).filter(id => id !== socket.id);
        if (remaining.length === 0) {
            userSockets.delete(userId);
            io.emit("user-offline", { userId, name: userName });
        } else {
            userSockets.set(userId, remaining);
        }

        socketUser.delete(socket.id);
        onlineUsers.delete(socket.id);
        io.emit("online-count", onlineUsers.size);
    });
};