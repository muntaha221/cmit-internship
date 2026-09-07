const Course = require("../models/course.model");

async function createCourse(data) {
    return await Course.create(data);
}

async function getAllCourses() {
    return await Course.find().sort({ createdAt: -1 });
}

async function getCourseById(id) {
    return await Course.findById(id);
}

async function updateCourse(id, data) {
    return await Course.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    );
}

async function deleteCourse(id) {
    return await Course.findByIdAndDelete(id);
}

module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse
};