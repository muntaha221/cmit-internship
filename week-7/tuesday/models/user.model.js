const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    age: {
        type: Number,
        required: true
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
}, {
    timestamps: true
});

userSchema.methods.getInfo = function () {
    return `${this.name} - ${this.email}`;
};

const User = mongoose.model("User", userSchema);

module.exports = User;