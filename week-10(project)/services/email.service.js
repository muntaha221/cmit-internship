const nodemailer = require("nodemailer");
const templateService = require("./template.service");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error("??? Email configuration error:", error.message);
    } else {
        console.log("??? Email server is ready to send messages");
    }
});

// Welcome email
async function sendWelcomeEmail(userEmail, userName) {
    try {
        const html = templateService.renderTemplate("welcome.html", {
            name: userName,
            email: userEmail,
            appName: process.env.APP_NAME || "Our App",
            appUrl: process.env.FRONTEND_URL || "http://localhost:3000"
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: userEmail,
            subject: `Welcome to ${process.env.APP_NAME || "Our App"}! ????`,
            html: html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("??? Welcome email sent to:", userEmail);
        return info;
    } catch (error) {
        console.error("??? Welcome email failed:", error.message);
        throw new Error("Failed to send welcome email");
    }
}

// Password reset email
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
            subject: "Password Reset Request ????",
            html: html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("??? Password reset email sent to:", userEmail);
        return info;
    } catch (error) {
        console.error("??? Password reset email failed:", error.message);
        throw new Error("Failed to send password reset email");
    }
}

// ============================================
// NEW: Booking status email (accepted/rejected)
// ============================================
async function sendBookingStatusEmail(userEmail, userName, booking, event, status) {
    try {
        // Pick colors / titles based on status
        let headerColor = "#4CAF50";       // green
        let headerTitle = "Booking Accepted ????";
        let message = "Great news! Your booking request has been accepted.";

        if (status === "REJECTED") {
            headerColor = "#F44336";       // red
            headerTitle = "Booking Rejected";
            message = "Unfortunately, your booking request has been rejected by the organizer.";
        }

        const eventDate = new Date(event.date).toDateString();

        const html = templateService.renderTemplate("booking-status.html", {
            headerColor: headerColor,
            headerTitle: headerTitle,
            message: message,
            name: userName,
            eventTitle: event.title,
            eventDate: eventDate,
            eventLocation: event.location,
            status: status,
            appName: process.env.APP_NAME || "Our App"
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: userEmail,
            subject: `Booking ${status}: ${event.title}`,
            html: html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`??? Booking ${status} email sent to:`, userEmail);
        return info;
    } catch (error) {
        console.error("??? Booking status email failed:", error.message);
        throw new Error("Failed to send booking status email");
    }
}

module.exports = {
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendBookingStatusEmail
};