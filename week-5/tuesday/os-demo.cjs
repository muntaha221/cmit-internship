const os = require("os");

console.log("Operating system:", os.platform());
console.log("CPU architecture:", os.arch());
console.log("Number of CPUs:", os.cpus().length);
console.log("Home directory:", os.homedir());