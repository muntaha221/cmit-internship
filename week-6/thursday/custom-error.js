const express = require("express");

const app = express();

const PORT = 3002;

app.use(express.json());

// create our own error type
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

// test route
app.get("/users/:id", (req, res, next) => {
    const id = Number(req.params.id);

    if (id !== 1) {
        return next(new AppError("User not found", 404));
    }

    res.json({
        success: true,
        message: "User found",
        data: {
            id: 1,
            name: "Ali"
        }
    });
});

// error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message,
        data: null
    });
});

app.listen(PORT, () => {
    console.log(`Custom error server running at http://localhost:${PORT}`);
});