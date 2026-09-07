const express = require("express");

const taskService = require("../services/task.service");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const task = await taskService.createTask(req.body);

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: task
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});



router.get("/stats/status", async (req, res) => {
    try {
        const stats = await taskService.getTaskCountByStatus();

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
router.get("/with-courses", async (req, res) => {
    try {
        const tasks = await taskService.getTasksWithCourses();
        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get("/with-course-details", async (req, res) => {
    try {
        const tasks = await taskService.getTasksWithCourseUnwound();
        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get("/summary", async (req, res) => {
    try {
        const summary = await taskService.getTaskSummaryWithCourse();
        res.status(200).json({ success: true, data: summary });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// old
// router.get("/pending", async (req, res) => {
//     try {
//         const tasks = await taskService.getPendingTasks();

//         res.status(200).json({
//             success: true,
//             data: tasks
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// });



// router.get("/", async (req, res) => {
//     try {
//         const tasks = await taskService.getAllTasks();

//         res.status(200).json({
//             success: true,
//             data: tasks
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// });

module.exports = router;