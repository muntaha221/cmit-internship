# Week 5 — Node.js Fundamentals

## Overview

This week focused on understanding **Node.js without using a framework**.

The main goal was to understand the Node.js runtime, npm, modules, Node core modules, asynchronous JavaScript, the event loop, the native HTTP module, and then combine those concepts into practical exercises.

## Week 5 Roadmap

### Monday — Runtime, npm and Modules
- Understand Node.js, V8 and server-side JavaScript.
- Create and run scripts with Node.
- Use npm, package.json, scripts and semantic versions.
- Use CommonJS and ES Modules.
- Create and import custom modules.
- Manage file structure.

### Tuesday — Core Modules
- Use `fs` for reading, writing, updating and deleting files.
- Use `path` for safe file paths.
- Use `os` and `process` for runtime information.
- Work with environment variables using `dotenv`.
- Create a file-based notes utility.

### Wednesday — Event Loop and Asynchronous Node
- Understand call stack, callback queue and event loop.
- Compare synchronous and asynchronous file operations.
- Use callbacks, promises and async/await in Node.
- Handle rejected promises and uncaught errors correctly.
- Observe execution order through small experiments.

### Thursday — Native HTTP Server
- Create a server using the built-in `http` module.
- Read method, URL, headers and request body.
- Return JSON responses and status codes.

### Friday — Weekly Exercises
- Build a CLI utility that reads and writes JSON data.
- Convert callback-based file operations to promises.
- Predict event-loop output for several code samples.
- Build a native Node server with at least five routes.
- Fix prepared bugs involving modules, paths and asynchronous code.

---

# 1. Monday — Runtime, npm and Modules

## 1.1 What is Node.js?

Node.js is a **JavaScript runtime**.

It is not:
- a programming language
- a framework

JavaScript is the language, and Node.js provides an environment where JavaScript can run outside the browser.

### Browser vs Node.js

```text
Browser
   ↓
JavaScript runs inside the browser

Node.js
   ↓
JavaScript runs outside the browser
```

Node.js allows JavaScript to perform server-side and system-level tasks such as:
- reading and writing files
- creating servers
- working with modules
- working with environment variables
- interacting with operating-system information

---

## 1.2 V8

Node.js uses the **V8 JavaScript engine**.

The basic relationship is:

```text
JavaScript code
      ↓
Node.js runtime
      ↓
V8 engine
      ↓
JavaScript is executed
```

### Important distinction

```text
V8
→ executes JavaScript

Node.js
→ provides a runtime environment around V8
```

Node.js adds APIs and runtime capabilities that allow JavaScript to interact with the operating system and build backend programs.

---

## 1.3 Node.js REPL

REPL means:

```text
Read
Evaluate
Print
Loop
```

We opened the Node REPL using:

```powershell
node
```

Useful REPL commands included:

```text
.help
.exit
```

The REPL is useful for quickly testing JavaScript expressions and Node behavior.

---

## 1.4 Running Node.js scripts

A JavaScript file can be executed with:

```powershell
node app.js
```

Example:

```js
console.log("Hello from Node.js");
```

Then:

```powershell
node app.js
```

prints:

```text
Hello from Node.js
```

This is the basic Node.js workflow:

```text
Create .js file
    ↓
Write JavaScript
    ↓
Run with node
    ↓
See terminal output
```

---

# 2. npm and package.json

## 2.1 npm

npm is Node's package manager.

It is used to:
- initialize projects
- install packages
- manage dependencies
- define npm scripts

We initialized the project with:

```powershell
npm init -y
```

That created:

```text
package.json
```

---

## 2.2 package.json

A Node project can contain information such as:

```json
{
  "name": "week5",
  "version": "1.0.0",
  "description": "",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "type": "commonjs"
}
```

Important fields:

### name

```json
"name": "week5"
```

The project name.

### version

```json
"version": "1.0.0"
```

The current project version.

### main

```json
"main": "app.js"
```

The main entry file.

### scripts

```json
"scripts": {
  "start": "node app.js"
}
```

This allows:

```powershell
npm start
```

instead of:

```powershell
node app.js
```

---

# 3. Semantic Versioning

Version numbers commonly follow:

```text
MAJOR.MINOR.PATCH
```

Example:

```text
1.0.0
│ │ │
│ │ └── PATCH
│ └──── MINOR
└────── MAJOR
```

