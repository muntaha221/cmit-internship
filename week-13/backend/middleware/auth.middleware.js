const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({ success: false, message: "Invalid token format" });
        }

        const decoded = jwt.verify(parts[1], process.env.JWT_SECRET);
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role
        };
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};