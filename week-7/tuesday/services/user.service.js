const User = require("../models/user.model");

async function createUser(userData) {
    return await User.create(userData);
}

async function getAllUsers() {
    return await User.find();
}

async function getUserById(id) {
    return await User.findById(id);
}

async function updateUser(id, userData) {
    return await User.findByIdAndUpdate(
        id,
        userData,
        {
            new: true,
            runValidators: true
        }
    );
}

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser
};