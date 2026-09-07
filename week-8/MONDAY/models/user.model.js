const mongoose = require("mongoose");
const bcrypt = require("bcrypt");  // ← NEW: Import bcrypt

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

// ============================================
// NEW: Pre-save middleware to hash password
// ============================================
// This runs automatically before saving a user
userSchema.pre("save", async function (next) {
    // 'this' refers to the user document being saved
    
    // Only hash if password is modified or new
    if (!this.isModified("password")) {
        return next();
    }

    try {
        // Generate salt with 10 rounds (industry standard)
        // Higher rounds = more secure but slower
        const salt = await bcrypt.genSalt(10);
        
        // Hash the password with the salt
        this.password = await bcrypt.hash(this.password, salt);
        
        next(); // Continue to save
    } catch (error) {
        next(error); // Pass error to error handler
    }
});

// ============================================
// NEW: Method to compare passwords (for login later)
// ============================================
userSchema.methods.comparePassword = async function (candidatePassword) {
    // Compare plain text password with stored hash
    // Returns true if matches, false if not
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;