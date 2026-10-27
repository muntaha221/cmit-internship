const express = require("express");
const userService = require("../services/user.service");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const user = await userService.registerUser(req.body);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: { _id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const result = await userService.loginUser(req.body);
        res.status(200).json({ success: true, message: "Login successful", data: result });
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
});

router.get("/profile", authMiddleware, (req, res) => {
    res.json({ success: true, data: req.user });
});

module.exports = router;