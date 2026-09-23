# Dogfood 2026 — Technical Stack

## Frontend
- React 18 (Vite)
- React Router v6
- Tailwind CSS
- Axios (API calls)
- React Hook Form + Zod (form validation)
- Zustand or Context API (state management)
- Recharts (judging analytics/score visualizations)

## Backend — Core API (Node/Express)
- Node.js 20 LTS
- Express 4
- Mongoose (MongoDB ODM)
- jsonwebtoken + bcrypt (auth)
- express-validator (input validation)
- express-rate-limit (voting/API abuse prevention)
- multer (image/thumbnail uploads, local disk storage)
- dotenv (config)

## Database
- MongoDB 7 (containerized)
- Seed script (mongodb seed on container start via `docker-entrypoint-initdb.d` or custom Node seeder)

## Judging & Normalization Service (Python)
- Python 3.11
- FastAPI
- Pydantic (schemas)
- NumPy / SciPy (z-score, Bayesian shrinkage normalization)
- Pandas (score aggregation, CSV export)
- scikit-learn or custom implementation (Bradley-Terry pairwise ranking — bonus)
- uvicorn (ASGI server)

## Auth & Roles
- JWT (access + refresh tokens)
- Role middleware: visitor / participant / judge / organizer / admin
- Backend route guards on every endpoint (not just frontend route protection)

## Infra / DevOps
- Docker + Docker Compose (single `docker compose up`)
- Services: `frontend`, `api` (Node), `judging-service` (FastAPI), `mongodb`
- `.env.example` for config (no external secrets required)
- Nginx (optional) — serve built React app + reverse proxy to API

## Testing
- Jest + Supertest (Node API)
- Pytest (FastAPI judging service)
- Postman/Newman or acceptance-report script (tier verification)

## Documentation (required deliverables)
- README.md — setup, one-command run
- ARCHITECTURE.md — system design, service boundaries
- DATA-MODEL.md — schema, entity relationships
- JUDGING.md — assignment logic, normalization math, scoring rubric
- acceptance-report.txt — tier pass/fail evidence

## Repo/Deployment Config
- `.dogfood.toml` (per hackathon spec)
- LICENSE — OSI-approved (MIT or Apache 2.0 recommended)
- `docker-compose.yml` at repo root

## Data Model (core entities)
- User (role, auth)
- Event (dates, tracks, prizes)
- Team (members, invite links)
- Submission (fields, status, edits, timestamps)
- JudgeAssignment (judge ↔ project mapping, track/conflict rules)
- Rubric (criteria, weights)
- Score (raw + normalized, per judge per project)
- Vote (public voting, dedup/abuse flags)
- AuditLog (judging + voting trail)

## API Boundaries
- `Node/Express` → CRUD: users, events, teams, submissions, votes, comments
- `FastAPI` → compute-heavy: score normalization, pairwise ranking, anomaly detection
- Both services share the same MongoDB instance (or FastAPI calls Node's internal API — team's choice at build time)
