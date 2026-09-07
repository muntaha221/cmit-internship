const express = require("express");
const morgan = require("morgan");

const app = express();

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Hello from Express"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});