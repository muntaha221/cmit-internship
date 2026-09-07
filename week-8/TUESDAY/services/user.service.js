const User = require("../models/user.model");
const jwt = require("jsonwebtoken");  // ← NEW

// ============================================
// REGISTRATION SERVICE (same as before)
// ============================================
async function registerUser(userData) {
    const { name, email, password } = userData;

    // Validation
    if (!name) throw new Error("Name is required");
    if (!email) throw new Error("Email is required");
    if (!password) throw new Error("Password is required");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) throw new Error("Invalid email format");
    if (password.length < 6) throw new Error("Password must be at least 6 characters");

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) throw new Error("Email already registered");

    const user = await User.create({
        name,
        email: email.toLowerCase(),
        password
    });

    return user;
}

// ============================================
// NEW: LOGIN SERVICE
// ============================================
async function loginUser(credentials) {
    const { email, password } = credentials;

    // 1. Validate input
    if (!email) throw new Error("Email is required");
    if (!password) throw new Error("Password is required");

    // 2. Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) throw new Error("Invalid email or password");

    // 3. Compare password using bcrypt
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) throw new Error("Invalid email or password");

    // 4. Generate JWT token
    const token = jwt.sign(
        // Payload (what we store in token)
        {
            userId: user._id,
            email: user.email,
            name: user.name
        },
        // Secret (from .env)
        process.env.JWT_SECRET,
        // Options (expiry)
        {
            expiresIn: process.env.JWT_EXPIRE || "1h"
        }
    );

    // 5. Return user info + token (NO PASSWORD!)
    return {
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        },
        token
    };
}

module.exports = {
    registerUser,
    loginUser  // ← NEW
};