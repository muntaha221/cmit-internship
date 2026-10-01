const express = require("express");
require("dotenv").config();

const cors = require("cors");

const connectDB = require("./config/db");
const { registerUser, loginUser } = require("./services/user.service");
const { startAllJobs } = require("./jobs");
const { runDailySummary } = require("./jobs/dailySummary.job");
const { runReminderJob } = require("./jobs/reminder.job");

const authMiddleware = require("./middleware/auth.middleware");
const User = require("./models/user.model");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json({ success: true, message: "Week 11 - Cron Jobs API" });
});

app.post("/api/auth/register", async (req, res) => {
    try {
        const user = await registerUser(req.body);
        res.status(201).json({
            success: true,
            message: "Registered",
            data: { _id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

app.post("/api/auth/login", async (req, res) => {
    try {
        const result = await loginUser(req.body);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
});

// === DEV-ONLY: Manual triggers for testing ===
app.post("/api/test/run-summary", async (req, res) => {
    if (process.env.NODE_ENV === "production") {
        return res.status(403).json({ success: false, message: "Not allowed in production" });
    }
    try {
        await runDailySummary();
        res.json({ success: true, message: "Summary job ran." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post("/api/test/run-reminder", async (req, res) => {
    if (process.env.NODE_ENV === "production") {
        return res.status(403).json({ success: false, message: "Not allowed in production" });
    }
    try {
        await runReminderJob();
        res.json({ success: true, message: "Reminder job ran." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});



app.get("/api/users", authMiddleware, async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });

    startAllJobs();
});