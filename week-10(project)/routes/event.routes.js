const express = require("express");
const eventService = require("../services/event.service");
const authMiddleware = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const upload = require("../middleware/upload.middleware");
const router = express.Router();

// ============================================
// PUBLIC: list events (paginated + search + filter)
// ============================================
router.get("/", async (req, res) => {
    try {
        const result = await eventService.getAllEvents(req.query);
        res.status(200).json({
            success: true,
            message: "Events fetched successfully",
            data: result.data,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============================================
// PUBLIC: get single event
// ============================================
router.get("/:id", async (req, res) => {
    try {
        const event = await eventService.getEventById(req.params.id);
        res.status(200).json({
            success: true,
            message: "Event fetched successfully",
            data: event
        });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
});

// ============================================
// ORGANIZER ONLY: create event
// ============================================
router.post(
    "/",
    authMiddleware,
    authorize("ORGANIZER"),
    async (req, res) => {
        try {
            const event = await eventService.createEvent(req.user.userId, req.body);
            res.status(201).json({
                success: true,
                message: "Event created successfully",
                data: event
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
);

// ============================================
// ORGANIZER ONLY: update event
// ============================================
router.put(
    "/:id",
    authMiddleware,
    authorize("ORGANIZER"),
    async (req, res) => {
        try {
            const event = await eventService.updateEvent(req.params.id, req.user.userId, req.body);
            res.status(200).json({
                success: true,
                message: "Event updated successfully",
                data: event
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
);

// ============================================
// ORGANIZER ONLY: delete event
// ============================================
router.delete(
    "/:id",
    authMiddleware,
    authorize("ORGANIZER"),
    async (req, res) => {
        try {
            const result = await eventService.deleteEvent(req.params.id, req.user.userId);
            res.status(200).json({ success: true, message: result.message });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
);

// ============================================
// ORGANIZER ONLY: upload / replace event image
// ============================================
router.post(
    "/:id/image",
    authMiddleware,
    authorize("ORGANIZER"),
    upload.single("image"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ success: false, message: "No file uploaded" });
            }

            const event = await eventService.updateEventImage(
                req.params.id,
                req.user.userId,
                req.file.path,
                req.file.filename
            );

            res.status(200).json({
                success: true,
                message: "Event image uploaded successfully",
                data: {
                    url: event.image.url,
                    publicId: event.image.publicId
                }
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
);

module.exports = router;