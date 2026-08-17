const fs = require("fs").promises;

fs.readFile("data.txt", "utf8")
    .then((data) => {
        console.log(data);
    })
    .catch((error) => {
        console.log("Error:", error.message);
    });