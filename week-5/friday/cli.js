const fs = require("fs");

const file = "data.json";

const command = process.argv[2];
const name = process.argv[3];

if (command === "list") {
    const data = fs.readFileSync(file, "utf8");
    const users = JSON.parse(data);

    console.log(users);
} else if (command === "add") {
    const data = fs.readFileSync(file, "utf8");
    const users = JSON.parse(data);

    const newUser = {
        id: users.length + 1,
        name: name
    };

    users.push(newUser);

    fs.writeFileSync(file, JSON.stringify(users, null, 2));

    console.log("User added:", newUser);
} else {
    console.log("Use: node cli.js list");
    console.log("or: node cli.js add Ali");
}