function errorHandler(err, req, res, next) {
    // Mongoose validation error (missing required field, bad enum value, etc.)
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: messages
        });
    }

    // Duplicate key error (unique field already exists)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json({
            success: false,
            message: `${field} already exists`,
            field
        });
    }

    // Invalid ObjectId format (e.g. /tasks/abc123)
    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: `Invalid ${err.path}: ${err.value}`
        });
    }

    // Anything else — unexpected server error
    console.error(err);
    return res.status(500).json({
        success: false,
        message: "Something went wrong"
    });
}

module.exports = errorHandler;