 Week 8 — Authentication, JWT & Protected Routes

## 🎯 Week Goal

The goal of Week 8 was to implement a secure authentication system using:

- User registration
- Password hashing with bcrypt
- Login and credential verification
- JWT access tokens
- Refresh tokens
- Authentication middleware
- Protected routes
- Token validation
- Invalid and expired token handling
- Logout and refresh-token revocation
- Complete authentication testing with Postman

By the end of this week, the application can identify users, authenticate them, issue tokens, protect private resources, refresh expired access tokens, and handle logout securely.

---

# 📅 Monday — User Registration & Password Hashing

## 1. Create a User Schema

Created a Mongoose user schema to represent users in MongoDB.

The schema contains fields such as:

- `name`
- `email`
- `password`

Example:

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },

        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
````

---

## 2. Validate Registration Input

Registration data must be checked before creating a user.

Required information:

```json
{
    "name": "Ali",
    "email": "ali@example.com",
    "password": "123456"
}
```

Validation should make sure:

* Name is provided.
* Email is provided.
* Password is provided.
* Email has a valid format.
* Password meets the application's minimum requirements.

Invalid input should return an appropriate `400 Bad Request` response.

Example:

```json
{
    "success": false,
    "message": "All fields are required"
}
```

---

## 3. Hash Passwords with bcrypt

Passwords must **never be stored as plain text**.

Instead:

```text
Plain Password
      ↓
    bcrypt
      ↓
Password Hash
      ↓
MongoDB
```

Example:

```js
const bcrypt = require("bcrypt");

const hashedPassword = await bcrypt.hash(password, 10);
```

The database stores something similar to:

```text
$2b$10$...
```

instead of:

```text
123456
```

### Why?

If the database is compromised, storing plain-text passwords would expose users' actual passwords.

Hashing provides a one-way transformation of the password.

---

## 4. Prevent Duplicate Email Registration

Before creating a new user, check whether the email already exists.

Example:

```js
const existingUser = await User.findOne({ email });

if (existingUser) {
    return res.status(409).json({
        success: false,
        message: "Email already registered"
    });
}
```

A user should not be able to create multiple accounts with the same email.

---

## 5. Never Return Passwords in API Responses

Even though the password hash is stored in MongoDB, it should not be returned to the client.

Instead of:

```json
{
    "name": "Ali",
    "email": "ali@example.com",
    "password": "$2b$10$..."
}
```

return:

```json
{
    "name": "Ali",
    "email": "ali@example.com"
}
```

The password field can also be excluded using:

```js
User.find().select("-password");
```

---

# 📅 Tuesday — Login & Access Tokens

## 1. Verify User Credentials

Created a login endpoint:

```text
POST /auth/login
```

The client sends:

```json
{
    "email": "ali@example.com",
    "password": "123456"
}
```

The server:

```text
Email + Password
       ↓
Find User
       ↓
Compare Password
       ↓
Credentials Correct?
    ↙           ↘
  No             Yes
  ↓               ↓
401             Create JWT
```

---

## 2. Compare Password with bcrypt

The stored password is a hash, so we cannot simply compare:

```js
password === user.password
```

Instead, bcrypt verifies the password:

```js
const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password
);
```

If the password is incorrect:

```json
{
    "success": false,
    "message": "Invalid email or password"
}
```

---

## 3. Create a JWT Access Token

After successful login, the server creates an access token.

Example:

```js
const jwt = require("jsonwebtoken");

const accessToken = jwt.sign(
    {
        userId: user._id,
        email: user.email
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "15m"
    }
);
```

The token contains information about the authenticated user.

Conceptually:

```text
JWT
├── Header
├── Payload
└── Signature
```

---

## 4. Understand the JWT Payload

Example payload:

```json
{
    "userId": "123456",
    "email": "ali@example.com"
}
```

The payload should contain only information needed for authentication.

Sensitive information such as the user's password should **never** be placed inside the JWT.

---

## 5. Use Environment Variables for Secrets

JWT secrets should not be hardcoded.

`.env`:

```env
JWT_SECRET=your_access_token_secret
```

Then:

```js
process.env.JWT_SECRET
```

is used by the application.

The `.env` file should not be committed to GitHub.

---

# 📅 Wednesday — Protected Routes

## 1. Read Bearer Token from Headers

Protected requests send the token through the `Authorization` header.

Example:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

The server reads:

```js
const authHeader = req.headers.authorization;
```

Then checks:

```js
authHeader.startsWith("Bearer ")
```

The actual token is extracted from the header.

---

## 2. Verify JWT in Middleware

Created authentication middleware.

Example:

```js
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Authorization header is required"
        });
    }

    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Authorization header must use Bearer token"
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access token is required"
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });

    }
}

module.exports = authMiddleware;
```

`jwt.verify()` checks whether:

* The token is valid.
* The token was signed using the correct secret.
* The token has not expired.

---

## 3. Attach Authenticated User to `req`

After verifying the token:

```js
req.user = decoded;
```

