// const express = require("express");
// const usersRouter = require("./routes/users.routes");

// const app = express();

// const PORT = 3000;

// app.use("/users", usersRouter);

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });.


// const express = require("express");
// const usersRouter = require("./routes/users.routes2");

// const app = express();

// const PORT = 3000;

// // read JSON request bodies
// app.use(express.json());

// // users routes
// app.use("/users", usersRouter);

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });




const express = require("express");

const app = express();

const PORT = 3000;

// middleware 1
app.use((req, res, next) => {
    console.log("Middleware 1");
    next();
});

// middleware 2
app.use((req, res, next) => {
    console.log("Middleware 2");
    next();
});

// route handler
app.get("/", (req, res) => {
    console.log("Route handler");

    res.json({
        success: true,
        message: "Hello from Express"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});