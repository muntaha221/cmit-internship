const users = [
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

function getAllUsers() {
    return users;
}

function getUserById(id) {
    return users.find(user => user.id === id);
}

function createUser(name, email) {
    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1,
        name,
        email
    };
    users.push(newUser);
    return newUser;
}

function updateUser(id, name, email) {
    const user = getUserById(id);
    if (!user) {
        return null;
    }
    if (name !== undefined) {
        user.name = name;
    }
    if (email !== undefined) {
        user.email = email;
    }
    return user;
}

function deleteUser(id) {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
        return null;
    }
    return users.splice(userIndex, 1)[0];
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};