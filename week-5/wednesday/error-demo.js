const fs = require("fs").promises;

async function readFileData() {
    try {
        const data = await fs.readFile("missing.txt", "utf8");

        console.log(data);
    } catch (err) {
        console.log("Something went wrong:", err.message);
    }
}

readFileData();