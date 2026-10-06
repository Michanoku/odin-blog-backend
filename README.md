# Michanoku Blog Backend

Backend API for The Odin Project Blog project, built with **Node.js, Express, Prisma, and PostgreSQL**.

## Project Repositories

The Odin Project Blog is split across three repositories:

| Part                | Repository                                                                              |
| ------------------- | --------------------------------------------------------------------------------------- |
| **Backend**         | **This repository**                                                                     |
| **Frontend**        | [odin-blog-frontend](https://github.com/Michanoku/odin-blog-frontend)                   |
| **Author**          | [odin-blog-author](https://github.com/Michanoku/odin-blog-author)                       |

## Features

* User registration and JWT-based login
* Password hashing and validation with bcrypt
* User profile and password updates
* Author account management
* Create, read, update, and delete blog posts
* Post ownership authorization
* Post publication status and publication dates
* Create, read, update, and delete comments
* Comment ownership authorization
* Author moderation of comments on their own posts
* Input validation with `express-validator`
* PostgreSQL database accessed through Prisma
* Automated API tests with Jest and Supertest

## Authentication & Authorization

The API uses JWTs for authenticated requests.

* Users receive a JWT when logging in.
* Tokens contain the user's ID and expire after 72 hours.
* Protected routes require a valid JWT.
* Author routes additionally verify that the authenticated user has author status.
* Authors can only create, edit, publish, and delete their own posts.
* Authors can manage comments on their own posts, including comments made by other users.
* Regular users can only edit or delete their own comments.

## Project Structure

```text
├── controllers/       # Request handling and logic
├── db/                # Database queries
├── lib/               # Authentication and utility functions
├── routes/            # API routes
├── tests/             # Jest/Supertest test suites
├── prisma/            # Prisma schema and database configuration
├── app.js             # Express application
└── server.js          # Server entry point
```

## API Overview

### Users

```text
POST   /user/register
POST   /user/login
GET    /user/me
PUT    /user/profile
PUT    /user/authorStatus/:authorStatus
```

### Public Posts & Comments

```text
GET    /posts
GET    /posts/:postId
GET    /posts/:postId/comments
POST   /posts/:postId/comments
PUT    /posts/:postId/comments/:commentId
DELETE /posts/:postId/comments/:commentId
```

Reading posts and comments is public. Creating, editing, and deleting comments requires authentication.

### Author Posts

Author-only post management is available through the protected author routes:

```text
POST   /author/login
GET    /author/me
GET    /author/posts
POST   /author/posts
GET    /author/posts/:postId
PUT    /author/posts/:postId
DELETE /author/posts/:postId
```

Author post operations require both author status and ownership of the relevant post.

## Testing

The test suite uses a separate PostgreSQL test database. Prisma synchronizes the test database before each test command, and the test setup handles database cleanup and disconnection.

Run the full test suite with:

```bash
npm run test
```

The tests cover authentication, authorization, users, posts, comments, validation, and error handling.
