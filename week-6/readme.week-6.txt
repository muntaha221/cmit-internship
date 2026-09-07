# Week 6 — Express.js and REST API Development

## Overview

This week focused on building **structured REST APIs using Express.js**.

The main goal was to move from the low-level Node.js HTTP server learned in Week 5 to Express, where routing, middleware, request handling, validation, application structure, and error handling can be managed more cleanly.

Throughout the week, we built an **in-memory Users API** and gradually improved it from a simple single-file application into a structured API using:

* routes
* middleware
* controllers
* services
* validation
* centralized error handling
* Postman testing

---

## Week 6 Roadmap

### Monday — Express Setup and Routing

* Create an Express project and use nodemon.
* Create routers and route handlers.
* Use route parameters, query parameters and request bodies.
* Return consistent JSON responses.
* Create basic CRUD routes for one resource.

### Tuesday — Middleware

* Understand middleware execution order.
* Use built-in and third-party middleware.
* Create request logging and request-timing middleware.
* Create middleware for validation checks.
* Understand application-level and router-level middleware.

### Wednesday — Controllers, Services and MVC

* Separate routes, controllers and services.
* Understand responsibilities of each layer.
* Create reusable service functions.
* Apply a clean folder structure.
* Refactor a single-file API into modules.

### Thursday — Validation and Error Handling

* Validate required fields and formats.
* Create custom error objects.
* Use centralized error-handling middleware.
* Handle 404 and async errors.
* Return appropriate status codes and messages.

### Friday — Weekly Exercises

* Build a complete in-memory CRUD API.
* Add custom middleware and request validation.
* Refactor the API into routes, controllers and services.
* Add centralized error handling.
* Test all success and failure cases in Postman.

---

# 1. Monday — Express Setup and Routing

## 1.1 What is Express?

Express is a **Node.js web framework**.

In Week 5, we created servers manually using Node's built-in `http` module.

For example:

```js
const http = require("http");

const server = http.createServer((req, res) => {
    res.end("Hello");
});

server.listen(3000);
```

With Express, common backend tasks become simpler:

```js
const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Hello");
});

app.listen(3000);
```

The basic idea is:

```text
Client
   ↓
HTTP Request
   ↓
Express
   ↓
Route / Middleware
   ↓
Response
   ↓
Client
```

Express handles much of the repetitive work involved in creating HTTP APIs.

---

## 1.2 Creating an Express Project

An Express project needs Node.js and npm.

A basic project can be initialized with:

```powershell
npm init -y
```

Then Express can be installed:

```powershell
npm install express
```

A basic application file:

```js
const express = require("express");

const app = express();

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

Run it with:

```powershell
node app.js
```

Expected output:

```text
Server running on port 3000
```

---

# 2. Express Application

The main Express application is created using:

```js
const app = express();
```

The `app` object is used to:

* register middleware
* create routes
* connect routers
* configure the application
* start the server

Example:

```js
const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Hello from Express"
    });
});

app.listen(3000);
```

---

# 3. Routing

A route defines how the server should respond to a particular HTTP request.

Example:

```js
app.get("/", (req, res) => {
    res.send("Home page");
});
```

The route contains:

```text
HTTP Method
+
URL Path
+
Route Handler
```

Example:

```js
app.get("/users", handler);
```

means:

```text
GET
+
/users
+
handler
```

---

## Common HTTP Methods

The main methods we used were:

```text
GET
→ retrieve data

POST
→ create data

PATCH
→ update data

DELETE
→ delete data
```

For example:

```js
app.get("/users", ...);
app.post("/users", ...);
app.patch("/users/:id", ...);
app.delete("/users/:id", ...);
```

These methods form the basis of CRUD APIs.

---

# 4. CRUD

CRUD means:

```text
Create
Read
Update
Delete
```

The usual HTTP mapping is:

```text
CRUD                HTTP Method
--------------------------------
Create              POST
Read all            GET
Read one            GET
Update              PATCH
Delete              DELETE
```

For users:

```text
POST    /users
GET     /users
GET     /users/:id
PATCH   /users/:id
DELETE  /users/:id
```

This became the main API resource used throughout Week 6.

---

# 5. In-Memory Data

Before connecting a real database, we stored users in a JavaScript array:

```js
let users = [
    {
        id: 1,
        name: "Ali",
        email: "ali@example.com"
    },
    {
        id: 2,
        name: "Sara",
        email: "sara@example.com"
    }
];
```

This is called **in-memory data** because the data exists only while the Node.js application is running.

```text
Server starts
    ↓