Basic meaning:

- PATCH → bug fixes or small corrections.
- MINOR → new backwards-compatible features.
- MAJOR → potentially breaking changes.

Example progression:

```text
1.0.0 → 1.0.1
```

small fix.

```text
1.0.1 → 1.1.0
```

new feature.

```text
1.1.0 → 2.0.0
```

breaking change.

We also encountered package versions such as:

```text
dotenv ^17.4.2
```

The `^` is a version range rule used by npm for compatible updates.

---

# 4. CommonJS

CommonJS is one of Node.js's module systems.

Example:

```js
const fs = require("fs");
```

Exporting from a custom file:

```js
module.exports = add;
```

Importing:

```js
const add = require("./math");
```

We practiced this using:

```text
math.js
app.js
```

### math.js

```js
function add(a, b) {
    return a + b;
}

module.exports = add;
```

### app.js

```js
const add = require("./math");

const result = add(10, 5);

console.log(result);
```

Output:

```text
15
```

Flow:

```text
math.js
  ↓
module.exports
  ↓
app.js
  ↓
require()
  ↓
add()
```

---

# 5. ES Modules

The second module system is ES Modules.

It uses:

```js
export
import
```

Example:

### math.mjs

```js
export function add(a, b) {
    return a + b;
}
```

### app.mjs

```js
import { add } from "./math.mjs";

const result = add(10, 5);

console.log(result);
```

Run:

```powershell
node app.mjs
```

Output:

```text
15
```

---

## CommonJS vs ES Modules

```text
CommonJS
require()
module.exports

ES Modules
import
export
```

We also learned that `.mjs` explicitly marks a file as an ES Module.

The project can also use:

```json
"type": "module"
```

to make `.js` files behave as ES Modules.

---

# 6. File Structure

A project can be organized into separate files rather than putting everything into one file.

Example:

```text
week5/
├── app.js
├── hello.js
├── math.js
├── math.mjs
├── app.mjs
└── package.json
```

The idea is to keep related logic together and make files easier to understand.

---

# 7. Tuesday — Core Modules

# 7.1 fs module

`fs` means **File System**.

Node provides it so programs can work with files.

We practiced four main operations:

```text
read
write
append/update
delete
```

---

## Reading files

Example:

```js
const fs = require("fs");

fs.readFile("data.txt", "utf8", function (err, data) {
    if (err) {
        console.log(err);
        return;
    }

    console.log(data);
});
```

### What happens?

```text
fs.readFile()
    ↓
Node reads the file
    ↓
callback receives the result
```

---

## Writing files

```js
const fs = require("fs");

fs.writeFile("notes.txt", "This is my first note.", function (err) {
    if (err) {
        console.log(err);
        return;
    }

    console.log("File written successfully");
});
```

`writeFile()`:
- creates the file if it does not exist
- replaces existing contents if it already exists

---

## Appending/updating

```js
const fs = require("fs");

fs.appendFile("notes.txt", "\nThis is another note.", function (err) {
    if (err) {
        console.log(err);
        return;
    }

    console.log("Note added successfully");
});
```

`appendFile()`:
- keeps existing content
- adds new content

---

## Deleting files

```js
const fs = require("fs");

fs.unlink("notes.txt", function (err) {
    if (err) {
        console.log(err);
        return;
    }

    console.log("File deleted successfully");
});
```

`unlink()` deletes the specified file.

---

## fs summary

```text
readFile()
→ read

writeFile()
→ create/overwrite

appendFile()
→ add content

unlink()
→ delete
```

---

# 8. path module

The `path` module helps create safe file/folder paths.

Instead of manually writing paths, use:

```js
const path = require("path");

const filePath = path.join("tuesday", "notes.txt");

console.log(filePath);
```

On Windows this produced:

```text
tuesday\notes.txt
```

---

## Useful path functions

### path.join()

Safely joins path pieces:

```js
path.join("tuesday", "notes.txt");
```

### __dirname

Represents the directory of the current file in CommonJS contexts.

Example:

```js
const path = require("path");

const filePath = path.join(__dirname, "notes.txt");
```

### path.basename()

Gets the filename:

```js
path.basename(filePath);
```

Result:

```text
notes.txt
```

### path.extname()

Gets the extension:

```js
path.extname(filePath);
```

