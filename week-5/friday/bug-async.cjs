const fs = require("fs");

fs.readFile("data.txt", "utf8", (error, data) => {
    if (error) {
        console.log("Error:", error.message);
        return;
    }

    console.log(data);
});