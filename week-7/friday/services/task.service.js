const Task = require("../models/task.model");

async function createTask(data) {
    return await Task.create(data);
}

async function getAllTasks() {
    return await Task.find().populate("course");
}
async function getTaskCountByStatus() {
    return await Task.aggregate([
        {
            $group: {
                _id: "$status",
                count: {
                    $sum: 1
                }
            }
        }
    ]);
}



async function getTasksWithCourses() {
    return await Task.aggregate([
        {
            $lookup: {
                from: "courses",
                localField: "course",
                foreignField: "_id",
                as: "courseDetails"
            }
        }
    ]);
}


async function getPendingTasks() {
    return await Task.aggregate([
        {
            $match: {
                status: "pending"
            }
        }
    ]);
}
async function getTasksWithCourseUnwound() {
    return await Task.aggregate([
        {
            $lookup: {
                from: "courses",
                localField: "course",
                foreignField: "_id",
                as: "courseDetails"
            }
        },
        {
            $unwind: "$courseDetails"
        }
    ]);
}


async function getTaskSummaryWithCourse() {
    return await Task.aggregate([
        {
            $lookup: {
                from: "courses",
                localField: "course",
                foreignField: "_id",
                as: "courseDetails"
            }
        },
        { $unwind: "$courseDetails" },
        {
            $project: {
                _id: 0,
                taskTitle: "$title",
                status: 1,
                courseTitle: "$courseDetails.title",
                instructor: "$courseDetails.instructor"
            }
        },
        { $sort: { courseTitle: 1 } }
    ]);
}

module.exports = {
    createTask,
    getAllTasks,
    getPendingTasks,
    getTaskCountByStatus,
    getTasksWithCourses,
    getTasksWithCourseUnwound,
    getTaskSummaryWithCourse
};