const User = require("../models/user.model");

async function registerUser(userData) {
    const { name, email, password } = userData;

    // ============================================
    // VALIDATION — Same as before
    // ============================================
    
    if (!name) {
        throw new Error("Name is required");
    }

    if (!email) {
        throw new Error("Email is required");
    }

    if (!password) {
        throw new Error("Password is required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
    }

    if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
    }

    // Check duplicate email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
        throw new Error("Email already registered");
    }

    // ============================================
    // CREATE USER — Password will be hashed automatically
    // ============================================
    // We pass the plain password, mongoose pre-save middleware hashes it
    const user = await User.create({
        name,
        email: email.toLowerCase(),
        password // ← Plain password, but pre-save hook will hash it
    });

    // Return user without password
    return user;
}

module.exports = {
    registerUser
};