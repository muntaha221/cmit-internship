const nodemailer = require("nodemailer");
const templateService = require("./template.service");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify((error) => {
    if (error) console.error("❌ Email config error:", error.message);
    else console.log("yo! Email server ready");
});

async function sendWelcomeEmail(userEmail, userName) {
    try {
        const html = templateService.renderTemplate("welcome.html", {
            name: userName,
            appName: process.env.APP_NAME
        });

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: userEmail,
            subject: `Welcome to ${process.env.APP_NAME}! `,
            html
        });
    } catch (error) {
        console.error("❌ Welcome email failed:", error.message);
    }
}

async function sendBookingConfirmationEmail(user, booking, event, ticket) {
    try {
        const html = templateService.renderTemplate("booking-confirmation.html", {
            name: user.name,
            eventTitle: event.title,
            eventDate: new Date(event.date).toDateString(),
            eventLocation: event.location,
            ticketType: ticket.type,
            quantity: booking.quantity,
            totalPrice: booking.totalPrice,
            appName: process.env.APP_NAME
        });

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: `Booking Confirmed — ${event.title}`,
            html
        });
    } catch (error) {
        console.error("❌ Booking email failed:", error.message);
    }
}

module.exports = { sendWelcomeEmail, sendBookingConfirmationEmail };