users array exists in memory
    ↓
Requests can modify it
    ↓
Server stops
    ↓
Data is lost
```

This was useful for learning API development before moving to MongoDB.

---

# 6. GET Routes

## Get All Users

```js
app.get("/users", (req, res) => {
    res.status(200).json({
        success: true,
        data: users
    });
});
```

Request:

```text
GET /users
```

The API returns all users.

---

## Get One User

```js
app.get("/users/:id", (req, res) => {
    const id = Number(req.params.id);

    const user = users.find((user) => user.id === id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    res.status(200).json({
        success: true,
        data: user
    });
});
```

Request:

```text
GET /users/1
```

The flow:

```text
/users/1
    ↓
:id = "1"
    ↓
req.params.id
    ↓
Number(...)
    ↓
find user
    ↓
return response
```

---

# 7. Route Parameters

A route parameter is a dynamic value inside a URL.

Example:

```js
/users/:id
```

The `:id` part changes depending on the request:

```text
/users/1
/users/2
/users/10
```

It is accessed through:

```js
req.params.id
```

Example:

```js
const id = Number(req.params.id);
```

The `Number()` conversion was necessary because route parameters arrive as strings.

---

# 8. Query Parameters

Query parameters provide additional information in the URL.

Example:

```text
/users?name=Ali
```

The value can be accessed using:

```js
req.query.name
```

Conceptually:

```text
/users?department=IT
        ↓
req.query.department
        ↓
"IT"
```

Query parameters are commonly used for:

* filtering
* searching
* sorting
* pagination

Example:

```text
/products?category=phones
/users?department=IT
/products?sort=price
```

---

# 9. Request Body

The request body is used to send data to the server.

For example, when creating a user:

```json
{
    "name": "Ahmed",
    "email": "ahmed@example.com"
}
```

Express needs this middleware:

```js
app.use(express.json());
```

This allows Express to parse JSON request bodies.

Then the data becomes available through:

```js
req.body
```

Example:

```js
const { name, email } = req.body;
```

The flow is:

```text
Client sends JSON
      ↓
express.json()
      ↓
req.body
      ↓
Route / Controller
```

---

# 10. POST — Create a User

Example:

```js
app.post("/users", (req, res) => {
    const { name, email } = req.body;

    const newUser = {
        id: users.length > 0
            ? Math.max(...users.map((user) => user.id)) + 1
            : 1,
        name,
        email
    };

    users.push(newUser);

    res.status(201).json({
        success: true,
        message: "User created successfully",
        data: newUser
    });
});
```

Request:

```text
POST /users
```

Body:

```json
{
    "name": "Ahmed",
    "email": "ahmed@example.com"
}
```

The flow:

```text
Request body
    ↓
req.body
    ↓
Create new user object
    ↓
Add to users array
    ↓
Return 201 response
```

---

# 11. PATCH — Update a User

`PATCH` updates an existing resource.

Example:

```js
app.patch("/users/:id", (req, res) => {
    const id = Number(req.params.id);

    const user = users.find((user) => user.id === id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    const { name, email } = req.body;

    if (name !== undefined) {
        user.name = name;
    }

    if (email !== undefined) {
        user.email = email;
    }

    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: user
    });
});
```

Request:

```text
PATCH /users/1
```

The API:

```text
finds user
    ↓
checks whether user exists
    ↓
updates provided fields
    ↓
returns updated user
```

---

# 12. DELETE — Delete a User

Example:

```js
app.delete("/users/:id", (req, res) => {
    const id = Number(req.params.id);

    const userIndex = users.findIndex(
        (user) => user.id === id
    );

    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    const deletedUser = users.splice(userIndex, 1)[0];

    res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: deletedUser
    });
});
```

Request:

```text
DELETE /users/1
```

The flow:

```text
Get ID
   ↓
Find user index
   ↓
User exists?
   ↓
splice()
   ↓
Return deleted user
```

---

# 13. Consistent JSON Responses

We used a consistent response structure.

Success example:

```js
{
    success: true,
    data: users
}
```

Another success response:

```js
{
    success: true,
    message: "User created successfully",
    data: newUser
}
```

Failure example:

```js
{
    success: false,
    message: "User not found"
}
```

This makes APIs easier for frontend applications to consume.

Instead of random response formats:

```text
sometimes array
sometimes text
sometimes object
```

the API follows a predictable structure.

---

# 14. Tuesday — Middleware

Middleware is a function that runs during the request-response cycle.

Basic structure:

```js
function middleware(req, res, next) {
    // do something

    next();
}
```

The three main parameters are:

```text
req
→ request object

