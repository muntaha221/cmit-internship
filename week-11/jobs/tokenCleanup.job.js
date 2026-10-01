const cron = require("node-cron");
const Token = require("../models/token.model");

function startTokenCleanupJob() {
    const schedule = process.env.TOKEN_CLEANUP_CRON || "0 * * * *";
    const timezone = process.env.CRON_TIMEZONE || "Asia/Karachi";

    console.log(`[token-cleanup] registered | schedule: ${schedule} | tz: ${timezone}`);

    cron.schedule(schedule, async () => {
        const start = Date.now();
        console.log(`[token-cleanup] started at ${new Date().toISOString()}`);

        try {
            const result = await Token.deleteMany({
                expiresAt: { $lt: new Date() }
            });

            console.log(`[token-cleanup] deleted ${result.deletedCount} expired tokens in ${Date.now() - start}ms`);
        } catch (error) {
            console.error("[token-cleanup] FAILED:", error.message);
        }
    }, { timezone });
}

module.exports = { startTokenCleanupJob };