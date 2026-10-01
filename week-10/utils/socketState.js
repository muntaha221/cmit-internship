// Shared state across all socket modules
// Maps live at module level so all connections see the same data

const userSockets = new Map();   // userId → [socketId, ...]
const socketUser = new Map();    // socketId → userId
const onlineUsers = new Map();   // socketId → { userId, name }

module.exports = { userSockets, socketUser, onlineUsers };