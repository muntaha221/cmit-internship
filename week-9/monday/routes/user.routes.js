const express = require("express");
const userService = require("../services/user.service");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();

// ============================================
// PUBLIC ROUTES
// ============================================

// Register
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
// ⭐ NEW: PROTECTED ROUTE WITH PAGINATION
// ============================================
router.get("/", authMiddleware, async (req, res) => {
    try {
        // Get query parameters: ?page=2&limit=5
        const page = req.query.page;
        const limit = req.query.limit;
        
        const result = await userService.getAllUsers(page, limit);
        
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

// ============================================
// PROTECTED ROUTE — Get Profile
// ============================================
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