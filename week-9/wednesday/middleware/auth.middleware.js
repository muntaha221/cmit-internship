const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "No token provided. Please login first."
            });
        }

        const tokenParts = authHeader.split(" ");

        if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
            return res.status(401).json({
                success: false,
                message: "Invalid token format. Use: Bearer <token>"
            });
        }

        const token = tokenParts[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            name: decoded.name
        };

        next();

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token expired. Please login again.",
                errorType: "TOKEN_EXPIRED"
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid token. Please login again.",
                errorType: "TOKEN_INVALID"
            });
        }

        return res.status(401).json({
            success: false,
            message: "Authentication failed. Please login again."
        });
    }
};

module.exports = authMiddleware;