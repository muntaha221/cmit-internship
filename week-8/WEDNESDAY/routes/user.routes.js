const express = require("express");
const userService = require("../services/user.service");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();

// ============================================
// PUBLIC ROUTES (No auth required)
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
// POINT 4: PROTECTED ROUTES (require authMiddleware)
// ============================================

// Get current user profile
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        // req.user comes from middleware
        // Only returns the authenticated user's data
        res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data: {
                userId: req.user.userId,
                name: req.user.name,
                email: req.user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Update user profile (Protected)
router.put("/profile", authMiddleware, async (req, res) => {
    try {
        const { name, email } = req.body;
        
        // Only the authenticated user can update their own profile
        // Use req.user.userId to update the correct user
        const updatedUser = await userService.updateUser(req.user.userId, { name, email });
        
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                userId: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Delete user account (Protected)
router.delete("/profile", authMiddleware, async (req, res) => {
    try {
        // Only the authenticated user can delete their own account
        await userService.deleteUser(req.user.userId);
        
        res.status(200).json({
            success: true,
            message: "Account deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Get all users (Protected - Admin only example)
router.get("/all", authMiddleware, async (req, res) => {
    try {
        // This demonstrates you can add role-based access
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

module.exports = router;