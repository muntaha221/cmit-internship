const express = require("express");
const userService = require("../services/user.service");
const router = express.Router();

// ============================================
// REGISTER ROUTE (same as before)
// ============================================
router.post("/register", async (req, res) => {
    try {
        const user = await userService.registerUser(req.body);
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

// ============================================
// NEW: LOGIN ROUTE
// ============================================
router.post("/login", async (req, res) => {
    try {
        const result = await userService.loginUser(req.body);
        
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: result.user,
                token: result.token
            }
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;