res
→ response object

next
→ continue to the next middleware or handler
```

---

# 15. Middleware Execution Order

Middleware runs in the order Express encounters it.

Example:

```js
app.use((req, res, next) => {
    console.log("Middleware 1");
    next();
});

app.use((req, res, next) => {
    console.log("Middleware 2");
    next();
});

app.get("/", (req, res) => {
    console.log("Route handler");

    res.json({
        success: true
    });
});
```

For a request to `/`, the order is:

```text
Middleware 1
    ↓
Middleware 2
    ↓
Route handler
```

This is why the position of middleware matters.

---

# 16. The `next()` Function

`next()` tells Express:

> This middleware has finished its work. Continue processing the request.

Example:

```js
function requestLogger(req, res, next) {
    console.log(`${req.method} ${req.url}`);

    next();
}
```

Flow:

```text
Request
   ↓
requestLogger
   ↓
next()
   ↓
Next middleware or route
```

If middleware sends a response and does not call `next()`, the normal request flow stops.

Example:

```js
if (!allowed) {
    return res.status(403).json({
        message: "Access denied"
    });
}
```

---

# 17. Custom Request Logging Middleware

We created:

```js
function requestLogger(req, res, next) {
    console.log(`${req.method} ${req.url}`);
    next();
}
```

Then registered it:

```js
app.use(requestLogger);
```

For:

```text
GET /users
```

the terminal can log:

```text
GET /users
```

For:

```text
POST /users
```

it can log:

```text
POST /users
```

The middleware flow is:

```text
Request
   ↓
requestLogger
   ↓
Log method + URL
   ↓
next()
   ↓
Route
```

---

# 18. Built-in Middleware

Express provides built-in middleware.

We used:

```js
app.use(express.json());
```

Its job is to parse JSON request bodies.

We also worked with:

```js
app.use(express.urlencoded({ extended: true }));
```

This handles URL-encoded request data.

The general idea:

```text
Incoming request data
        ↓
Express middleware parses it
        ↓
Data becomes available to application
```

---

# 19. Third-Party Middleware

Middleware can also come from external npm packages.

We used `morgan`.

Install:

```powershell
npm install morgan
```

Use:

```js
const morgan = require("morgan");

app.use(morgan("dev"));
```

`morgan` logs HTTP requests.

This demonstrated the difference between:

```text
Built-in middleware
→ provided by Express

Third-party middleware
→ installed from npm

Custom middleware
→ written by us
```

---

# 20. Validation Middleware

We created middleware to validate incoming user data.

Example:

```js
function validateUser(req, res, next) {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            success: false,
            message: "Name and email are required"
        });
    }

    next();
}
```

Then attached it before a route:

```js
app.post("/users", validateUser, (req, res) => {
    // create user
});
```

The flow:

```text
POST /users
    ↓
validateUser
    ↓
Valid?
 ┌──────┴──────┐
 No            Yes
 ↓             ↓
400 Response   next()
                  ↓
             Route handler
```

This prevents invalid data from reaching the main application logic.

---

# 21. Application-Level Middleware

Application-level middleware is registered on the main `app`.

Example:

```js
app.use(requestLogger);
```

It can run for requests handled by the application.

Example flow:

```text
Request
   ↓
app-level middleware
   ↓
Router / Route
```

We used this approach for request logging.

---

# 22. Router-Level Middleware

Middleware can also be attached to a router.

Conceptually:

```js
router.use(someMiddleware);
```

That middleware affects requests passing through that router.

Example:

```text
/users router
    ↓
router middleware
    ↓
users routes
```

This is useful when middleware should apply only to one group of routes instead of the entire application.

---

# 23. Wednesday — Controllers, Services and MVC

As an API grows, putting everything in one `app.js` becomes difficult to manage.

Our original structure was conceptually:

```text
app.js
├── routes
├── business logic
├── data operations
├── validation
└── responses
```

We refactored it into separate layers.

---

# 24. Routes

Routes decide which controller should handle a request.

Example:

```js
const express = require("express");
const usersController = require("../controllers/users.controller");

const router = express.Router();

