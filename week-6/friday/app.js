const express = require("express");

const usersRouter = require("./routes/users.route");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

const PORT = 3000;

app.use(express.json());

function requestLogger(req, res, next) {
    console.log(`${req.method} ${req.url}`);
    next();
}

app.use(requestLogger);

app.use("/users", usersRouter);

// Centralized error-handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
































// const express = require("express");

// const app = express();

// const PORT = 3000;

// app.use(express.json());

// let users = [
//     {
//         id: 1,
//         name: "Ali",
//         email: "ali@example.com"
//     },
//     {
//         id: 2,
//         name: "Sara",
//         email: "sara@example.com"
//     }
// ];

// app.get("/users", (req, res) => {
//     res.status(200).json({
//         success: true,
//         data: users
//     });
// });

// app.get("/users/:id", (req, res) => {
//     const id = Number(req.params.id);

//     const user = users.find((user) => user.id === id);

//     if (!user) {
//         return res.status(404).json({
//             success: false,
//             message: "User not found"
//         });
//     }

//     res.status(200).json({
//         success: true,
//         data: user
//     });
// });

// app.post("/users", (req, res) => {
//     const { name, email } = req.body;

//     const newUser = {
//         id: users.length > 0
//             ? Math.max(...users.map((user) => user.id)) + 1
//             : 1,
//         name,
//         email
//     };

//     users.push(newUser);

//     res.status(201).json({
//         success: true,
//         message: "User created successfully",
//         data: newUser
//     });
// });

// app.patch("/users/:id", (req, res) => {
//     const id = Number(req.params.id);

//     const user = users.find((user) => user.id === id);

//     if (!user) {
//         return res.status(404).json({
//             success: false,
//             message: "User not found"
//         });
//     }

//     const { name, email } = req.body;

//     if (name !== undefined) {
//         user.name = name;
//     }

//     if (email !== undefined) {
//         user.email = email;
//     }

//     res.status(200).json({
//         success: true,
//         message: "User updated successfully",
//         data: user
//     });
// });

// app.delete("/users/:id", (req, res) => {
//     const id = Number(req.params.id);

//     const userIndex = users.findIndex((user) => user.id === id);

//     if (userIndex === -1) {
//         return res.status(404).json({
//             success: false,
//             message: "User not found"
//         });
//     }

//     const deletedUser = users.splice(userIndex, 1)[0];

//     res.status(200).json({
//         success: true,
//         message: "User deleted successfully",
//         data: deletedUser
//     });
// });

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });





// const express = require("express");

// const app = express();

// const PORT = 3000;

// app.use(express.json());

// let users = [
//     {
//         id: 1,
//         name: "Ali",
//         email: "ali@example.com"
//     },
//     {
//         id: 2,
//         name: "Sara",
//         email: "sara@example.com"
//     }
// ];

// // Custom request logging middleware
// function requestLogger(req, res, next) {
//     console.log(`${req.method} ${req.url}`);
//     next();
// }

// // Request validation middleware
// function validateUser(req, res, next) {
//     const { name, email } = req.body;

//     if (!name || !email) {
//         return res.status(400).json({
//             success: false,
//             message: "Name and email are required"
//         });
//     }

//     next();
// }

// app.use(requestLogger);

// app.get("/users", (req, res) => {
//     res.status(200).json({
//         success: true,
//         data: users
//     });
// });

// app.get("/users/:id", (req, res) => {
//     const id = Number(req.params.id);

//     const user = users.find((user) => user.id === id);

//     if (!user) {
//         return res.status(404).json({
//             success: false,
//             message: "User not found"
//         });
//     }

//     res.status(200).json({
//         success: true,
//         data: user
//     });
// });

// app.post("/users", validateUser, (req, res) => {
//     const { name, email } = req.body;

//     const newUser = {
//         id: users.length > 0
//             ? Math.max(...users.map((user) => user.id)) + 1
//             : 1,
//         name,
//         email
//     };

//     users.push(newUser);

//     res.status(201).json({
//         success: true,
//         message: "User created successfully",
//         data: newUser
//     });
// });

// app.patch("/users/:id", validateUser, (req, res) => {
//     const id = Number(req.params.id);

//     const user = users.find((user) => user.id === id);

//     if (!user) {
//         return res.status(404).json({
//             success: false,
//             message: "User not found"
//         });
//     }

//     const { name, email } = req.body;

//     user.name = name;
//     user.email = email;

//     res.status(200).json({
//         success: true,
//         message: "User updated successfully",
//         data: user
//     });
// });

// app.delete("/users/:id", (req, res) => {
//     const id = Number(req.params.id);

//     const userIndex = users.findIndex((user) => user.id === id);

//     if (userIndex === -1) {
//         return res.status(404).json({
//             success: false,
//             message: "User not found"
//         });
//     }

//     const deletedUser = users.splice(userIndex, 1)[0];

//     res.status(200).json({
//         success: true,
//         message: "User deleted successfully",
//         data: deletedUser
//     });
// });

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });