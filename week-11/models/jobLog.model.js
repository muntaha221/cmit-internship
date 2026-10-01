const mongoose = require("mongoose");

const jobLogSchema = new mongoose.Schema(
    {
        jobName: { type: String, required: true },
        runDate: { type: String, required: true },
        status: { type: String, enum: ["running", "completed", "failed"], default: "running" },
        recordsProcessed: { type: Number, default: 0 },
        errorMessage: { type: String, default: null }
    },
    { timestamps: true }
);

jobLogSchema.index({ jobName: 1, runDate: 1 }, { unique: true });

module.exports = mongoose.model("JobLog", jobLogSchema);