router.get("/", usersController.getAllUsers);
router.get("/:id", usersController.getUserById);
router.post("/", usersController.createUser);
router.patch("/:id", usersController.updateUser);
router.delete("/:id", usersController.deleteUser);

module.exports = router;
```

The router's responsibility is mainly:

```text
HTTP method + path
        ↓
Choose controller function
```

Routes should not contain all business logic.

---

# 25. Controllers

Controllers receive the request and coordinate the response.

Example:

```js
function getAllUsers(req, res) {
    const users = usersService.getAllUsers();

    res.status(200).json({
        success: true,
        data: users
    });
}
```

A controller typically:

* receives `req`
* gets route/body/parameter data
* calls a service
* decides the HTTP response

Conceptually:

```text
Request
   ↓
Controller
   ↓
Service
   ↓
Controller receives result
   ↓
HTTP Response
```

---

# 26. Services

Services contain reusable application logic and data operations.

Example:

```js
function getUserById(id) {
    return users.find((user) => user.id === id);
}
```

Another example:

```js
function createUser(name, email) {
    const newUser = {
        id: users.length > 0
            ? Math.max(...users.map((user) => user.id)) + 1
            : 1,
        name,
        email
    };

    users.push(newUser);

    return newUser;
}
```

The service is responsible for work such as:

* finding users
* creating users
* updating users
* deleting users

---

# 27. Routes → Controllers → Services

The architecture we practiced was:

```text
Client
   ↓
Route
   ↓
Controller
   ↓
Service
   ↓
Data
```

Then back:

```text
Data result
   ↓
Service
   ↓
Controller
   ↓
JSON Response
   ↓
Client
```

Example:

```text
GET /users/1
      ↓
users.route.js
      ↓
getUserById controller
      ↓
getUserById service
      ↓
find user
      ↓
return user
      ↓
controller sends JSON
```

---

# 28. Clean Folder Structure

Our API was organized conceptually like this:

```text
friday/
├── app.js
├── routes/
│   └── users.route.js
├── controllers/
│   └── users.controller.js
├── services/
│   └── users.service.js
└── middlewares/
    └── error.middleware.js
```

Each folder has a different responsibility.

```text
routes
→ request paths

controllers
→ request/response handling

services
→ reusable application logic

middlewares
→ processing between request and response

app.js
→ application setup and connections
```

---

# 29. Refactoring a Single-File API

The original API could work inside one file:

```text
app.js
```

But as the application grows, this becomes harder to maintain.

We refactored:

```text
Single app.js
     ↓
Separate responsibilities
     ↓
Routes
Controllers
Services
Middlewares
```

This improves:

* readability
* maintainability
* reusability
* separation of concerns

---

# 30. Thursday — Validation and Error Handling

Validation checks whether incoming data is acceptable before the application performs an operation.

Example:

```js
if (!name || !email) {
    return res.status(400).json({
        success: false,
        message: "Name and email are required"
    });
}
```

The request is checked before creating or updating a user.

---

# 31. Status Codes

We used appropriate HTTP status codes.

Common examples:

```text
200
→ successful request

201
→ resource created successfully

400
→ invalid request

404
→ resource or route not found

500
→ internal server error
```

Examples:

```js
res.status(200)
res.status(201)
res.status(400)
res.status(404)
res.status(500)
```

Status codes allow the client to understand the result of a request.

---

# 32. Custom Error Objects

Instead of directly sending every error response from the controller, we created an error:

```js
const error = new Error("User not found");

error.statusCode = 404;
```

Then passed it to Express:

```js
next(error);
```

The flow:

```text
Problem occurs
    ↓
Create Error object
    ↓
Set statusCode
    ↓
next(error)
    ↓
Error middleware
```

This helped move error handling toward one central location.

---

# 33. Centralized Error Handling

We created an error-handling middleware:

```js
function errorHandler(err, req, res, next) {
    console.error(err);

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal server error"
    });
}

module.exports = errorHandler;
```

The four parameters are important:

```text
err
req
res
next
```

Express recognizes this as an error-handling middleware because of the error parameter structure.

---

## Connecting Error Middleware

In `app.js`:

```js
const errorHandler = require("./middlewares/error.middleware");
```

Then after routes:

```js
app.use(errorHandler);
```

The order matters.

Conceptually:

```text
Middleware
    ↓
Routes
    ↓
Error middleware
```

---

# 34. `next(error)`

When an error occurs:

```js
const error = new Error("User not found");

