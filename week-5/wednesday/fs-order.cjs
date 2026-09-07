const fs = require("fs");

console.log("1");

fs.readFile("data.txt", "utf8", function (err, data) {
    if (err) {
        console.log(err);
        return;
    }

    console.log("2");
    console.log(data);
});

console.log("3");