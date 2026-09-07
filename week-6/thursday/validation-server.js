const express = require("express");

const app = express();

const PORT = 3001;

app.use(express.json());

// validate user input
function validateUser(req, res, next) {
    const { name, email } = req.body;

    // check required fields
    if (!name || !email) {
        return res.status(400).json({
            success: false,
            message: "Name and email are required",
            data: null
        });
    }

    // remove extra spaces
    const cleanName = name.trim();
    const cleanEmail = email.trim();

    // check empty values
    if (!cleanName || !cleanEmail) {
        return res.status(400).json({
            success: false,
            message: "Name and email cannot be empty",
            data: null
        });
    }

    // basic email format check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email format",
            data: null
        });
    }

    // put cleaned values back into the request
    req.body.name = cleanName;
    req.body.email = cleanEmail;

    next();
}

// create user
app.post("/users", validateUser, (req, res) => {
    res.status(201).json({
        success: true,
        message: "User data is valid",
        data: req.body
    });
});

// simple test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Validation server is running"
    });
});

app.listen(PORT, () => {
    console.log(`Validation server running at http://localhost:${PORT}`);
});