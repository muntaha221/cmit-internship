const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },

        instructor: {
            type: String,
            required: true,
            trim: true
        },

        level: {
            type: String,
            required: true,
            enum: ["beginner", "intermediate", "advanced"]
        }
    },
    {
        timestamps: true
    }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;