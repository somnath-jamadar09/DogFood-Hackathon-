# Dogfood 2026 — Self-Hosted Hackathon Submission & Judging Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Architecture: Offline-First](https://img.shields.io/badge/Architecture-Offline--First-green.svg)](documentation/Docs%20V1/Architectural_Blueprint.md)
[![Stack: MERN + FastAPI](https://img.shields.io/badge/Stack-MERN%20%2B%20FastAPI-orange.svg)](documentation/Dogfood_2026_Tech_Stack.md)

**Dogfood 2026** is an offline-first, self-hosted hackathon submission, judging, and community platform engineered for **Hackathon Raptors 2026**. Designed for complete containerized isolation, it runs with zero external internet dependencies via a single Docker command.

---

## ⚡ Quickstart Deployment

### Option 1: One-Command Docker Deployment (Recommended)

Launch the entire air-gapped platform with automated MongoDB fixtures and internal microservices:

```bash
# Clone the repository
git clone https://github.com/somnath-jamadar09/DogFood-Hackathon-.git
cd DogFood-Hackathon-

# Launch all 4 containerized services
docker compose up --build
```

#### 🌐 Service Ingress & Access Points

| Service | Local URL | Port | Description |
|---|---|---|---|
| **Frontend Web App** | [http://localhost:3000](http://localhost:3000) | `3000` | React 18 + Vite + Tailwind CSS SPA |
| **Backend REST Core** | [http://localhost:5000/api/v1](http://localhost:5000/api/v1) | `5000` | Node.js 20 + Express 4 Core API |
| **Judging Service** | `http://localhost:8000` | `8000` | Python 3.11 + FastAPI + NumPy/SciPy *(Internal to Docker)* |
| **MongoDB** | `mongodb://localhost:27017/dogfood` | `27017` | MongoDB 7.0 Persistent Volume |

---

### Option 2: Local Development Setup (Without Docker)

If developing locally without Docker, ensure **Node.js (>= 20)**, **Python (>= 3.11)**, and a local **MongoDB (>= 7.0)** instance are installed:

#### 1. Database (MongoDB)
Ensure MongoDB is running locally on port `27017`:
```bash
# Verify connection
mongosh --eval "db.adminCommand('ping')"
```

#### 2. Backend REST Core (`backend/`)
```bash
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Run in development mode (with nodemon)
npm run dev
# Or production mode
npm start
```
The Core API will start on **`http://localhost:5000`**.

#### 3. Judging & Normalization Service (`judging-service/`)
```bash
cd judging-service

# Create and activate Python virtual environment
python -m venv venv

# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Run the FastAPI server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
The Analytics microservice will start on **`http://localhost:8000`** with interactive Swagger docs at `http://localhost:8000/docs`.

#### 4. Frontend Web App (`frontend/`)
```bash
cd frontend

# Install dependencies (Vite, React, Tailwind, Lucide)
npm install

# Start the Vite development server
npm run dev
```
The Frontend will open at **`http://localhost:3000`**.

---

## 🔑 Default Seed Accounts

The platform automatically boots with pre-seeded fixtures (Password for all: `Raptor2026!`):

| Role | Email | Password | Track Access / Scope |
|---|---|---|---|
| **Organizer** | `organizer@raptors.local` | `Raptor2026!` | Global Admin & Normalization |
| **AI/ML Judge** | `judge.ai@raptors.local` | `Raptor2026!` | `AI/ML` Track Ballot Queue |
| **Web3 Judge** | `judge.web3@raptors.local` | `Raptor2026!` | `Web3 & Blockchain` Track |
| **Participant** | `hacker@raptors.local` | `Raptor2026!` | Team Captain (`CyberDinos`) |

---

## 📁 Project Structure

```text
DogFood-Hackathon-/
├── docker-compose.yml          # Unified multi-container orchestration
├── .env.example                # Local environmental variable template
├── .dogfood.toml               # Hackathon test harness specification
├── .gitignore                  # Git ignore rules for Node, Python, Mongo, and uploads
├── README.md                   # Operational quickstart guide
├── acceptance-report.txt       # Tier qualification report
│
├── seed/                       # Fixture data & MongoDB initialization scripts
│   └── init-mongo.js           # Automated seed data for tournament instant boot
│
├── backend/                    # Node.js Express REST Core (Somnath - Backend Lead)
│   ├── src/
│   │   ├── config/             # Mongoose connection, JWT settings, Multer disk storage
│   │   ├── controllers/        # Auth, Teams, Submissions, Judging, Admin, and Votes
│   │   ├── middleware/         # JWT auth, RBAC guards, Route score isolation, Rate limiters
│   │   ├── models/             # Mongoose schemas (User, Team, Submission, Score, AuditLog, Event)
│   │   ├── routes/             # Express route declarations
│   │   ├── services/           # Assignment solver, FastAPI HTTP client, CSV streaming exporter
│   │   └── index.js            # Express server bootstrap and health check
│   ├── uploads/                # Local host-mounted directory for project thumbnails
│   ├── Dockerfile              # Node.js 20 Alpine container
│   └── package.json
│
├── frontend/                   # React 18 SPA (Falguni - Frontend Lead)
│   ├── src/
│   │   ├── components/         # Reusable UI widgets and layout modules
│   │   ├── context/            # AuthContext, NotificationContext
│   │   ├── hooks/              # useAuth, useSubmissions, useJudging, useTimer
│   │   ├── pages/              # Home, Gallery, TeamDashboard, SubmissionEditor, JudgePortal, Admin
│   │   ├── services/           # Axios client configured with JWT interceptors
│   │   ├── utils/              # Markdown sanitizer, score formatters
│   │   ├── App.jsx             # React Router v6 navigation with route guards
│   │   └── index.css           # High-density dark design tokens and scrollbar styles
│   ├── tailwind.config.js      # Palette tokens (canvas, surface, accent, status)
│   ├── vite.config.js          # Vite config with backend reverse-proxy
│   ├── Dockerfile              # Multi-stage build with Nginx reverse proxy
│   └── package.json
│
└── judging-service/            # Python 3.11 FastAPI Analytics Engine (Om Apar - ML Lead)
    ├── app/
    │   ├── algorithms/         # Z-Score + Bayesian shrinkage, Bradley-Terry MM, Anomaly detection
    │   ├── models/             # Strictly typed Pydantic DTO schemas
    │   ├── routes/             # Health, Normalization, and Pairwise endpoints
    │   └── main.py             # FastAPI ASGI application entrypoint
    ├── tests/                  # Pytest verification suite
    ├── Dockerfile              # Python 3.11 Slim container
    └── requirements.txt        # FastAPI, Uvicorn, NumPy, SciPy, Pandas, Scikit-Learn
```

---

## 🧪 Testing & Quality Assurance

Run the automated test suites across all services:

### 1. Backend REST API Tests
```bash
cd backend
npm test
```

### 2. Judging Service Mathematical Tests
```bash
cd judging-service
pytest
```

---

## 📚 Complete Documentation Suite

For detailed specifications, architectural diagrams, and mathematical proofs, refer to the [**Documentation Portal**](documentation/README.md):
- [**PRD**](documentation/Docs%20V1/PRD.md): Product vision, user personas, and tier scopes.
- [**SRS**](documentation/Docs%20V1/SRS.md): IEEE 830 functional requirements and SLAs.
- [**SDD**](documentation/Docs%20V1/SDD.md): Schemas, normalization math proofs, and REST catalog.
- [**Architectural Blueprint**](documentation/Docs%20V1/Architectural_Blueprint.md): Multi-stage Dockerfiles and container networking.
- [**Implementation Roadmap**](documentation/Docs%20V1/Implementation_Roadmap.md): 72-hour milestone breakdown.
- [**Team Roles & Governance**](documentation/Docs%20V1/Team_Roles.md): RACI matrix and interservice contracts.
- [**UI/UX Design Specification**](documentation/Docs%20V1/UI_UX_Design_Specification.md): Design tokens and wireframes.
- [**AI Central Memory & Prompt Governance**](documentation/Docs%20V1/AI_Central_Memory_Architecture_System_Prompt_Governance_Specification.md): Prompt injection defenses.
