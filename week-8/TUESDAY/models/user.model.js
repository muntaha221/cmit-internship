const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
// FIXED: pre-save middleware with proper next()
// ============================================
userSchema.pre("save", function (next) {
    const user = this;
    
    // If password not modified, skip
    if (!user.isModified("password")) return next();
    
    // Generate salt and hash
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);
        
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            
            user.password = hash;
            next();  // ← CRITICAL: Call next() here
        });
    });
});

// ============================================
// comparePassword method
// ============================================
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;