const express = require("express");
const userService = require("../services/user.service");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();

// PUBLIC ROUTES

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
                accessToken: result.accessToken,
                refreshToken: result.refreshToken
            }
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        });
    }
});

router.post("/refresh", async (req, res) => {
    try {
        const { refreshToken } = req.body;

        const result = await userService.refreshAccessToken(refreshToken);

        res.status(200).json({
            success: true,
            message: "Access token refreshed successfully",
            data: {
                accessToken: result.accessToken,
                refreshToken: result.refreshToken
            }
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message || "Invalid or expired refresh token"
        });
    }
});

// PROTECTED ROUTES

router.get("/profile", authMiddleware, async (req, res) => {
    try {
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

router.put("/profile", authMiddleware, async (req, res) => {
    try {
        const { name, email } = req.body;
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

router.delete("/profile", authMiddleware, async (req, res) => {
    try {
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

router.get("/all", authMiddleware, async (req, res) => {
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

// ============================================
// POINT 5: Logout — invalidates the stored refresh token
// ============================================
router.post("/logout", authMiddleware, async (req, res) => {
    try {
        await userService.logoutUser(req.user.userId);
        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;