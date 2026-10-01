const jwt = require("jsonwebtoken");

const socketAuthMiddleware = (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error("No token provided"));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        socket.userId = decoded.userId;
        socket.userName = decoded.name;
        socket.userRole = decoded.role;

        next();
    } catch (error) {
        next(new Error("Invalid or expired token"));
    }
};

module.exports = socketAuthMiddleware;