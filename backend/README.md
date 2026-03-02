# Intake Consult Form - Backend

Express.js API for the intake consultation form. Handles form submissions and stores data in MongoDB.

## Tech Stack

- **Express.js** - Web framework
- **MongoDB** (Mongoose) - Database
- **TypeScript** - Type safety
- **express-validator** - Request validation
- **moment-timezone** - Date/time handling

## Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB (local or Atlas)
- npm or yarn

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/intake-consult
```

For MongoDB Atlas, use your connection string:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload (nodemon) |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run production build |

## Development

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/submit` | Submit intake consultation form |
| GET | `/api/consults` | Retrieve all consultations |

## Project Structure

```
src/
├── controllers/    # Request handlers
│   └── consultController.ts
├── middleware/     # Express middleware
│   └── validation.ts
├── models/         # Mongoose models
│   └── Consult.ts
├── routes/         # API routes
│   └── consultRoutes.ts
└── server.ts       # Application entry point
```

## CORS

CORS is enabled to allow requests from the frontend. Ensure the frontend URL is configured if you need to restrict origins in production.
