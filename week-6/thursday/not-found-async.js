const express = require("express");

const app = express();

const PORT = 3004;

app.use(express.json());

// async route
app.get("/users", async (req, res, next) => {
    try {
        const users = await getUsers();

        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: users
        });
    } catch (error) {
        next(error);
    }
});

// fake async function
function getUsers() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error("Failed to load users"));
        }, 500);
    });
}

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        data: null
    });
});

// centralized async/error handler
app.use((err, req, res, next) => {
    res.status(500).json({
        success: false,
        message: err.message || "Internal server error",
        data: null
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});