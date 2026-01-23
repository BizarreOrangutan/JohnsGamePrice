
# JohnsGamePrice

[![CodeQL Main](https://github.com/BizarreOrangutan/JohnsGamePrice/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/BizarreOrangutan/JohnsGamePrice/actions/workflows/codeql.yml)

[![Continuous Integration Main](https://github.com/BizarreOrangutan/JohnsGamePrice/actions/workflows/integration.yml/badge.svg?branch=main)](https://github.com/BizarreOrangutan/JohnsGamePrice/actions/workflows/integration.yml)

[![CodeQL Dev](https://github.com/BizarreOrangutan/JohnsGamePrice/actions/workflows/codeql.yml/badge.svg?branch=dev)](https://github.com/BizarreOrangutan/JohnsGamePrice/actions/workflows/codeql.yml)

[![Continuous Integration Dev](https://github.com/BizarreOrangutan/JohnsGamePrice/actions/workflows/integration.yml/badge.svg?branch=dev)](https://github.com/BizarreOrangutan/JohnsGamePrice/actions/workflows/integration.yml)

## 🌐 Live Deployments

- **Frontend:** [https://johnsgameprice.onrender.com](https://johnsgameprice.onrender.com)
- **Backend:** [https://johnsgameprice-1.onrender.com](https://johnsgameprice-1.onrender.com)

> ⚠️ **Note:** These services are hosted on Render's free tier. Instances may spin down when idle, causing the first request to take up to 50 seconds or more to respond. Please be patient if you experience a delay on your first visit!

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


## ⚙️ CI/CD & Automated Releases

- **CI/CD:** Automated build and test workflows run on every pull request and push to main, ensuring code quality and reliability.
- **Automated Releases:** Versioning, changelogs, and GitHub releases are managed by [release-please](https://github.com/googleapis/release-please). Deployments are triggered automatically on new releases.

---

## 🧩 Main Workflow

1. User lands on `/` and searches for a game.
2. App fetches and displays search results from the backend.
3. User selects a game to view detailed pricing information.
4. Navigation and state are managed with React Context and React Router.

## 📝 License

MIT License. See LICENSE file for details.
