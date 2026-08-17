const express = require("express");

const router = express.Router();

// get one user
router.get("/:id", (req, res) => {
    res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: {
            id: req.params.id
        }
    });
});

// get users with query
router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: {
            role: req.query.role || null
        }
    });
});

// create user
router.post("/", (req, res) => {
    res.status(201).json({
        success: true,
        message: "User created successfully",
        data: req.body
    });
});

module.exports = router;