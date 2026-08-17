const express = require("express");

const router = express.Router();

let users = [
    {
        id: 1,
        name: "Ali",
        email: "ali@example.com"
    },
    {
        id: 2,
        name: "Sara",
        email: "sara@example.com"
    }
];

// create user
router.post("/", (req, res) => {
    const newUser = {
        id: users.length + 1,
        name: req.body.name,
        email: req.body.email
    };

    users.push(newUser);

    res.status(201).json({
        success: true,
        message: "User created successfully",
        data: newUser
    });
});

// get all users
router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: users
    });
});

// get one user
router.get("/:id", (req, res) => {
    const id = Number(req.params.id);

    const user = users.find(function (user) {
        return user.id === id;
    });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
            data: null
        });
    }

    res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: user
    });
});

// update user
router.patch("/:id", (req, res) => {
    const id = Number(req.params.id);

    const user = users.find(function (user) {
        return user.id === id;
    });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
            data: null
        });
    }

    if (req.body && req.body.name !== undefined) {
        user.name = req.body.name;
    }

    if (req.body && req.body.email !== undefined) {
        user.email = req.body.email;
    }

    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: user
    });
});

// delete user
router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);

    const userIndex = users.findIndex(function (user) {
        return user.id === id;
    });

    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "User not found",
            data: null
        });
    }

    const deletedUser = users.splice(userIndex, 1);

    res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: deletedUser[0]
    });
});

module.exports = router;