error.statusCode = 404;

return next(error);
```

The error is passed into Express's error-handling flow.

Conceptually:

```text
Controller
   ↓
Problem
   ↓
next(error)
   ↓
Centralized Error Middleware
   ↓
Error Response
```

For example:

```text
GET /users/999
```

can result in:

```json
{
    "success": false,
    "message": "User not found"
}
```

with status:

```text
404
```

---

# 35. 404 Handling

A `404` means the requested resource was not found.

Example:

```text
GET /users/999
```

If user `999` does not exist:

```text
Request
   ↓
Controller
   ↓
Service returns no user
   ↓
Create error
   ↓
404
   ↓
Error middleware
   ↓
JSON error response
```

---

# 36. Async Errors

Week 6 also introduced the requirement to understand async errors.

The important concept is that asynchronous operations can fail separately from normal synchronous execution.

For async operations, errors must eventually reach proper error handling.

Conceptually:

```text
Async operation
      ↓
Success
or
Failure
      ↓
Error handling
      ↓
Appropriate response
```

As APIs later connect to databases and external services, async error handling becomes especially important.

---

# 37. Friday — Complete In-Memory CRUD API

Friday combined the major Week 6 concepts.

We built a complete Users API with:

```text
GET all users
GET one user
POST user
PATCH user
DELETE user
```

The final API was structured around:

```text
Routes
   ↓
Controllers
   ↓
Services
   ↓
In-memory users array
```

with middleware and error handling around the request flow.

---

# 38. Final Request Flow

The main request flow became:

```text
Client Request
      ↓
Express
      ↓
Application Middleware
      ↓
Router
      ↓
Controller
      ↓
Service
      ↓
In-Memory Data
      ↓
Controller
      ↓
JSON Response
      ↓
Client
```

For errors:

```text
Client Request
      ↓
Route
      ↓
Controller
      ↓
Error occurs
      ↓
next(error)
      ↓
Centralized Error Middleware
      ↓
Error Response
```

---

# 39. Friday — Custom Middleware

We included custom request logging:

```js
function requestLogger(req, res, next) {
    console.log(`${req.method} ${req.url}`);
    next();
}
```

Registered with:

```js
app.use(requestLogger);
```

Every request passes through it before reaching the API routes.

Example:

```text
GET /users
```

Flow:

```text
Request
   ↓
requestLogger
   ↓
GET /users logged
   ↓
next()
   ↓
Users route
```

---

# 40. Friday — Request Validation

We created validation logic to check required user data.

Example:

```js
function validateUser(req, res, next) {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            success: false,
            message: "Name and email are required"
        });
    }

    next();
}
```

The purpose was to prevent invalid requests from reaching the main creation or update logic.

```text
Request
   ↓
Validation middleware
   ↓
Valid?
 ┌────┴────┐
 No        Yes
 ↓         ↓
400       next()
Response     ↓
          Controller
```

---

# 41. Friday — Complete API Structure

The final practical structure was:

```text
friday/
├── app.js
├── routes/
│   └── users.route.js
├── controllers/
│   └── users.controller.js
├── services/
│   └── users.service.js
└── middlewares/
    └── error.middleware.js
```

The responsibilities were:

### `app.js`

```text
Creates Express app
Registers middleware
Connects router
Connects error middleware
Starts server
```

### `users.route.js`

```text
Defines API paths
Connects paths to controllers
```

### `users.controller.js`

```text
Handles req/res
Calls services
Creates HTTP responses
Passes errors using next(error)
```

### `users.service.js`

```text
Contains reusable user operations
Works with in-memory users data
```

### `error.middleware.js`

```text
Receives errors
Chooses status code
Returns consistent error response
```

---

# 42. Postman Testing

We tested the API using Postman.

The main success cases included:

```text
GET /users
GET /users/:id
POST /users
PATCH /users/:id
DELETE /users/:id
```

We also tested failure cases.

Examples:

```text
GET /users/999
→ user not found

POST /users
with missing required fields
→ validation failure

PATCH /users/999
→ user not found

DELETE /users/999
→ user not found

Unknown route
→ failure/404 case
```

---

# 43. Success and Failure Testing

Testing only successful requests is not enough.

A complete API should be tested for:

```text
Valid request
    ↓
Expected success response

Invalid request
    ↓
