const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const socketAuthMiddleware = require("./middleware/socket-auth.middleware");

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
    pingTimeout: 20000,
    pingInterval: 25000
});

// Attach auth middleware to every socket handshake
io.use(socketAuthMiddleware);

// Express
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({ success: true, message: "Week 10 - Socket.IO Chat API" });
});

// Mount all socket handlers
require("./sockets")(io);

// Connect DB then start server
connectDB().then(() => {
    httpServer.listen(process.env.PORT || 3000, () => {
        console.log(`Ok bro!  Server running on port ${process.env.PORT || 3000}`);
    });
});