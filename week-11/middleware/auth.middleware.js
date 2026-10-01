const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ success: false, message: "No token" });

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = { userId: decoded.userId, email: decoded.email, name: decoded.name };
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};