const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const courseRouter = require("./routes/course.routes");
const taskRouter = require("./routes/task.routes");

const app = express();

const PORT = process.env.PORT || 3000;
const errorHandler = require("./middleware/errorHandler");

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Friday Course Management API is running"
    });
});

app.use("/courses", courseRouter);
app.use("/tasks", taskRouter);

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });


    app.use(errorHandler);