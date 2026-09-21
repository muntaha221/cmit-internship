const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const emailService = require("./email.service");
const cloudinary = require("../config/cloudinary");

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

    try {
        await emailService.sendWelcomeEmail(user.email, user.name);
    } catch (error) {
        console.error("?????? Welcome email failed:", error.message);
    }

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

    // role added to token
    const token = jwt.sign(
        { userId: user._id, email: user.email, name: user.name, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || "1h" }
    );

    return {
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        },
        token
    };
}

function buildFilter(queryParams) {
    const filter = {};
    if (queryParams.role) {
        filter.role = queryParams.role;
    }
    return filter;
}

function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildSearch(queryParams) {
    if (!queryParams.search) return null;
    const safeSearchTerm = escapeRegex(queryParams.search);
    return {
        $or: [
            { name: { $regex: safeSearchTerm, $options: "i" } },
            { email: { $regex: safeSearchTerm, $options: "i" } }
        ]
    };
}

function buildSort(queryParams) {
    if (!queryParams.sort) return { createdAt: -1 };
    const sortField = queryParams.sort;
    const isDescending = sortField.startsWith("-");
    const fieldName = isDescending ? sortField.substring(1) : sortField;
    return { [fieldName]: isDescending ? -1 : 1 };
}

function buildFieldSelection(queryParams) {
    if (!queryParams.fields) return "-password -__v -refreshTokenHash";
    return queryParams.fields.split(",").join(" ");
}

async function getAllUsers(queryParams) {
    let page = parseInt(queryParams.page) || 1;
    let limit = parseInt(queryParams.limit) || 10;

    const maxLimit = 100;
    if (limit > maxLimit) limit = maxLimit;
    if (page < 1) page = 1;
    if (limit < 1) limit = 1;

    const filter = buildFilter(queryParams);
    const search = buildSearch(queryParams);

    const finalQuery = { ...filter };
    if (search) finalQuery.$or = search.$or;

    const sort = buildSort(queryParams);
    const fields = buildFieldSelection(queryParams);
    const skip = (page - 1) * limit;

    const total = await User.countDocuments(finalQuery);
    const users = await User.find(finalQuery)
        .sort(sort)
        .select(fields)
        .skip(skip)
        .limit(limit);

    const totalPages = Math.ceil(total / limit);

    return {
        data: users,
        pagination: {
            page, limit, total, totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
        }
    };
}

async function updateAvatar(userId, url, publicId) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    if (user.avatar && user.avatar.publicId) {
        try {
            await cloudinary.uploader.destroy(user.avatar.publicId);
        } catch (error) {
            console.error("?????? Failed to delete old avatar:", error.message);
        }
    }

    user.avatar = { url, publicId };
    await user.save();
    return user;
}

async function deleteAvatar(userId) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    if (!user.avatar || !user.avatar.publicId) throw new Error("No avatar to delete");

    await cloudinary.uploader.destroy(user.avatar.publicId);
    user.avatar = { url: null, publicId: null };
    await user.save();
    return user;
}

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    updateAvatar,
    deleteAvatar
};