Result:

```text
.txt
```

### path.dirname()

Gets the directory portion:

```js
path.dirname(filePath);
```

---

# 9. os module

The `os` module provides information about the computer/operating system.

Example:

```js
const os = require("os");

console.log("Operating system:", os.platform());
console.log("CPU architecture:", os.arch());
console.log("Number of CPUs:", os.cpus().length);
console.log("Home directory:", os.homedir());
```

Useful functions:

```text
os.platform()
→ platform/OS

os.arch()
→ architecture

os.cpus()
→ CPU information

os.homedir()
→ user's home directory
```

---

# 10. process

`process` is available globally in Node.js.

Example:

```js
console.log("Node version:", process.version);
console.log("Platform:", process.platform);
console.log("Current folder:", process.cwd());
```

Useful concepts:

```text
process.version
→ Node version

process.platform
→ current platform

process.cwd()
→ current working directory
```

The larger Node process API also exposes information such as:
- environment variables
- command-line arguments
- process ID
- uptime
- process events

---

# 11. Environment Variables with dotenv

Environment variables store configuration outside the main JavaScript source.

We installed dotenv using:

```powershell
npm install dotenv
```

Created:

```text
.env
```

Example:

```text
APP_NAME=My Notes App
PORT=3000
```

Then loaded it:

```js
import dotenv from "dotenv";

dotenv.config();

console.log("App name:", process.env.APP_NAME);
console.log("Port:", process.env.PORT);
```

Output:

```text
App name: My Notes App
Port: 3000
```

Flow:

```text
.env
 ↓
dotenv.config()
 ↓
process.env
 ↓
application
```

---

# 12. File-based notes utility

We combined `fs` and `path` to create a small notes utility.

Example:

```js
import fs from "fs";
import path from "path";

const notesFile = path.join(process.cwd(), "notes.txt");

function addNote(note) {
    fs.appendFileSync(notesFile, note + "\n");
    console.log("Note added");
}

function showNotes() {
    const notes = fs.readFileSync(notesFile, "utf8");
    console.log(notes);
}

addNote("Learn Node.js fs module");
addNote("Learn Node.js path module");

showNotes();
```

The basic flow:

```text
addNote()
    ↓
appendFileSync()
    ↓
notes.txt

showNotes()
    ↓
readFileSync()
    ↓
notes.txt
    ↓
console.log()
```

This demonstrated how a simple application can store information in a file.

---

# 13. Wednesday — Event Loop and Asynchronous Node

# 13.1 Call Stack

The call stack keeps track of functions currently executing.

Example:

```js
function first() {
    console.log("Inside first");
}

function second() {
    console.log("Inside second");
    first();
    console.log("Back inside second");
}

console.log("Start");

second();

console.log("End");
```

Output:

```text
Start
Inside second
Inside first
Back inside second
End
```

The flow is:

```text
second()
   ↓
first()
   ↓
first() finishes
   ↓
second() continues
```

The call stack follows a last-in-first-out idea.

---

# 14. Callback Queue

Asynchronous callbacks can become ready to run after their asynchronous work finishes.

A simplified model is:

```text
Call Stack
    ↓
currently executing JavaScript

Callback Queue
    ↓
ready callbacks waiting to execute
```

---

# 15. Event Loop

The event loop coordinates asynchronous work and callback execution.

Example:

```js
console.log("Start");

setTimeout(() => {
    console.log("Timeout");
}, 0);

console.log("End");
```

Output:

```text
Start
End
Timeout
```

Even with `0` milliseconds, the timeout callback does not interrupt the current synchronous JavaScript.

The idea is:

```text
Synchronous code
    ↓
call stack completes
    ↓
ready asynchronous callback
    ↓
event loop allows callback to run
```

---

# 16. Execution Order Experiment

We tested code like:

```js
console.log("1");

setTimeout(() => {
    console.log("2");
}, 0);

console.log("3");

setTimeout(() => {
    console.log("4");
}, 0);

console.log("5");
```

The normal timer experiment produced the synchronous output first:

```text
1
3
5
```

and the timer callbacks afterward:

```text
2
4
```

We also experimented with Promise callbacks, where Promise callbacks can run before timer callbacks in the simplified model we practiced:

```text
Synchronous code
    ↓
Promise callbacks
    ↓
Timer callbacks
```

