// Role-based access control middleware
// Usage: router.post("/events", authMiddleware, organizerOnly, createEvent)

function authorize(...allowedRoles) {
    return (req, res, next) => {
        // req.user is attached by authMiddleware
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Only ${allowedRoles.join(", ")} can perform this action.`
            });
        }

        next();
    };
}

module.exports = { authorize };