Now the authenticated user's information becomes available to the next middleware or route handler.

Example:

```js
app.get("/profile", authMiddleware, (req, res) => {

    res.json({
        success: true,
        user: req.user
    });

});
```

The route does not need to decode the token again.

---

## 4. Protect Private Routes

Authentication middleware can be placed before any private route.

Example:

```js
app.get("/profile", authMiddleware, (req, res) => {

    res.json({
        success: true,
        message: "Profile accessed",
        user: req.user
    });

});
```

Another protected route:

```js
app.get("/dashboard", authMiddleware, (req, res) => {

    res.json({
        success: true,
        message: "Dashboard accessed",
        user: req.user
    });

});
```

The request flow becomes:

```text
Client
  ↓
GET /profile
  ↓
authMiddleware
  ↓
Read Bearer Token
  ↓
Verify JWT
  ↓
Attach req.user
  ↓
next()
  ↓
Profile Route
```

---

## 5. Handle Authentication Errors

### Missing Token

```text
Authorization header is required
```

Response:

```text
401 Unauthorized
```

### Invalid Token

```text
Bearer abc123
```

Response:

```text
401 Unauthorized
```

### Expired Token

An expired access token is rejected by:

```js
jwt.verify()
```

Response:

```text
401 Unauthorized
```

The client can then use a valid refresh token to request a new access token.

---

# 📅 Friday — Weekly Authentication Exercises

## 1. Build Registration and Login Endpoints

The final application contains:

```text
POST /auth/register
POST /auth/login
```

### Registration Flow

```text
User
 ↓
POST /auth/register
 ↓
Validate input
 ↓
Check duplicate email
 ↓
Hash password
 ↓
Save user
 ↓
Return user without password
```

### Login Flow

```text
User
 ↓
POST /auth/login
 ↓
Find user
 ↓
Compare password
 ↓
Create tokens
 ↓
Return tokens
```

---

# 2. Create Access-Token and Refresh-Token Flow

The authentication system uses two different tokens.

## Access Token

The access token is used to access protected routes.

Example:

```http
Authorization: Bearer ACCESS_TOKEN
```

It should have a relatively short lifetime.

Example:

```env
ACCESS_TOKEN_EXPIRES_IN=15m
```

---

## Refresh Token

The refresh token is used to obtain a new access token when the access token expires.

Example:

```env
REFRESH_TOKEN_EXPIRES_IN=7d
```

The refresh token should use a separate secret:

```env
JWT_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

---

## Refresh Flow

```text
Access Token Expires
        ↓
Client sends Refresh Token
        ↓
Server verifies Refresh Token
        ↓
Server creates new Access Token
        ↓
Client uses new Access Token
```

---

## Refresh Endpoint

Created:

```text
POST /auth/refresh
```

Request:

```json
{
    "refreshToken": "YOUR_REFRESH_TOKEN"
}
```

The server verifies the refresh token and creates a new access token.

Example:

```js
const decoded = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
);

const newAccessToken = jwt.sign(
    {
        userId: decoded.userId,
        email: decoded.email
    },
    process.env.JWT_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
    }
);
```

---

# 3. Protect at Least Two Routes

Two private routes were protected using the same authentication middleware.

```text
GET /profile
GET /dashboard
```

Example:

```js
app.get("/profile", authMiddleware, profileHandler);

app.get("/dashboard", authMiddleware, dashboardHandler);
```

The middleware handles authentication before either route is executed.

---

# 4. Handle Expired and Invalid Tokens

The application handles:

### No Token

```text
401 Unauthorized
```

### Malformed Token

```text
401 Unauthorized
```

### Invalid Token

```text
401 Unauthorized
```

### Tampered Token

```text
401 Unauthorized
```

### Expired Token

```text
401 Unauthorized
```

The API should avoid exposing unnecessary details about why token validation failed.

Example:

```json
{
    "success": false,
    "message": "Invalid or expired token"
}
```

---

# 5. Logout

Created:

```text
POST /auth/logout
```

A proper logout implementation should revoke the refresh token on the server.

This is important because simply deleting the token from the client does not automatically invalidate a stateless JWT.

The recommended flow is:

```text
Login
 ↓
Refresh Token stored server-side
 ↓
Client uses Access Token
 ↓
Access Token expires
 ↓
Refresh Token → New Access Token
 ↓
Logout
 ↓
Refresh Token revoked/deleted
 ↓
