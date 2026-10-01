const cron = require("node-cron");
const User = require("../models/user.model");
const JobLog = require("../models/jobLog.model");
const FailedJob = require("../models/failedJob.model");
const emailService = require("../services/email.service");

async function runReminderJob() {
    const start = Date.now();
    const today = new Date().toISOString().slice(0, 10);

    // Idempotency check
    const alreadyRan = await JobLog.findOne({
        jobName: "reminder",
        runDate: today,
        status: "completed"
    });

    if (alreadyRan) {
        console.log("[reminder] already ran today. Skipping.");
        return;
    }

    // Lock
    let jobLog;
    try {
        jobLog = await JobLog.create({
            jobName: "reminder",
            runDate: today,
            status: "running"
        });
    } catch (error) {
        console.log("[reminder] another instance is running. Skipping.");
        return;
    }

    console.log(`[reminder] started | jobLog: ${jobLog._id}`);

    let sent = 0;
    let failed = 0;

    try {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const users = await User.find({
            isActive: true,
            $or: [
                { lastReminderSentAt: null },
                { lastReminderSentAt: { $lt: oneDayAgo } }
            ]
        }).select("name email");

        console.log(`[reminder] found ${users.length} eligible users`);

        const batchSize = parseInt(process.env.SUMMARY_BATCH_SIZE) || 50;

        for (let i = 0; i < users.length; i += batchSize) {
            const batch = users.slice(i, i + batchSize);

            for (const user of batch) {
                try {
                    await emailService.sendReminderEmail(user);

                    user.lastReminderSentAt = new Date();
                    await user.save();

                    sent++;
                    console.log(`[reminder] sent to ${user.email}`);
                } catch (error) {
                    failed++;
                    console.error(`[reminder] failed for ${user.email}:`, error.message);

                    await FailedJob.create({
                        jobName: "reminder",
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

        console.log(`[reminder] done in ${Date.now() - start}ms | sent: ${sent} | failed: ${failed}`);
    } catch (error) {
        jobLog.status = "failed";
        jobLog.errorMessage = error.message;
        await jobLog.save();

        console.error("[reminder] CRASHED:", error.message);
    }
}

function startReminderJob() {
    const schedule = process.env.REMINDER_CRON || "0 8 * * *";
    const timezone = process.env.CRON_TIMEZONE || "Asia/Karachi";

    console.log(`[reminder] registered | schedule: ${schedule} | tz: ${timezone}`);

    cron.schedule(schedule, runReminderJob, { timezone });
}

module.exports = { startReminderJob, runReminderJob };