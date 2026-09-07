const http = require("http");

const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "application/json");

    if (req.method === "GET" && req.url === "/") {
        res.statusCode = 200;

        res.end(JSON.stringify({
            message: "Home route"
        }));

        return;
    }

    if (req.method === "GET" && req.url === "/users") {
        res.statusCode = 200;

        res.end(JSON.stringify([
            { id: 1, name: "Ali" },
            { id: 2, name: "Sara" }
        ]));

        return;
    }

    if (req.method === "GET" && req.url === "/products") {
        res.statusCode = 200;

        res.end(JSON.stringify([
            { id: 1, name: "Keyboard" },
            { id: 2, name: "Mouse" }
        ]));

        return;
    }

    if (req.method === "GET" && req.url === "/about") {
        res.statusCode = 200;

        res.end(JSON.stringify({
            message: "About this server"
        }));

        return;
    }

    if (req.method === "GET" && req.url === "/health") {
        res.statusCode = 200;

        res.end(JSON.stringify({
            status: "OK"
        }));

        return;
    }

    res.statusCode = 404;

    res.end(JSON.stringify({
        message: "Route not found"
    }));
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});