const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    try {
        // POINT 1: Read token from Authorization header
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

        // POINT 2: Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ============================================
        // POINT 3: ATTACH USER TO REQUEST
        // ============================================
        // Now we attach the user data to the request object.
        // This makes it available to ALL route handlers 
        // that come after this middleware.
        //
        // decoded contains:
        // { userId, email, name, iat, exp }
        // ============================================
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            name: decoded.name
        };

        // ============================================
        // POINT 4: Proceed to route handler
        // ============================================
        // next() passes control to the next middleware
        // or route handler
        // ============================================
        next();

    } catch (error) {
        // POINT 5: Handle errors
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token expired. Please login again."
            });
        }
        
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid token. Please login again."
            });
        }
        
        return res.status(401).json({
            success: false,
            message: "Authentication failed. Please login again."
        });
    }
};

module.exports = authMiddleware;