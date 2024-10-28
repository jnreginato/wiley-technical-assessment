# Wiley - Backend Developer Technical Assessment

[![Technology][node-badge]][node-url]
[![Technology][typescript-badge]][typescript-url]
[![Technology][docker-badge]][docker-url]
[![Technology][sqlite-badge]][sqlite-url]

[node-url]: https://nodejs.org/

[node-badge]: https://img.shields.io/badge/node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white

[typescript-url]: https://www.typescriptlang.org/

[typescript-badge]: https://img.shields.io/badge/typescript-%23007ACC?style=for-the-badge&logo=typescript&logoColor=white

[docker-url]: https://www.docker.com/

[docker-badge]: https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white

[sqlite-url]: https://www.sqlite.org/

[sqlite-badge]: https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white

## Description

This project is a backend application built with Node.js, TypeScript, and Express, featuring JWT authentication, CRUD operations for courses, and SQLite data persistence.
The project uses Docker to streamline setup and configuration, and it includes unit tests with Jest.

## Table of contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
  - [Environment variables](#environment-variables)
  - [Database configuration](#database-configuration)
- [Running the application](#running-the-application)
  - [Running with Docker](#running-with-docker)
  - [Running locally](#running-locally)
  - [Useful scripts](#useful-scripts)
- [Testing](#testing)
- [Project structure](#project-structure)
- [Endpoints](#endpoints)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 20+)
- [Docker](https://www.docker.com/get-started)

## Setup

### Environment variables

You can copy the provided `.env.example` file to a new file named `.env` in the project root and fill in the blank values with the appropriate data:

```env
# Server port
PORT=3000

# Secret key and expiration time for signing JWT tokens
JWT_SECRET=
JWT_EXPIRATION_TIME=

# Username e password for testing
TEST_USERNAME=
TEST_PASSWORD=
```

### Database configuration

This project uses SQLite for data persistence.
The database will be stored in a `courses.db` file within the `src/infrastructure/data-source/database/courses.db` directory.

## Running the application

### Running with Docker

1. Ensure Docker is installed and running on your system.
2. Build the Docker image and start the containers with `docker compose`:

   ```bash
   docker compose up --build
   ```

   This will start the application on port `3000` (or the port specified in the `PORT` environment variable).

3. Access the application at [http://localhost:3000](http://localhost:3000).

### Running locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Compile TypeScript to JavaScript:

   ```bash
   npm run build
   ```

3. Start the application:

   ```bash
   npm start
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000).

### Useful scripts

- `npm run dev`: Runs the application in development mode with `ts-node` and automatic restarts.
- `npm run build`: Compiles the TypeScript project into JavaScript in the `dist` folder.
- `npm start`: Runs the compiled version of the project.

## Testing

This project uses Jest for unit testing.
To run the tests, use:

```bash
npm test
```

Test files are located within the src folder, alongside the source code, and follow the same directory structure.
Test files have the `.spec.ts` extension, distinguishing them from the main application files.
For example, tests for controllers are found in the src/controllers folder as .spec.ts files.

## Project structure

The project structure is organized as follows:

```
project-root/
├── src/
│   ├── application/                      # Contains application-specific logic, including controllers, routes, requests, responses, and middlewares to handle the flow of data
│   │   ├── controllers                   # Contains request handling logic, managing interactions between the routes and business logic of the application
│   │   ├── middlewares/                  # Holds reusable functions that process requests between the request and response lifecycle, such as validation and authentication.
│   │   ├── requests/                     # Defines TypeScript interfaces for request payloads, path parameters, and query parameters, ensuring type safety and consistency for incoming data
│   │   ├── responses/                    # Contains TypeScript interfaces for response payloads, standardizing the structure and type consistency of data sent back to clients
│   │   └── routes/                       # Defines API endpoints and associates them with their respective controllers and middlewares, managing route validation, authentication, and request handling logic
│   ├── domain/                           # Defines the core business logic and entities, representing the main concepts and rules of the application domain
│   │   └── entities/                     # Defines the core data models and structures representing the main entities in the application’s domain logic
│   ├── infrastructure/                   # Manages external resources and configurations, such as database connections, third-party services, and utilities necessary for application support
│   │   ├── data-source/                  # Configures and manages the connection to the database or data storage, serving as the central source of data access for the application
│   │   │   └── database/                 # Contains database configuration
│   │   └── repositories/                 # Provides data access layers with methods for querying and interacting with the database, encapsulating persistence logic for entities
│   └── index.ts                          # Entry point of the application, responsible for initializing the server, loading middlewares, and setting up routes
├── .dockerignore                         # Specifies files and directories to exclude from Docker builds
├── .editorconfig                         # Defines coding style guidelines to maintain consistent formatting across different editors and IDEs for all contributors
├── .env.example                          # Provides a template for environment variables, listing required keys without sensitive values to guide configuration setup
├── .gitignore                            # Specifies intentionally untracked files to ignore
├── .prettierrc                           # Configures code formatting rules for consistent styling across the project, used by Prettier.
├── compose.yaml                          # Docker Compose configuration
├── Dockerfile                            # Dockerfile to build the image
├── eslint.config.js                      # Configures linting rules and standards for code quality and consistency across the project, used by ESLint
├── jest.config.js                        # Configures Jest testing framework options for running and managing unit tests in the project
├── package.json                          # Defines project metadata, dependencies, and scripts for managing, building, and running the application
├── package-lock.json                     # Records the exact versions of installed dependencies to ensure consistent installations across environments
├── README.md                             # This file
└── tsconfig.json                         # Specifies TypeScript compiler options and project configurations for consistent transpilation of TypeScript to JavaScript
```

## Endpoints

### Authentication

- **POST /api/login**: Logs in and returns a JWT token.
  - **Request Body**:
    ```json
    {
      "username": "admin",
      "password": "password"
    }
    ```
  - **Success Response**:
    ```json
    {
      "token": "jwt_token"
    }
    ```

### Courses

All course endpoints require JWT authentication.
Include the token in the `Authorization` header as `Bearer <token>`.

- **POST /api/courses**: Creates a new course.
  - **Request Body**:
    ```json
    {
      "title": "Course title",
      "description": "Course description",
      "duration": 120,
      "instructor": "Instructor name"
    }
    ```

- **GET /api/courses**: Returns a list of courses.

- **GET /api/courses/:id**: Returns details of a specific course.
  - **Path Parameter**: `id` - Course ID

- **PUT /api/courses/:id**: Updates an existing course.
  - **Path Parameter**: `id` - Course ID
  - **Request Body**: Same structure as the creation endpoint.

- **DELETE /api/courses/:id**: Deletes a course.
  - **Path Parameter**: `id` - Course ID
