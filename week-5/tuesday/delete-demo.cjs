const fs = require("fs");

fs.unlink("notes.txt", function (err) {
    if (err) {
        console.log(err);
        return;
    }

    console.log("File deleted successfully");
});