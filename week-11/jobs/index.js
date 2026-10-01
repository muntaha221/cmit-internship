const { startTokenCleanupJob } = require("./tokenCleanup.job");
const { startDailySummaryJob } = require("./dailySummary.job");
const { startReminderJob } = require("./reminder.job");
const { startFailedRetryJob } = require("./failedJobRetry.job");

function startAllJobs() {
    if (process.env.ENABLE_CRON !== "true") {
        console.log("⏸️ Cron jobs disabled (ENABLE_CRON is not true)");
        return;
    }

    console.log("🕐 Starting all cron jobs...");
    startTokenCleanupJob();
    startDailySummaryJob();
    startReminderJob();
    startFailedRetryJob();
    console.log("✅ All cron jobs registered");
}

module.exports = { startAllJobs };