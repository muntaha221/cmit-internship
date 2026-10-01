const cron = require("node-cron");
const FailedJob = require("../models/failedJob.model");
const User = require("../models/user.model");
const emailService = require("../services/email.service");

async function retryFailedJobs() {
    console.log(`[failed-retry] started at ${new Date().toISOString()}`);

    const maxAttempts = parseInt(process.env.MAX_RETRY_ATTEMPTS) || 3;

    try {
        const failures = await FailedJob.find({
            status: "PENDING",
            retryCount: { $lt: maxAttempts }
        }).limit(20);

        console.log(`[failed-retry] found ${failures.length} failed jobs to retry`);

        for (const failure of failures) {
            try {
                const user = await User.findById(failure.recordId);
                if (!user) {
                    failure.status = "RESOLVED";
                    await failure.save();
                    continue;
                }

                if (failure.jobName === "daily-summary") {
                    await emailService.sendDailySummaryEmail(user);
                    user.lastSummarySentAt = new Date();
                } else if (failure.jobName === "reminder") {
                    await emailService.sendReminderEmail(user);
                    user.lastReminderSentAt = new Date();
                }

                await user.save();

                failure.status = "RESOLVED";
                await failure.save();
                console.log(`[failed-retry] resolved ${failure._id}`);
            } catch (error) {
                failure.retryCount++;
                if (failure.retryCount >= maxAttempts) {
                    failure.error = `Gave up after ${maxAttempts} attempts: ${error.message}`;
                }
                await failure.save();
                console.error(`[failed-retry] retry failed for ${failure._id}:`, error.message);
            }
        }

        console.log(`[failed-retry] done`);
    } catch (error) {
        console.error("[failed-retry] CRASHED:", error.message);
    }
}

function startFailedRetryJob() {
    const schedule = process.env.FAILED_RETRY_CRON || "*/10 * * * *";
    const timezone = process.env.CRON_TIMEZONE || "Asia/Karachi";

    console.log(`[failed-retry] registered | schedule: ${schedule} | tz: ${timezone}`);

    cron.schedule(schedule, retryFailedJobs, { timezone });
}

module.exports = { startFailedRetryJob };