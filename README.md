# Michanoku Blog Backend

Backend API for the Odin Blog project, built with **Node.js, Express, Prisma, and PostgreSQL**.

## Features

* User registration and login
* JWT-based authentication
* Password hashing with bcrypt
* User profile updates
* Author account management
* Create, read, update, and delete blog posts
* Post ownership authorization
* Post publication status and publication dates
* Comments on posts 
* Input validation with `express-validator`
* PostgreSQL database accessed through Prisma
* Automated API tests with Jest and Supertest

## Authentication & Authorization

The API uses JWTs for authenticated requests.

* Users receive a JWT when logging in.
* The token contains the user's ID and expires after 72 hours.
* Protected routes require a valid JWT.
* Author routes additionally verify that the user has author status.
* Individual post operations verify that the authenticated author owns the post.

## Project Structure

```text
├── controllers/       # Request handling and business logic
├── db/                # Database queries
├── lib/               # Authentication and utility functions
├── routes/             # API route definitions
├── tests/              # Jest/Supertest test suites
├── prisma/             # Prisma schema and database configuration
├── app.js              # Express application
└── server.js           # Server entry point
```

## API Overview

### Users

```text
POST   /user/register
POST   /user/login
PUT    /user/profile
PUT    /user/authorStatus/:authorStatus
```

### Posts

Public post functionality is available through the frontend API routes, while author management is protected:

```text
GET    /author/posts
POST   /author/posts
GET    /author/posts/:postId
PUT    /author/posts/:postId
DELETE /author/posts/:postId
```

### Testing

The test suite uses a separate test database. The database is cleared before each test run and disconnected after the tests complete.

```bash
npm run test
```
