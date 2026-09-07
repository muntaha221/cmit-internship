const express = require("express");
const userService = require("../services/user.service");
const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const user = await userService.registerUser(req.body);

        // IMPORTANT: Never return the password hash
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;