Expected error response
```

For example:

### Success

```text
POST /users
```

Body:

```json
{
    "name": "Ahmed",
    "email": "ahmed@example.com"
}
```

Expected:

```text
201 Created
```

### Failure

```text
POST /users
```

Body:

```json
{
    "name": "Ahmed"
}
```

Expected:

```text
400 Bad Request
```

because required data is missing.

---

# 44. Common Troubleshooting Lessons

## MODULE_NOT_FOUND

During the Week 6 practical work, we encountered errors such as:

```text
MODULE_NOT_FOUND
```

This means Node cannot find the file at the specified path.

Example:

```js
require("./routes/users.route");
```

The actual structure must match:

```text
routes/
└── users.route.js
```

Check:

1. Does the file exist?
2. Is the filename correct?
3. Is the folder name correct?
4. Is the relative path correct?

---

## Filename Consistency

A path such as:

```text
users.route.js
```

is different from:

```text
users.routes.js
```

The import must match the actual file.

For example:

```js
const usersRouter = require("./routes/users.route");
```

must point to the actual:

```text
users.route.js
```

Consistency in naming prevents module path errors.

---

## Middleware File Path Errors

For:

```js
const errorHandler = require("./middlewares/error.middleware");
```

Node expects:

```text
middlewares/
└── error.middleware.js
```

If the file or folder has a different name, Node will return:

```text
MODULE_NOT_FOUND
```

---

# 45. Week 6 Practical Workflow

The overall development approach used during the week was:

```text
Start with simple Express API
    ↓
Create CRUD routes
    ↓
Test requests
    ↓
Add middleware
    ↓
Understand execution order
    ↓
Add validation
    ↓
Separate routes/controllers/services
    ↓
Add centralized error handling
    ↓
Test success and failure cases
```

The API gradually evolved instead of starting with a complicated structure immediately.

---

# 46. Week 6 Final Revision

## Monday

* Express is a Node.js web framework.
* `express()` creates an application.
* `app.listen()` starts the server.
* Routes connect HTTP methods and paths to handlers.
* CRUD means Create, Read, Update and Delete.
* `GET` retrieves data.
* `POST` creates data.
* `PATCH` updates data.
* `DELETE` removes data.
* Route parameters use syntax like `/:id`.
* Route parameters are available through `req.params`.
* Query parameters are available through `req.query`.
* Request bodies are available through `req.body`.
* `express.json()` parses JSON request bodies.
* APIs should return consistent JSON responses.
* An in-memory array can be used before connecting a database.

## Tuesday

* Middleware runs during the request-response cycle.
* Middleware receives `req`, `res` and `next`.
* Middleware execution order matters.
* `next()` continues to the next middleware or route.
* `express.json()` is built-in middleware.
* `express.urlencoded()` handles URL-encoded data.
* Third-party middleware can be installed with npm.
* `morgan` is an example of third-party request logging middleware.
* Custom middleware can be written manually.
* Request logging can record method and URL.
* Validation middleware checks requests before route logic.
* Application-level middleware is registered on `app`.
* Router-level middleware applies to a router.

## Wednesday

* Large APIs should separate responsibilities.
* Routes decide which controller handles a request.
* Controllers handle request/response logic.
* Services contain reusable application or data logic.
* Routes should not contain all business logic.
* Controllers call services.
* Services return results.
* Controllers create HTTP responses.
* A clean structure can use routes, controllers, services and middlewares.
* Refactoring separates a single-file API into modules.

## Thursday

* Validation checks incoming data.
* Required fields should be checked before processing requests.
* Error objects can be created with `new Error()`.
* Custom properties such as `statusCode` can be attached to errors.
* `next(error)` passes errors into Express error handling.
* Error middleware uses `err, req, res, next`.
* Centralized error handling avoids repeating error response logic.
* `404` means a resource or requested route was not found.
* `400` represents a bad request.
* `500` represents an internal server error.
* Async operations can also produce errors that require proper handling.
* APIs should return appropriate status codes and messages.

## Friday

* A complete in-memory CRUD API was built.
* The API supported GET, POST, PATCH and DELETE operations.
* Custom request logging middleware was added.
* Request validation was added.
* The API was refactored into routes, controllers and services.
* A centralized error middleware was added.
* Errors could be passed using `next(error)`.
* Success cases were tested in Postman.
* Failure cases were also tested in Postman.
* The final request flow connected middleware, routes, controllers, services and responses.
* The Week 6 API structure prepared the backend for the next step: replacing in-memory data with a real MongoDB database.
