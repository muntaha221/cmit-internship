const express = require("express");
const userService = require("../services/user.service");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();

// ============================================
// PUBLIC ROUTES
// ============================================

// Register (sends welcome email)
router.post("/register", async (req, res) => {
    try {
        const user = await userService.registerUser(req.body);
        res.status(201).json({
            success: true,
            message: "User registered successfully. Welcome email sent!",
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

// Login
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

// ============================================
// POINT 3: PASSWORD RESET ROUTES
// ============================================

// Request password reset (send email)
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const result = await userService.requestPasswordReset(email);
        
        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Reset password (using token)
router.post("/reset-password", async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const result = await userService.resetPassword(token, newPassword);
        
        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// ============================================
// PROTECTED ROUTES
// ============================================

// Get all users (protected)
router.get("/", authMiddleware, async (req, res) => {
    try {
        const result = await userService.getAllUsers(req.query);
        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: result.data,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get profile (protected)
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data: req.user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;