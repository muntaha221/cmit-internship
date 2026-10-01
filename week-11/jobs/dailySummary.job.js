const cron = require("node-cron");
const User = require("../models/user.model");
const JobLog = require("../models/jobLog.model");
const FailedJob = require("../models/failedJob.model");
const emailService = require("../services/email.service");

async function runDailySummary() {
    const start = Date.now();
    const today = new Date().toISOString().slice(0, 10);

    const alreadyRan = await JobLog.findOne({
        jobName: "daily-summary",
        runDate: today,
        status: "completed"
    });

    if (alreadyRan) {
        console.log("[daily-summary] already ran today. Skipping.");
        return;
    }

    let jobLog;
    try {
        jobLog = await JobLog.create({
            jobName: "daily-summary",
            runDate: today,
            status: "running"
        });
    } catch (error) {
        console.log("[daily-summary] another instance is running. Skipping.");
        return;
    }

    console.log(`[daily-summary] started | jobLog: ${jobLog._id}`);

    let sent = 0;
    let failed = 0;

    try {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const users = await User.find({
            isActive: true,
            $or: [
                { lastSummarySentAt: null },
                { lastSummarySentAt: { $lt: oneDayAgo } }
            ]
        }).select("name email");

        console.log(`[daily-summary] found ${users.length} eligible users`);

        const batchSize = parseInt(process.env.SUMMARY_BATCH_SIZE) || 50;

        for (let i = 0; i < users.length; i += batchSize) {
            const batch = users.slice(i, i + batchSize);
            console.log(`[daily-summary] processing batch ${Math.floor(i / batchSize) + 1}`);

            for (const user of batch) {
                try {
                    await emailService.sendDailySummaryEmail(user);

                    user.lastSummarySentAt = new Date();
                    await user.save();

                    sent++;
                    console.log(`[daily-summary] sent to ${user.email}`);
                } catch (error) {
                    failed++;
                    console.error(`[daily-summary] failed for ${user.email}:`, error.message);

                    await FailedJob.create({
                        jobName: "daily-summary",
                        recordId: user._id,
                        recordModel: "User",
                        error: error.message
                    });
                }
            }

            await new Promise(r => setTimeout(r, 100));
        }

        jobLog.status = "completed";
        jobLog.recordsProcessed = sent;
        await jobLog.save();

        console.log(`[daily-summary] done in ${Date.now() - start}ms | sent: ${sent} | failed: ${failed}`);
    } catch (error) {
        jobLog.status = "failed";
        jobLog.errorMessage = error.message;
        await jobLog.save();

        console.error("[daily-summary] CRASHED:", error.message);
    }
}

function startDailySummaryJob() {
    const schedule = process.env.DAILY_SUMMARY_CRON || "0 9 * * *";
    const timezone = process.env.CRON_TIMEZONE || "Asia/Karachi";

    console.log(`[daily-summary] registered | schedule: ${schedule} | tz: ${timezone}`);

    cron.schedule(schedule, runDailySummary, { timezone });
}

module.exports = { startDailySummaryJob, runDailySummary };