const express = require("express");

const courseService = require("../services/course.service");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const course = await courseService.createCourse(req.body);

        res.status(201).json({
            success: true,
            message: "Course created successfully",
            data: course
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const courses = await courseService.getAllCourses();

        res.status(200).json({
            success: true,
            data: courses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const course = await courseService.getCourseById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            data: course
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID"
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.patch("/:id", async (req, res) => {
    try {
        const course = await courseService.updateCourse(
            req.params.id,
            req.body
        );

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: course
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID"
            });
        }

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const course = await courseService.deleteCourse(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
            data: course
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID"
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;