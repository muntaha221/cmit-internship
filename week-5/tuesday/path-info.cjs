const path = require("path");

let filePath = path.join(__dirname, "notes.txt");

console.log("Full path:", filePath);
console.log("File name:", path.basename(filePath));
console.log("Extension:", path.extname(filePath));
console.log("Folder:", path.dirname(filePath));