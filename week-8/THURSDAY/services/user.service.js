const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function registerUser(userData) {
    const { name, email, password } = userData;

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

function generateTokens(user) {
    const payload = { userId: user._id, email: user.email, name: user.name };

    const accessToken = jwt.sign(
        { ...payload, type: "access" },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || "15m" }
    );

    const refreshToken = jwt.sign(
        { ...payload, type: "refresh" },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d" }
    );

    return { accessToken, refreshToken };
}

function verifyRefreshToken(token) {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    if (decoded.type !== "refresh") {
        throw new Error("Token is not a refresh token");
    }

    return decoded;
}

async function saveRefreshToken(userId, refreshToken) {
    const salt = await bcrypt.genSalt(10);
    const refreshTokenHash = await bcrypt.hash(refreshToken, salt);
    await User.findByIdAndUpdate(userId, { refreshTokenHash });
}

async function loginUser(credentials) {
    const { email, password } = credentials;

    if (!email) throw new Error("Email is required");
    if (!password) throw new Error("Password is required");

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) throw new Error("Invalid email or password");

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) throw new Error("Invalid email or password");

    const { accessToken, refreshToken } = generateTokens(user);

    await saveRefreshToken(user._id, refreshToken);

    return {
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        },
        accessToken,
        refreshToken
    };
}

async function refreshAccessToken(refreshToken) {
    if (!refreshToken) {
        throw new Error("Refresh token is required");
    }

    const decoded = verifyRefreshToken(refreshToken);

    const user = await User.findById(decoded.userId);
    if (!user) {
        throw new Error("User no longer exists");
    }

    if (!user.refreshTokenHash) {
        throw new Error("No active session. Please login again.");
    }

    const isMatch = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isMatch) {
        throw new Error("Refresh token is invalid or has already been used");
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
    await saveRefreshToken(user._id, newRefreshToken);

    return { accessToken, refreshToken: newRefreshToken };
}

// ============================================
// POINT 5: Logout — invalidate the stored refresh token
// ============================================
async function logoutUser(userId) {
    await User.findByIdAndUpdate(userId, { refreshTokenHash: null });
    return { message: "Logged out successfully" };
}

async function updateUser(userId, updateData) {
    const { name, email } = updateData;

    const user = await User.findByIdAndUpdate(
        userId,
        { name, email },
        { new: true, runValidators: true }
    );

    if (!user) throw new Error("User not found");
    return user;
}

async function deleteUser(userId) {
    const user = await User.findByIdAndDelete(userId);
    if (!user) throw new Error("User not found");
    return user;
}

async function getAllUsers() {
    return await User.find().select("-password -__v -refreshTokenHash");
}

module.exports = {
    registerUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUsers,
    generateTokens,
    verifyRefreshToken,
    refreshAccessToken,
    logoutUser
};