---

# 17. Synchronous vs Asynchronous File Operations

## Synchronous

```js
const fs = require("fs");

console.log("1");

const data = fs.readFileSync("data.txt", "utf8");

console.log("2");
console.log(data);

console.log("3");
```

The program waits for the file read to finish before continuing.

Conceptually:

```text
1
↓
read file
↓
wait
↓
2
↓
data
↓
3
```

---

## Asynchronous

```js
const fs = require("fs");

console.log("1");

fs.readFile("data.txt", "utf8", (error, data) => {
    if (error) {
        console.log("Error:", error.message);
        return;
    }

    console.log("2");
    console.log(data);
});

console.log("3");
```

The main JavaScript continues while the file operation is in progress.

Typical order:

```text
1
3
2
file content
```

The key idea:

```text
Sync
→ wait/block the current flow

Async
→ start operation and continue
```

---

# 18. Callbacks

A callback is a function passed to another function so it can be called later.

Example:

```js
fs.readFile("data.txt", "utf8", function (err, data) {
    if (err) {
        console.log(err);
        return;
    }

    console.log(data);
});
```

The callback runs after the file operation completes.

---

# 19. Promises

A Promise represents an operation that can succeed or fail.

Example:

```js
const fs = require("fs").promises;

fs.readFile("data.txt", "utf8")
    .then(function (data) {
        console.log(data);
    })
    .catch(function (error) {
        console.log("Error:", error.message);
    });
```

`then()` handles success.

`catch()` handles failure.

---

# 20. async/await

The same Promise-based work can be written with `async/await`:

```js
const fs = require("fs").promises;

async function readData() {
    try {
        const data = await fs.readFile("data.txt", "utf8");

        console.log(data);
    } catch (error) {
        console.log("Error:", error.message);
    }
}

readData();
```

Important:

```text
async
→ marks function as asynchronous

await
→ wait for a Promise inside that async function
```

`await` does not mean the entire Node program freezes.

---

# 21. Handling rejected Promises

A rejected Promise means an asynchronous operation failed.

Example:

```js
function getData() {
    return Promise.reject(new Error("Something went wrong"));
}

getData()
    .then(function (data) {
        console.log("Success:", data);
    })
    .catch(function (error) {
        console.log("Error:", error.message);
    });
```

The error is handled by:

```js
.catch(...)
```

---

# 22. Handling async errors with try/catch

```js
async function getData() {
    throw new Error("Something went wrong");
}

async function main() {
    try {
        const data = await getData();
        console.log(data);
    } catch (error) {
        console.log("Error:", error.message);
    }
}

main();
```

The `try` block contains code that might fail.

The `catch` block handles the failure.

---

# 23. Unhandled/uncaught errors

If a Promise rejects or an asynchronous error occurs and there is no error handler, Node can report an unhandled failure.

Example pattern:

```js
async function getData() {
    throw new Error("Something went wrong");
}

async function main() {
    const data = await getData();
    console.log(data);
}

main();
```

The lesson is:

```text
Expected failure
    ↓
handle it with catch or try/catch
```

rather than allowing an unhandled failure.

---

# 24. Thursday — Native HTTP Server

Node's built-in `http` module can create a server without Express.

Basic server:

```js
const http = require("http");

const server = http.createServer((req, res) => {
    res.end("Hello from Node HTTP Server");
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
```

The basic flow is:

```text
Client
   ↓
HTTP request
   ↓
Node HTTP server
   ↓
Your code
   ↓
HTTP response
   ↓
Client
```

---

# 25. Request method and URL

Inside the server:

```js
console.log("Method:", req.method);
console.log("URL:", req.url);
```

For example:

```text
GET /users
```

can produce:

```text
Method: GET
URL: /users
```

Common methods:

```text
GET
POST
PATCH
DELETE
```

---

# 26. Request headers

Headers can be inspected using:

```js
req.headers
```

Example:

```js
console.log(req.headers);
```

A specific header can be read:

```js
console.log(req.headers["user-agent"]);
```

---

# 27. Request body

Request bodies can arrive in chunks.

Example:

```js
const http = require("http");

const server = http.createServer((req, res) => {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk;
    });

    req.on("end", () => {
        console.log("Body:", body);

        res.end("Request received");
    });
});

server.listen(3000, () => {
    console.log("Server running");
});
```

