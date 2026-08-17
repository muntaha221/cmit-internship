const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "data.txt");

fs.readFile(filePath, "utf8", (error, data) => {
    if (error) {
        console.log("Error:", error.message);
        return;
    }

    console.log(data);
});