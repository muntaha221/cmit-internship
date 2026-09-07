const fs = require("fs").promises;

fs.readFile("data.txt", "utf8")
    .then(function (data) {
        console.log(data);
    })
    .catch(function (err) {
        console.log(err);
    });