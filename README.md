# Intake Consult Form

A simple web app for collecting intake consultation information. Users fill out a questionnaire (health conditions, dietary preferences, measurements, etc.), and the answers are saved to a database.

## What's in this project?

There are two parts that work together:

- **Frontend** — The form you see in the browser. Built with React and Tailwind CSS.
- **Backend** — The server that receives form submissions and stores them in MongoDB.

You need both running for the app to work properly.

## What you need before starting

- **Node.js** (version 18 or newer)
- **MongoDB** — Either installed locally or a free MongoDB Atlas account
- **npm** (comes with Node.js)

## How to get it running

### 1. Set up the backend

Open a terminal and go into the backend folder:

```bash
cd backend
```

Install the dependencies:

```bash
npm install
```

Create a `.env` file in the backend folder with your MongoDB connection details:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/intake-consult
```

If you're using MongoDB Atlas, paste your connection string instead of the local URL above.

Start the backend:

```bash
npm run dev
```

You should see a message that the server is running on port 5000. Keep this terminal open.

### 2. Set up the frontend

Open a **new** terminal and go into the frontend folder:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Create a `.env` file in the frontend folder so it knows where to send form data:

```
VITE_API_URL=http://localhost:5000/api/
```

Start the frontend:

```bash
npm run dev
```

The app will open in your browser (usually at `http://localhost:5173`).

### 3. Use the app

With both the backend and frontend running, open the URL shown in the frontend terminal. Fill out the intake form and submit it. The data will be saved to your MongoDB database.

## Project structure

```
intake-consult-form/
├── frontend/     → The form UI (React + Vite + Tailwind)
├── backend/      → The API server (Express + MongoDB)
└── README.md     → This file
```

For more detailed setup and technical info, check the README files inside the `frontend` and `backend` folders.
