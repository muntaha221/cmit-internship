const usersService = require("../services/users.service");

function getUsers(req, res) {
    const users = usersService.getAllUsers();

    res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: users
    });
}

module.exports = {
    getUsers
};