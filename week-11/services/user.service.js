const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function registerUser({ name, email, password }) {
    if (!name) throw new Error("Name is required");
    if (!email) throw new Error("Email is required");
    if (!password) throw new Error("Password is required");
    if (password.length < 6) throw new Error("Password must be at least 6 characters");

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) throw new Error("Email already registered");

    return await User.create({ name, email: email.toLowerCase(), password });
}

async function loginUser({ email, password }) {
    if (!email) throw new Error("Email is required");
    if (!password) throw new Error("Password is required");

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) throw new Error("Invalid email or password");

    const valid = await user.comparePassword(password);
    if (!valid) throw new Error("Invalid email or password");

    const token = jwt.sign(
        { userId: user._id, email: user.email, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || "1h" }
    );

    return {
        user: { _id: user._id, name: user.name, email: user.email },
        token
    };
}

module.exports = { registerUser, loginUser };