The idea is:

```text
data event
→ collect chunks

end event
→ entire body has arrived
```

---

# 28. JSON request body

If the request body is JSON:

```json
{
  "name": "Ali"
}
```

it arrives as text first.

It can be converted into a JavaScript object using:

```js
const data = JSON.parse(body);
```

Then:

```js
data.name
```

can be used.

`JSON.parse()` can throw an error for invalid JSON, so real code should use error handling.

---

# 29. JSON responses

Set the content type:

```js
res.setHeader("Content-Type", "application/json");
```

Then send JSON text:

```js
res.end(JSON.stringify({
    message: "Hello from Node.js",
    success: true
}));
```

`JSON.stringify()` converts a JavaScript object into JSON text.

---

# 30. Status codes

Status codes communicate the result of the request.

Common examples:

```text
200 → success
201 → created
400 → bad request
404 → not found
500 → server error
```

Set one using:

```js
res.statusCode = 200;
```

---

# 31. Native HTTP API with multiple routes

We created a native Node server with multiple routes.

Example pattern:

```js
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

    res.statusCode = 404;

    res.end(JSON.stringify({
        message: "Route not found"
    }));
});

server.listen(3000);
```

The server checks:

```text
req.method
req.url
```

and decides which response to return.

---

# 32. Friday — CLI Utility

A CLI is a **Command Line Interface**.

We created a JSON-based CLI utility using:

```text
process.argv
fs.readFileSync()
JSON.parse()
JSON.stringify()
fs.writeFileSync()
```

Example commands:

```powershell
node cli.js list
node cli.js add Ali
```

---

## CLI arguments

For:

```powershell
node cli.js add Ali
```

the useful values include:

```text
process.argv[2] → add
process.argv[3] → Ali
```

The flow is:

```text
terminal command
    ↓
process.argv
    ↓
command logic
    ↓
read JSON
    ↓
modify JavaScript data
    ↓
write JSON
```

---

# 33. Callback to Promise Conversion

Callback style:

```js
const fs = require("fs");

fs.readFile("data.txt", "utf8", (error, data) => {
    if (error) {
        console.log(error.message);
        return;
    }

    console.log(data);
});
```

Promise style:

```js
const fs = require("fs").promises;

fs.readFile("data.txt", "utf8")
    .then((data) => {
        console.log(data);
    })
    .catch((error) => {
        console.log("Error:", error.message);
    });
```

async/await style:

```js
const fs = require("fs").promises;

async function readData() {
    try {
        const data = await fs.readFile("data.txt", "utf8");

        console.log(data);
    } catch (error) {
        console.log("Error:", error.message);
    }
}

readData();
```

These approaches perform the same general operation, but with different asynchronous styles.

---

# 34. Event-loop prediction

We practiced predicting execution order.

Example:

```js
console.log("A");

setTimeout(() => {
    console.log("B");
}, 0);

Promise.resolve().then(() => {
    console.log("C");
});

console.log("D");
```

The simplified order practiced in this week is:

```text
A
D
C
B
```

Reason:

```text
synchronous code
    ↓
Promise callback
    ↓
timer callback
```

Another example:

```js
console.log("1");

setTimeout(() => {
    console.log("2");
}, 0);

setTimeout(() => {
    console.log("3");
}, 0);

Promise.resolve().then(() => {
    console.log("4");
});

console.log("5");
```

Expected:

```text
1
5
4
2
3
```

The key is to identify:
- synchronous work
- Promise callbacks
- timers

---

# 35. Native server with five routes

The Friday exercise also included a native server with at least five routes.

Example:

```text
GET /
GET /users
GET /products
GET /about
GET /health
```

Each route can return JSON using Node's built-in HTTP module.

The idea is:

```text
one server
    ↓
multiple method + URL combinations
    ↓
different responses
```

---

# 36. Bug fixing

We practiced three types of common Node.js bugs.

## Module bug

CommonJS:

```js
const fs = require("fs");
```

ES Modules:

```js
import fs from "fs";
```

Do not mix module systems incorrectly.

Project configuration such as:

```json
"type": "module"
```

changes how `.js` files are interpreted.

---

## Path bug

If a file cannot be found, use Node's `path` module instead of manually guessing paths.

Example:

```js
const path = require("path");

const filePath = path.join(__dirname, "data.txt");
```