Refresh Token can no longer create new Access Tokens
```

---

# 🧪 Postman Testing

The complete authentication system was tested in Postman.

## Test 1 — Register

```http
POST /auth/register
```

Body:

```json
{
    "name": "Ali",
    "email": "ali@example.com",
    "password": "123456"
}
```

Expected:

```text
201 Created
```

---

## Test 2 — Duplicate Registration

Send the same email again.

Expected:

```text
409 Conflict
```

Example:

```json
{
    "success": false,
    "message": "Email already registered"
}
```

---

## Test 3 — Login

```http
POST /auth/login
```

Body:

```json
{
    "email": "ali@example.com",
    "password": "123456"
}
```

Expected:

```json
{
    "success": true,
    "accessToken": "....",
    "refreshToken": "...."
}
```

---

## Test 4 — Access Protected Route

```http
GET /profile
```

Header:

```http
Authorization: Bearer ACCESS_TOKEN
```

Expected:

```text
200 OK
```

---

## Test 5 — Access Second Protected Route

```http
GET /dashboard
```

Header:

```http
Authorization: Bearer ACCESS_TOKEN
```

Expected:

```text
200 OK
```

---

## Test 6 — Protected Route Without Token

```http
GET /profile
```

No Authorization header.

Expected:

```text
401 Unauthorized
```

---

## Test 7 — Protected Route with Invalid Token

```http
Authorization: Bearer abc123
```

Expected:

```text
401 Unauthorized
```

---

## Test 8 — Expired Access Token

Use a short expiration time during testing.

Example:

```env
ACCESS_TOKEN_EXPIRES_IN=15s
```

Wait for the token to expire and request:

```http
GET /profile
```

Expected:

```text
401 Unauthorized
```

---

## Test 9 — Refresh Token

```http
POST /auth/refresh
```

Body:

```json
{
    "refreshToken": "VALID_REFRESH_TOKEN"
}
```

Expected:

```json
{
    "success": true,
    "accessToken": "NEW_ACCESS_TOKEN"
}
```

The new access token can now be used for protected routes.

---

## Test 10 — Logout

```http
POST /auth/logout
```

Expected:

```json
{
    "success": true,
    "message": "Logged out successfully"
}
```

After logout, the revoked refresh token should no longer be accepted.

---

# 🏗️ Final Week 8 Architecture

```text
week-8/
│
├── models/
│   └── user.model.js
│
├── services/
│   └── auth.service.js
│
├── routes/
│   └── auth.routes.js
│
├── middlewares/
│   └── auth.middleware.js
│
├── controllers/
│   └── auth.controller.js
│
├── app.js
│
├── server.js
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

# 🔐 Complete Authentication Architecture

```text
                    CLIENT
                       │
           ┌───────────┴───────────┐
           ↓                       ↓
       REGISTER                  LOGIN
           │                       │
           ↓                       ↓
      Validate Input        Verify Credentials
           │                       │
           ↓                       ↓
      Hash Password        Create Access Token
           │                + Refresh Token
           ↓                       │
       MongoDB                     ↓
                              Return Tokens
                                   │
                    ┌──────────────┴──────────────┐
                    ↓                             ↓
              Access Token                 Refresh Token
                    │                             │
                    ↓                             ↓
             Protected Routes              /auth/refresh
                    │                             │
              ┌─────┴─────┐                       ↓
              ↓           ↓                 New Access Token
          /profile    /dashboard
              │
              ↓
       authMiddleware
              │
       Verify JWT
              │
        req.user = decoded
              │
              ↓
          Route Handler


                    LOGOUT
                      │
                      ↓
             Revoke Refresh Token
                      │
                      ↓
             Cannot refresh again
```

---

# 🧠 Key Concepts Learned

By the end of Week 8, the following concepts were covered:

### Authentication

Understanding how an application identifies and verifies users.

### Password Hashing

Using bcrypt to securely store passwords instead of plain text.

### Credential Verification

Using bcrypt to compare login passwords with stored password hashes.

### JWT

Understanding:

* Header
* Payload
* Signature
* Secret
* Expiration

### Access Tokens

Short-lived tokens used to access protected APIs.

### Refresh Tokens

Longer-lived tokens used to obtain new access tokens.

### Bearer Authentication

Sending access tokens through:

```http
Authorization: Bearer <token>
```

### Middleware

Using middleware to authenticate requests before they reach protected routes.

### `req.user`

Attaching authenticated user information to the request:

```js
req.user = decoded;
```

### Protected Routes

Restricting access to authenticated users.

### Token Expiration

Understanding why access tokens expire and how refresh tokens solve this problem.

### Logout / Token Revocation

Understanding why proper logout requires invalidating or revoking refresh tokens.

---

# 📌 Week 8 Final Outcome

At the end of Week 8, the application supports the complete authentication lifecycle:

```text
REGISTER
   ↓
HASH PASSWORD
   ↓
LOGIN
   ↓
VERIFY PASSWORD
   ↓
ACCESS + REFRESH TOKENS
   ↓
ACCESS PROTECTED ROUTES
   ↓
ACCESS TOKEN EXPIRES
   ↓
REFRESH TOKEN
   ↓
NEW ACCESS TOKEN
   ↓
LOGOUT
   ↓
REFRESH TOKEN REVOKED
```

This provides the foundation required to build applications where different users can securely access private resources and APIs.

```

**One important correction from the earlier Friday plan:** for a genuinely complete logout implementation, **the refresh token needs server-side storage/revocation**. Merely returning `"Logged out successfully"` does not invalidate an already-issued JWT.
```
