# Trading Quiz API

An **Express and MongoDB backend for a trading education quiz app**. It manages user accounts, quizzes, lessons, results, notifications, and a leaderboard, with JWT authentication and bcrypt password hashing.

The companion interface is [Trading Quiz Frontend](https://github.com/EladioRocha/Trading-Quiz-Frontend).

## Run locally

You need Node.js, npm, and a running MongoDB instance. The project does not pin a Node.js version and uses older dependencies, including Mongoose 5.

```sh
git clone https://github.com/EladioRocha/Trading-Quiz-Backend.git
cd Trading-Quiz-Backend
npm ci
```

Copy [.env.example](.env.example) to `.env` in the repository root. Set your MongoDB connection and replace the empty JWT secret with a private, randomly generated value before starting.

| Variable | Purpose |
| --- | --- |
| `MONGO_URI_LOCAL` | MongoDB connection URI. |
| `PORT_DEV` | Local listening port when `PORT` is not set. |
| `PORT` | Optional port override; takes precedence over `PORT_DEV`. |
| `JWT_SECRET_KEY` | Secret used to sign and verify tokens. |
| `BCRYPT_SALT_ROUNDS` | Integer bcrypt work factor. |
| `CACHE_DURATION` | Referenced by the unfinished cache helper; not required by the current routes. |

```sh
npm run dev
```

With the example configuration, routes are available under `http://localhost:3000/v1`. Use `npm start` to run without the development watcher.

## API overview

All paths below include the `/v1` prefix. See [src/routes/v1.js](src/routes/v1.js) for the complete route list and [src/middlewares/users.js](src/middlewares/users.js) for account field validation.

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/v1/users/create` | Register an account. |
| POST | `/v1/users/login` | Log in. |
| GET | `/v1/quizzes/type/:type` | Get quiz metadata by category. |
| GET | `/v1/quizzes/:quizId` | Get quiz questions. |
| POST | `/v1/quizzes/result` | Save a quiz result. |
| GET | `/v1/leaderboard` | Get rankings. |
| GET | `/v1/lessons/type/:type` | Get lesson metadata. |
| GET | `/v1/lessons/:lessonId` | Get a lesson. |
| GET | `/v1/notifications/unviewed` | Get unread notifications. |

Protected routes expect the raw JWT in the `Authorization` header. The current middleware passes that header directly to token verification, so it does not strip a `Bearer ` prefix. Account creation and login are public routes; the other routes listed above require authentication.

## Code and documentation

| Path | Purpose |
| --- | --- |
| [src/index.js](src/index.js) | Environment loading, MongoDB connection, and Express startup. |
| [src/controllers](src/controllers) | HTTP request handlers. |
| [src/services](src/services) | Data access and application operations. |
| [src/models](src/models) | Mongoose models. |
| [src/middlewares](src/middlewares) | Authentication and validation. |
| [src/data](src/data) | Bundled lesson and quiz JSON. |
| [docs/index.html](docs/index.html) | Existing generated JSDoc documentation. |

Run `npm run doc` to regenerate JSDoc using [jsdoc.json](jsdoc.json). Generated HTML may reflect earlier source versions. The bundled JSON is not automatically imported by server startup; inspect the data helpers before using them to populate a database.

## Validation and project status

There is no automated test script in `package.json`. `node --check src/index.js` checks entry-point syntax without connecting to MongoDB. Full authentication, database operations, and frontend integration require a configured test environment and were not exercised for this documentation update.

The cache helper is unfinished and is not attached to the current routes. Treat this repository as an educational application requiring additional testing and error-handling work before deployment.
