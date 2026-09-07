# Week 6 - Express.js and REST API Development

## Overview
This project focuses on building a structured REST API using Express.js. The goal was to transition from a low-level Node.js HTTP server to a more organized and maintainable Express application. Throughout the week, we developed an in-memory Users API, enhancing it with various features such as routing, middleware, validation, and error handling.

## Project Structure
The project is organized into several key files and directories:

- **app.js**: The main entry point of the application. It sets up the Express app, registers middleware, connects user routes, and starts the server.
  
- **routes/users.route.js**: Defines the API routes for user-related operations. It exports a router that handles GET, POST, PATCH, and DELETE requests for users, linking them to the appropriate controller functions.
  
- **controllers/users.controller.js**: Contains the controller functions for managing user requests. It exports functions that handle request and response logic, calling the service layer to perform operations on user data.
  
- **services/users.service.js**: Contains the business logic related to user operations. It exports functions for creating, reading, updating, and deleting users, working with in-memory user data.
  
- **middlewares/error.middleware.js**: Defines the centralized error-handling middleware. It exports a function that captures errors, logs them, and sends a consistent error response to the client.
  
- **package.json**: The configuration file for npm, listing project dependencies, scripts, and metadata required to manage the project.

## Features
- **CRUD Operations**: The API supports Create, Read, Update, and Delete operations for user management.
- **Middleware**: Custom middleware for request logging and error handling is implemented to enhance the application's functionality.
- **Validation**: Incoming user data is validated to ensure required fields are present before processing requests.
- **Centralized Error Handling**: Errors are managed through a centralized middleware, providing consistent error responses.

## Testing
The API was tested using Postman, covering both success and failure cases to ensure robust functionality.

## Conclusion
This project serves as a foundational step in understanding Express.js and REST API development, preparing for future enhancements such as integrating a real database.