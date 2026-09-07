const usersService = require("../services/users.service");

function getAllUsers(req, res) {
    const users = usersService.getAllUsers();

    res.status(200).json({
        success: true,
        data: users
    });
}

function getUserById(req, res, next) {
    const id = Number(req.params.id);

    const user = usersService.getUserById(id);

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;

        return next(error);
    }

    res.status(200).json({
        success: true,
        data: user
    });
}

function createUser(req, res) {
    const { name, email } = req.body;

    const newUser = usersService.createUser(name, email);

    res.status(201).json({
        success: true,
        message: "User created successfully",
        data: newUser
    });
}

function updateUser(req, res, next) {
    const id = Number(req.params.id);
    const { name, email } = req.body;

    const updatedUser = usersService.updateUser(id, name, email);

    if (!updatedUser) {
        const error = new Error("User not found");
        error.statusCode = 404;

        return next(error);
    }

    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser
    });
}

function deleteUser(req, res, next) {
    const id = Number(req.params.id);

    const deletedUser = usersService.deleteUser(id);

    if (!deletedUser) {
        const error = new Error("User not found");
        error.statusCode = 404;

        return next(error);
    }

    res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: deletedUser
    });
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};