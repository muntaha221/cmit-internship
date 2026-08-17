const http = require("http");

const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "application/json");

    if (req.method === "GET" && req.url === "/") {
        res.statusCode = 200;

        res.end(JSON.stringify({
            message: "Welcome to my API"
        }));

        return;
    }

    if (req.method === "GET" && req.url === "/users") {
        res.statusCode = 200;

        res.end(JSON.stringify([
            {
                id: 1,
                name: "Ali"
            },
            {
                id: 2,
                name: "Sara"
            }
        ]));

        return;
    }

    if (req.method === "POST" && req.url === "/users") {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                const user = JSON.parse(body);

                res.statusCode = 201;

                res.end(JSON.stringify({
                    message: "User created",
                    user: user
                }));
            } catch (error) {
                res.statusCode = 400;

                res.end(JSON.stringify({
                    message: "Invalid JSON"
                }));
            }
        });

        return;
    }

    res.statusCode = 404;

    res.end(JSON.stringify({
        message: "Route not found"
    }));
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});