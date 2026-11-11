# Week 16: NestJS, PostgreSQL, JWT, and GraphQL

This NestJS application uses PostgreSQL through TypeORM, REST endpoints for
authentication, and a GraphQL API for users and events.

## Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set `DATABASE_URL` to your PostgreSQL
   connection string and `JWT_SECRET` to a private, strong secret.
3. Run `npm run build` and `npm run lint` to validate the application.
4. Start the application with `npm run start:dev`.

The application listens on port `3000` by default. GraphQL is available at
`/graphql`. TypeORM schema synchronization is enabled for this exercise and
should be disabled in production in favor of migrations.

## API

- `POST /auth/register` registers a user.
- `POST /auth/login` returns a JWT and public user details.
- `GET /events` lists events; `POST /events` creates an event with a bearer
  token.
- GraphQL `users` and `events` queries list their records.
- GraphQL `createUser` creates a user; `createEvent` requires a bearer token.

User passwords are hashed before storage and are not exposed in GraphQL.
