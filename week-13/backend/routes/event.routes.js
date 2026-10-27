const express = require("express");
const eventService = require("../services/event.service");
const authMiddleware = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const upload = require("../middleware/upload.middleware");
const router = express.Router();

// Public: browse events
router.get("/", async (req, res) => {
    try {
        const result = await eventService.getAllEvents(req.query);
        res.json({
            success: true,
            data: result.data,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Public: single event
router.get("/:id", async (req, res) => {
    try {
        const event = await eventService.getEventById(req.params.id);
        res.json({ success: true, data: event });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
});

// Admin: create
router.post("/", authMiddleware, authorize("ADMIN"), async (req, res) => {
    try {
        const event = await eventService.createEvent(req.user.userId, req.body);
        res.status(201).json({ success: true, message: "Event created", data: event });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Admin: update
router.put("/:id", authMiddleware, authorize("ADMIN"), async (req, res) => {
    try {
        const event = await eventService.updateEvent(req.params.id, req.body);
        res.json({ success: true, message: "Event updated", data: event });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Admin: delete
router.delete("/:id", authMiddleware, authorize("ADMIN"), async (req, res) => {
    try {
        const result = await eventService.deleteEvent(req.params.id);
        res.json({ success: true, message: result.message });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Admin: upload image
router.post(
    "/:id/image",
    authMiddleware,
    authorize("ADMIN"),
    upload.single("image"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ success: false, message: "No file uploaded" });
            }
            const event = await eventService.updateEventImage(
                req.params.id,
                req.file.buffer
            );
            res.json({
                success: true,
                message: "Image uploaded",
                data: event.image
            });
        } catch (error) {
            console.error("Image upload error:", error.message);
            res.status(400).json({ success: false, message: error.message });
        }
    }
);

module.exports = router;