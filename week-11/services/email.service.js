const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify((error) => {
    if (error) console.error("❌ Email config error:", error.message);
    else console.log("✅ Email server ready");
});

function renderTemplate(templateName, variables) {
    const filePath = path.join(__dirname, "../templates/emails", templateName);
    let html = fs.readFileSync(filePath, "utf8");

    for (const [key, value] of Object.entries(variables)) {
        html = html.replace(new RegExp(`{{${key}}}`, "g"), value);
    }
    return html;
}

async function sendDailySummaryEmail(user) {
    const html = renderTemplate("daily-summary.html", {
        name: user.name,
        email: user.email,
        appName: process.env.APP_NAME || "Our App",
        date: new Date().toDateString()
    });

    return await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: `Your Daily Summary — ${new Date().toDateString()}`,
        html
    });
}

async function sendReminderEmail(user) {
    const html = renderTemplate("reminder.html", {
        name: user.name,
        email: user.email,
        appName: process.env.APP_NAME || "Our App",
        date: new Date().toDateString()
    });

    return await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: `Reminder — ${new Date().toDateString()}`,
        html
    });
}

module.exports = { sendDailySummaryEmail, sendReminderEmail };