const express = require("express");
const usersRouter = require("./routes/users.route");
const errorHandler = require("./middlewares/error.middleware");

const app = express();
const PORT = 3000;

app.use(express.json());

// Custom request logging middleware
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