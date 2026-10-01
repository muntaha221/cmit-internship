module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log(` Connected: ${socket.id} (user: ${socket.userId})`);

        require("./presence.socket")(io, socket);
        require("./chat.socket")(io, socket);
        require("./typing.socket")(io, socket);
    });
};