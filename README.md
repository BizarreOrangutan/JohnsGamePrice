# JohnsGamePrice

A modern game price comparison platform with a simple two-service architecture.

## 🛠 Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Bun, TailwindCSS, Headless UI
- **Backend:** Python 3.13, FastAPI

## 📁 Project Structure

```
JohnsGamePrice/
├── frontend/   # React TypeScript Frontend (Vite, Bun, TailwindCSS)
├── backend/    # Python FastAPI Backend
└── README.md   # This documentation
```

## 🚀 Getting Started

### Prerequisites
- [Bun](https://bun.sh/) (for frontend)
- [Node.js](https://nodejs.org/) (for some tooling)
- [Python 3.13+](https://www.python.org/) (for backend)

### Frontend
```bash
cd frontend
bun install
bun run dev
# App runs at http://localhost:5173
```

### Backend
```bash
cd backend
pip install poetry
poetry install
poetry run poe dev
# API runs at http://localhost:8000
```

## 🧩 Main Workflow

1. User lands on `/` and searches for a game.
2. App fetches and displays search results from the backend.
3. User selects a game to view detailed pricing information.
4. Navigation and state are managed with React Context and React Router.

## 📝 License

MIT License. See LICENSE file for details.
