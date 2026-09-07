const fs = require("fs");

fs.writeFile("notes.txt", "This is my first note.", function (err) {
    if (err) {
        console.log(err);
        return;
    }

    console.log("File written successfully");
});