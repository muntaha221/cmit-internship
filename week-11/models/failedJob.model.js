const mongoose = require("mongoose");

const failedJobSchema = new mongoose.Schema(
    {
        jobName: { type: String, required: true },
        recordId: { type: mongoose.Schema.Types.ObjectId, required: true },
        recordModel: { type: String, required: true },
        error: { type: String, required: true },
        retryCount: { type: Number, default: 0 },
        status: { type: String, enum: ["PENDING", "RESOLVED"], default: "PENDING" }
    },
    { timestamps: true }
);

failedJobSchema.index({ status: 1, retryCount: 1 });

module.exports = mongoose.model("FailedJob", failedJobSchema);