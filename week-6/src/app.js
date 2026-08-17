// const express = require("express");
// const usersRouter = require("./routes/users.routes");

// const app = express();

// const PORT = 3000;

// app.use("/users", usersRouter);

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });.


const express = require("express");
const usersRouter = require("./routes/users.routes2");

const app = express();

const PORT = 3000;

// read JSON request bodies
app.use(express.json());

// users routes
app.use("/users", usersRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});