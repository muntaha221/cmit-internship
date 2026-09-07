const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

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

async function loginUser(credentials) {
    const { email, password } = credentials;

    if (!email) throw new Error("Email is required");
    if (!password) throw new Error("Password is required");

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) throw new Error("Invalid email or password");

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) throw new Error("Invalid email or password");

    const token = jwt.sign(
        { userId: user._id, email: user.email, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || "1h" }
    );

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

// ============================================
// POINT 4: Protected service methods
// ============================================

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
    return await User.find().select("-password -__v");
}

module.exports = {
    registerUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUsers
};