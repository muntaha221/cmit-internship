const fs = require("fs").promises;

async function readData() {
    try {
        const data = await fs.readFile("data.txt", "utf8");

        console.log(data);
    } catch (err) {
        console.log(err);
    }
}

readData();