const express = require("express");
const userService = require("../services/user.service");
const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const router = express.Router();

// ============================================
// PUBLIC ROUTES
// ============================================

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
        res.status(400).json({ success: false, message: error.message });
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
        res.status(401).json({ success: false, message: error.message });
    }
});

// ============================================
// PROTECTED ROUTES
// ============================================

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
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get("/profile", authMiddleware, async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data: req.user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Upload/replace avatar
router.post(
    "/upload-avatar",
    authMiddleware,
    upload.single("avatar"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "No file uploaded"
                });
            }

            const result = await userService.updateAvatar(
                req.user.userId,
                req.file.path,
                req.file.filename
            );

            res.status(200).json({
                success: true,
                message: "Avatar uploaded successfully",
                data: {
                    url: result.avatar.url,
                    publicId: result.avatar.publicId
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
);

// ============================================
// POINT 4: Delete avatar
// ============================================
router.delete("/avatar", authMiddleware, async (req, res) => {
    try {
        await userService.deleteAvatar(req.user.userId);
        res.status(200).json({
            success: true,
            message: "Avatar deleted successfully"
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;