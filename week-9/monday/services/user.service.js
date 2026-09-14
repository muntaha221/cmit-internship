const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

// ============================================
// REGISTER (same as Week 8)
// ============================================
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

// ============================================
// LOGIN (same as Week 8)
// ============================================
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
// ⭐ NEW: GET ALL USERS WITH PAGINATION
// ============================================
async function getAllUsers(page = 1, limit = 10) {
    // 1. Parse and validate
    page = parseInt(page);
    limit = parseInt(limit);
    
    // 2. Max limit (security)
    const maxLimit = 100;
    if (limit > maxLimit) limit = maxLimit;
    if (page < 1) page = 1;
    if (limit < 1) limit = 1;
    
    // 3. Calculate skip
    const skip = (page - 1) * limit;
    
    // 4. Get total count
    const total = await User.countDocuments();
    
    // 5. Get paginated data
    const users = await User.find()
        .skip(skip)
        .limit(limit)
        .select("-password -__v");
    
    // 6. Calculate metadata
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    
    // 7. Return result
    return {
        data: users,
        pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext,
            hasPrev
        }
    };
}

module.exports = {
    registerUser,
    loginUser,
    getAllUsers  // ← NEW export
};