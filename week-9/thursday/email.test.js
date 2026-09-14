require("dotenv").config();
const emailService = require("./services/email.service");

async function testEmailService() {
    try {
        console.log("📧 Testing email service...");

        // Test welcome email
        await emailService.sendWelcomeEmail(
            process.env.EMAIL_USER,
            "Test User"
        );
        console.log("✅ Welcome email test passed");

        // Test password reset email
        await emailService.sendPasswordResetEmail(
            process.env.EMAIL_USER,
            "reset_token_12345"
        );
        console.log("✅ Password reset email test passed");

        // Test order confirmation
        await emailService.sendOrderConfirmationEmail(
            process.env.EMAIL_USER,
            "Test User",
            {
                orderId: "ORD-12345",
                total: "99.99",
                status: "Processing"
            }
        );
        console.log("✅ Order confirmation test passed");

        console.log("✅ All email tests completed!");

    } catch (error) {
        console.error("❌ Test failed:", error.message);
    }
}

testEmailService();