// const express = require("express");
// const mongoose = require("mongoose");
// require("dotenv").config();

// const User = require("./models/user.model");

// const app = express();

// const PORT = process.env.PORT || 3000;

// app.use(express.json());

// app.get("/users/:id/info", async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }

//         res.json({
//             success: true,
//             info: user.getInfo()
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// });

// app.post("/users", async (req, res) => {
//     try {
//         const user = await User.create(req.body);

//         res.status(201).json({
//             success: true,
//             data: user
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// });

// mongoose
//     .connect(process.env.MONGODB_URI)
//     .then(() => {
//         console.log("MongoDB connected successfully");

//         app.listen(PORT, () => {
//             console.log(`Server running on port ${PORT}`);
//         });
//     })
//     .catch((error) => {
//         console.error("MongoDB connection failed:", error.message);
//     });

const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const userService = require("./services/user.service");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Express server is running"
    });
});

app.get("/users", async (req, res) => {
    try {
        const users = await userService.getAllUsers();

        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
app.get("/users/:id", async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.patch("/users/:id", async (req, res) => {
    try {
        const user = await userService.updateUser(
            req.params.id,
            req.body
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

app.patch("/users/:id", async (req, res) => {
    try {
        const user = await userService.updateUser(
            req.params.id,
            req.body
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});



app.post("/users", async (req, res) => {
    try {
        const user = await userService.createUser(req.body);

        res.status(201).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });