const crypto = require("crypto");  // ← NEW: For generating reset tokens

// ============================================
// POINT 3: PASSWORD RESET FUNCTIONS
// ============================================

// Generate password reset token
function generateResetToken() {
    // Generate a random 32-byte token
    // This is more secure than using JWT for password reset
    return crypto.randomBytes(32).toString("hex");
}

// Request password reset
async function requestPasswordReset(email) {
    if (!email) throw new Error("Email is required");

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) throw new Error("User not found");

    // Generate reset token
    const resetToken = generateResetToken();

    // Store token in database (with expiry)
    // We'll add these fields to the user schema later
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // ============================================
    // POINT 3: SEND PASSWORD RESET EMAIL
    // ============================================
    try {
        await emailService.sendPasswordResetEmail(user.email, resetToken);
        console.log("📧 Password reset email sent to:", user.email);
    } catch (error) {
        console.error("⚠️ Password reset email failed:", error.message);
        throw new Error("Failed to send reset email");
    }

    return { message: "Password reset email sent" };
}

// Reset password (using token)
async function resetPassword(token, newPassword) {
    if (!token) throw new Error("Reset token is required");
    if (!newPassword) throw new Error("New password is required");
    if (newPassword.length < 6) throw new Error("Password must be at least 6 characters");

    // Find user by token and check expiry
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }  // Token must not be expired
    });

    if (!user) {
        throw new Error("Invalid or expired reset token");
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return { message: "Password reset successful" };
}

// Update exports at bottom
module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    requestPasswordReset,  // ← NEW
    resetPassword          // ← NEW
};