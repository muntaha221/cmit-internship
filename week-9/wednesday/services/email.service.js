const nodemailer = require("nodemailer");
const templateService = require("./template.service");

// Transporter (same as before)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ============================================
// POINT 4: HTML TEMPLATES WITH DYNAMIC VALUES
// ============================================

async function sendWelcomeEmail(userEmail, userName) {
    try {
        // Render HTML template with dynamic values
        const html = templateService.renderTemplate("welcome.html", {
            name: userName,
            email: userEmail,
            appName: process.env.APP_NAME || "Our App",
            appUrl: process.env.FRONTEND_URL || "http://localhost:3000"
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: userEmail,
            subject: `Welcome to ${process.env.APP_NAME || "Our App"}! 🎉`,
            html: html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Welcome email sent to:", userEmail);
        return info;

    } catch (error) {
        console.error("❌ Welcome email failed:", error.message);
        throw new Error("Failed to send welcome email");
    }
}

async function sendPasswordResetEmail(userEmail, resetToken) {
    try {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        const html = templateService.renderTemplate("reset-password.html", {
            resetUrl: resetUrl,
            appName: process.env.APP_NAME || "Our App"
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: userEmail,
            subject: "Password Reset Request 🔐",
            html: html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Password reset email sent to:", userEmail);
        return info;

    } catch (error) {
        console.error("❌ Password reset email failed:", error.message);
        throw new Error("Failed to send password reset email");
    }
}

async function sendOrderConfirmationEmail(userEmail, userName, orderDetails) {
    try {
        const html = templateService.renderTemplate("order-confirmation.html", {
            name: userName,
            orderId: orderDetails.orderId,
            total: orderDetails.total,
            status: orderDetails.status,
            appName: process.env.APP_NAME || "Our App"
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: userEmail,
            subject: "Order Confirmation 📦",
            html: html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Order confirmation sent to:", userEmail);
        return info;

    } catch (error) {
        console.error("❌ Order confirmation failed:", error.message);
        throw new Error("Failed to send order confirmation email");
    }
}

module.exports = {
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendOrderConfirmationEmail
};