const express = require("express");

const app = express();

const PORT = 3003;

app.use(express.json());

// custom error
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

// route
app.get("/users/:id", (req, res, next) => {
    const id = Number(req.params.id);

    if (id !== 1) {
        return next(new AppError("User not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "User found",
        data: {
            id: 1,
            name: "Ali"
        }
    });
});

// centralized error middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal server error",
        data: null
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});