---

## Async timing bug

Incorrect:

```js
let data;

fs.readFile("data.txt", "utf8", (error, result) => {
    data = result;
});

console.log(data);
```

`console.log()` can run before the asynchronous read is finished.

Correct:

```js
fs.readFile("data.txt", "utf8", (error, data) => {
    if (error) {
        console.log(error.message);
        return;
    }

    console.log(data);
});
```

The key lesson is:

```text
Do not use asynchronous data before the asynchronous operation is finished.
```

---

# 37. PowerShell Note

During Week 5, we encountered a PowerShell issue with:

```powershell
npm init -y && npm pkg set type=module
```

In the PowerShell version being used, `&&` was rejected as a statement separator.

The commands were therefore run separately:

```powershell
npm init -y
```

then:

```powershell
npm pkg set type=module
```

This is a shell syntax issue, not a Node.js problem.

---

# 38. Common Troubleshooting Lessons

## MODULE_NOT_FOUND

If Node says:

```text
MODULE_NOT_FOUND
```

check:

1. Does the file actually exist?
2. Is the filename correct?
3. Is the path correct?
4. Are you running the command from the expected folder?
5. Is the file extension correct?

Example:

```text
users.service.js
```

is different from:

```text
users.services.js
```

---

## ENOENT

If `fs` gives:

```text
ENOENT
```

it commonly means the specified file or directory cannot be found.

Check the path and current working directory.

Useful command:

```powershell
dir
```

or:

```powershell
dir .\services
```

---

# 39. Week 5 Practical Workflow

The overall development approach used during the week was:

```text
Read the roadmap bullet
    ↓
Understand the concept
    ↓
Create a small file/experiment
    ↓
Run it
    ↓
Observe output
    ↓
Understand why output happened
    ↓
Move to next concept
```

This was especially important for:
- event loop experiments
- synchronous vs asynchronous I/O
- callbacks
- Promises
- async/await
- native HTTP routing

---

# 40. Week 5 Final Revision

## Monday

- Node.js is a JavaScript runtime.
- Node.js uses V8.
- Node can execute JavaScript outside the browser.
- npm manages Node projects/packages.
- `package.json` stores project metadata and scripts.
- `npm start` can run an npm script.
- Semantic versioning uses `MAJOR.MINOR.PATCH`.
- CommonJS uses `require()` and `module.exports`.
- ES Modules use `import` and `export`.
- `.mjs` explicitly represents an ES Module.
- Project structure matters.

## Tuesday

- `fs` handles files.
- `readFile()` reads.
- `writeFile()` writes/overwrites.
- `appendFile()` adds content.
- `unlink()` deletes.
- `path` handles file paths safely.
- `os` provides system information.
- `process` provides runtime/process information.
- `dotenv` loads environment variables from `.env`.
- A file-based notes utility can combine `fs` and `path`.

## Wednesday

- The call stack executes JavaScript.
- The callback queue holds ready callbacks.
- The event loop coordinates asynchronous execution.
- `readFileSync()` blocks/waits.
- `readFile()` is asynchronous.
- Callbacks handle asynchronous results.
- Promises represent asynchronous success/failure.
- `.then()` handles success.
- `.catch()` handles rejection.
- `async/await` provides readable Promise-based flow.
- `try/catch` handles async errors.
- Execution order can be studied experimentally.

## Thursday

- Node has a built-in `http` module.
- `http.createServer()` creates a server.
- `req.method` gives the HTTP method.
- `req.url` gives the URL/path.
- `req.headers` gives request headers.
- Request bodies can arrive in chunks.
- `data` collects chunks.
- `end` indicates the whole body has arrived.
- `JSON.parse()` converts JSON text to a JavaScript object.
- `JSON.stringify()` converts a JavaScript object to JSON text.
- `res.statusCode` controls the status code.
- JSON responses can be returned with `res.end()` plus a JSON string.

## Friday

- A CLI can use `process.argv`.
- JSON can be read with `fs`.
- JSON text can be converted with `JSON.parse()`.
- JavaScript data can be converted to JSON with `JSON.stringify()`.
- Callback file APIs can be converted to Promise-based APIs.
- Promise callbacks and timers have different execution timing.
- Native Node can support multiple routes.
- Common bugs include incorrect module syntax, wrong paths, and using async results too early.
