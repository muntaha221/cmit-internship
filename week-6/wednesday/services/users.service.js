let users = [
    {
        id: 1,
        name: "Moon",
        email: "moon@example.com"
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
    return users.find(function (user) {
        return user.id === id;
    });
}

function addUser(name, email) {
    const newUser = {
        id: users.length + 1,
        name: name,
        email: email
    };

    users.push(newUser);

    return newUser;
}

module.exports = {
    getAllUsers,
    getUserById,
    addUser
};