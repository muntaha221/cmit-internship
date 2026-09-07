const express = require("express");

const app = express();

const PORT = 3005;

app.use(express.json());

let users = [
    {
        id: 1,
        name: "Ali",
        email: "ali@example.com"
    }
];

// successful GET
app.get("/users", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: users
    });
});

// successful CREATE
app.post("/users", (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            success: false,
            message: "Name and email are required",
            data: null
        });
    }

    const newUser = {
        id: users.length + 1,
        name,
        email
    };

    users.push(newUser);

    res.status(201).json({
        success: true,
        message: "User created successfully",
        data: newUser
    });
});

// get one user
app.get("/users/:id", (req, res) => {
    const id = Number(req.params.id);

    const user = users.find((user) => user.id === id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
            data: null
        });
    }

    res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: user
    });
});

// force a server error for practice
app.get("/error", (req, res) => {
    res.status(500).json({
        success: false,
        message: "Internal server error",
        data: null
    });
});

// 404 for unknown routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        data: null
    });
});

app.listen(PORT, () => {
    console.log(`Status code server running at http://localhost:${PORT}`);
});