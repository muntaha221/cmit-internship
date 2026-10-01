const typingTimeouts = new Map();   // socketId → timeout handle

module.exports = (io, socket) => {
    socket.on("typing", ({ room }) => {
        if (typeof room !== "string") return;
        socket.to(room).emit("user-typing", { socketId: socket.id, name: socket.userName });

        if (typingTimeouts.has(socket.id)) {
            clearTimeout(typingTimeouts.get(socket.id));
        }

        const t = setTimeout(() => {
            socket.to(room).emit("user-stopped-typing", { socketId: socket.id });
            typingTimeouts.delete(socket.id);
        }, 3000);

        typingTimeouts.set(socket.id, t);
    });

    socket.on("stop-typing", ({ room }) => {
        if (typeof room !== "string") return;
        if (typingTimeouts.has(socket.id)) {
            clearTimeout(typingTimeouts.get(socket.id));
            typingTimeouts.delete(socket.id);
        }
        socket.to(room).emit("user-stopped-typing", { socketId: socket.id });
    });

    socket.on("disconnect", () => {
        if (typingTimeouts.has(socket.id)) {
            clearTimeout(typingTimeouts.get(socket.id));
            typingTimeouts.delete(socket.id);
        }
    });
};