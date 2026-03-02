# Intake Consult Form - Frontend

A React-based intake consultation form with a dynamic questionnaire system. Built with Vite, TypeScript, and Tailwind CSS.

## Tech Stack

- **React 19** - UI framework
- **Vite 7** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the frontend directory (or copy from `.env.example`):

```env
VITE_API_URL=http://localhost:5000/api/
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the next available port).

## Project Structure

```
src/
├── components/     # Reusable form components
│   ├── DynamicQuestionnaire.tsx
│   ├── IntakeForm.tsx
│   ├── RadioQuestion.tsx
│   ├── SelectQuestion.tsx
│   ├── MultiSelectQuestion.tsx
│   └── CompoundQuestion.tsx
├── config/         # Questionnaire configuration
├── pages/          # Page components
├── types/          # TypeScript definitions
└── utils/          # Utility functions
```

## Backend

Ensure the backend API is running before submitting the form. See the `backend/README.md` for setup instructions.
