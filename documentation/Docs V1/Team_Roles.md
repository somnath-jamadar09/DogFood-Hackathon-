# Team Roles, Responsibilities & Operational Governance — Dogfood 2026
**Document ID:** `ROLES-DOGFOOD-2026-V1`  
**System Title:** Dogfood 2026 Hackathon Engineering Team  
**Target Event:** Hackathon Raptors 2026  
**Authors:** Somnath, Falguni, Om Apar  
**Status:** Approved Operational Governance  

---

> [!NOTE]
> **Zero Learning Curve Philosophy**  
> Technology stack assignments strictly mirror existing core competencies:
> - **Somnath & Falguni:** MERN stack fluent (React, Tailwind, Node.js, Express, MongoDB) — driving the core platform, auth, and participant workflows.
> - **Om Apar:** Python, statistics, and ML fluent (FastAPI, NumPy, SciPy, Pandas) — driving mathematical score normalization, Bradley-Terry ranking, and voting anomaly detection.

---

## Table of Contents
1. [Team Roster & Domain Ownership](#1-team-roster--domain-ownership)
   - [1.1 Somnath: Full-Stack & Core Backend Lead](#11-somnath-full-stack--core-backend-lead)
   - [1.2 Falguni: Frontend & UI/UX Lead](#12-falguni-frontend--uiux-lead)
   - [1.3 Om Apar: ML & Statistical Services Lead](#13-om-apar-ml--statistical-services-lead)
2. [Granular RACI Responsibility Assignment Matrix](#2-granular-raci-responsibility-assignment-matrix)
3. [Inter-Service Collaboration Contracts](#3-inter-service-collaboration-contracts)
   - [3.1 Frontend $\longleftrightarrow$ Backend Contract](#31-frontend-longleftrightarrow-backend-contract)
   - [3.2 Backend $\longleftrightarrow$ FastAPI Scoring Engine Contract](#32-backend-longleftrightarrow-fastapi-scoring-engine-contract)
4. [Git Workflow, Branching & Commit Conventions](#4-git-workflow-branching--commit-conventions)
5. [Daily Standup Cadence & Decision Protocols](#5-daily-standup-cadence--decision-protocols)
6. [Document Revision History](#6-document-revision-history)

---

## 1. Team Roster & Domain Ownership

```
+---------------------------------------------------------------------------------------+
|                               DOGFOOD 2026 CORE TRIO                                  |
+---------------------------+---------------------------+-------------------------------+
| Somnath                   | Falguni                   | Om Apar                       |
| Full-Stack / Backend Lead | Frontend & UI/UX Lead     | ML & Statistical Engine Lead  |
| - Node.js 20 & Express 4  | - React 18 & Vite         | - Python 3.11 & FastAPI       |
| - MongoDB & Mongoose      | - Tailwind CSS & Assets   | - NumPy, SciPy, Pandas        |
| - JWT Auth & Isolation    | - Responsive Dashboards   | - Z-Score & Bayesian Math     |
| - Docker Compose Orchestr | - Recharts Analytics      | - Bradley-Terry & Abuse ML    |
+---------------------------+---------------------------+-------------------------------+
```

### 1.1 Somnath: Full-Stack & Core Backend Lead
- **Primary Domain:** Core REST API architecture, database integrity, route authorization, Docker infrastructure, and file storage.
- **Tools & Tech:** Node.js 20, Express 4, MongoDB 7.0, Mongoose 8, Docker Compose, Jest, Supertest.
- **Key Deliverables:**
  - `docker-compose.yml` multi-service orchestration and bridge network configuration.
  - Stateless JWT authentication lifecycle (bcrypt password hashing, access/refresh cookies).
  - RBAC middleware (`roleGuard.js`) and route-level score isolation guards (`isolationGuard.js`).
  - Mongoose schemas (`User`, `Team`, `Submission`, `Score`, `JudgeAssignment`, `Vote`, `AuditLog`).
  - Greedy constraint-satisfied judge assignment engine (`assignmentSolver.js`).
  - Multer local disk upload pipeline for project thumbnails and attachments.
  - Streaming CSV and JSON tournament results exporter.

### 1.2 Falguni: Frontend & UI/UX Lead
- **Primary Domain:** React 18 single-page application, design system, component library, and responsive user experience.
- **Tools & Tech:** React 18, Vite, Tailwind CSS, Recharts, Lucide Icons, Axios.
- **Key Deliverables:**
  - Modern, dark-mode-first design tokens configured in `tailwind.config.js`.
  - Accessible, WCAG 2.1 AA compliant UI components across desktop, tablet, and mobile.
  - Multi-step project submission editor with live sanitized Markdown preview.
  - Public Project Showcase Gallery with instant search and track badge filtering.
  - Interactive Judge Evaluation Portal with weighted criteria sliders and auto-saving notes.
  - Organizer Command Center featuring live completion metrics, Raw vs. Normalized leaderboard toggles, and Recharts score variance charts.

### 1.3 Om Apar: ML & Statistical Services Lead
- **Primary Domain:** Python/FastAPI microservice, statistical normalization, Bradley-Terry ranking, and voting anomaly detection.
- **Tools & Tech:** Python 3.11, FastAPI, Uvicorn, NumPy, SciPy, Pandas, Scikit-Learn, Pytest.
- **Key Deliverables:**
  - FastAPI microservice architecture with strictly typed Pydantic request/response schemas.
  - Z-score normalization algorithm: $Z_{ij} = \frac{X_{ij} - \mu_j}{\sigma_j + \epsilon}$.
  - Empirical Bayesian variance shrinkage module for judges with small sample sizes ($N < 5$):
    $$\hat{\mu}_j = \frac{n_j}{n_j + k} \mu_j + \frac{k}{n_j + k} \mu_{\text{global}}$$
  - Bradley-Terry pairwise preference ranking engine via Minorize-Maximization (MM).
  - Voting anomaly classifier detecting sliding-window velocity spikes and entropy irregularities.
  - Mathematical verification test suite executed via Pytest.

---

## 2. Granular RACI Responsibility Assignment Matrix

- **R — Responsible:** Completes the deliverable.
- **A — Accountable:** Final approval and technical sign-off.
- **C — Consulted:** Provides domain expertise and technical input.
- **I — Informed:** Kept updated on progress.

| Subsystem / Deliverable | Somnath (Backend) | Falguni (Frontend) | Om Apar (ML/Stats) |
|---|:---:|:---:|:---:|
| **Docker Compose Multi-Container Orchestration** | **A / R** | I | C |
| **MongoDB Schema & Seed Initialization Script** | **A / R** | C | C |
| **JWT Local Authentication & Role Guards** | **A / R** | C | I |
| **Team Formation & Join Code Generator** | **A / R** | C | I |
| **Participant Project Submission & Multer** | **A / R** | C | I |
| **Frontend Tailwind Design System & Tokens** | C | **A / R** | I |
| **Public Showcase Gallery & Instant Filter** | C | **A / R** | I |
| **Judge Scoring Portal & Rubric Sliders** | C | **A / R** | C |
| **Greedy Judge Assignment Algorithm** | **A / R** | C | C |
| **Route-Level Score Isolation Guards** | **A / R** | C | C |
| **FastAPI Statistical Normalization Engine** | C | I | **A / R** |
| **Empirical Bayesian Shrinkage Algorithm** | I | I | **A / R** |
| **Node.js $\leftrightarrow$ FastAPI Integration Bridge** | **A / R** | I | C |
| **Organizer Command Center & Leaderboard** | C | **A / R** | C |
| **Recharts Score Variance Visualizations** | I | **A / R** | C |
| **Anti-Abuse Voting & IP/UA Fingerprinting** | **A / R** | C | C |
| **Bradley-Terry Pairwise Ranking Bonus** | C | C | **A / R** |
| **Streaming CSV / JSON Standings Exporter** | **A / R** | C | C |
| **Air-Gap Verification & Acceptance Report** | **A / R** | C | C |

---

## 3. Inter-Service Collaboration Contracts

### 3.1 Frontend $\longleftrightarrow$ Backend Contract
- **Base URL:** `http://localhost:5000/api/v1`
- **Transport:** HTTP/1.1 REST with JSON bodies.
- **Standard Success Envelope:**
  ```json
  {
    "success": true,
    "data": { ... },
    "message": "Operation completed successfully."
  }
  ```
- **Standard Error Envelope:**
  ```json
  {
    "success": false,
    "error": "Access Denied: You do not have permission to view this resource.",
    "statusCode": 403,
    "timestamp": "2026-09-23T12:00:00.000Z"
  }
  ```

### 3.2 Backend $\longleftrightarrow$ FastAPI Scoring Engine Contract
- **Internal Base URL:** `http://judging-service:8000/api/v1`
- **Normalization Endpoint:** `POST /api/v1/normalize`
  - **Request Payload:**
    ```json
    {
      "event_id": "6500abc123",
      "scores": [
        {
          "judge_id": "j_01",
          "submission_id": "sub_101",
          "raw_composite_score": 8.5
        },
        {
          "judge_id": "j_02",
          "submission_id": "sub_101",
          "raw_composite_score": 6.0
        }
      ],
      "bayesian_prior_k": 3.0
    }
    ```
  - **Response Payload:**
    ```json
    {
      "status": "success",
      "algorithm": "z_score_with_bayesian_shrinkage",
      "total_submissions": 1,
      "total_scores_processed": 2,
      "judge_calibrations": [
        {
          "judge_id": "j_01",
          "sample_size": 1,
          "raw_mean": 8.5,
          "raw_std": 0.0,
          "bayesian_shrunk_mean": 7.625
        }
      ],
      "standings": [
        {
          "submission_id": "sub_101",
          "raw_mean": 7.25,
          "normalized_score": 85.4,
          "z_score_mean": +1.12,
          "ballot_count": 2,
          "rank": 1
        }
      ]
    }
    ```

---

## 4. Git Workflow, Branching & Commit Conventions

### 4.1 Branching Model
- **`main`:** Stable, deployable branch. Pushes to `main` must pass all tests in CI.
- **`feat/backend-*`:** Somnath's backend feature branches.
- **`feat/frontend-*`:** Falguni's UI feature branches.
- **`feat/judging-*`:** Om Apar's analytics microservice branches.

### 4.2 Conventional Commits
All commit messages must follow the Conventional Commits format:
```text
<type>(<scope>): <short description>

[optional body]
[optional footer]
```
- **Allowed Types:** `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `chore`.
- **Examples:**
  - `feat(auth): implement jwt refresh token rotation in http-only cookies`
  - `fix(isolation): return 403 when judge queries unassigned score id`
  - `test(stats): add pytest coverage for small-sample bayesian shrinkage`

---

## 5. Daily Standup Cadence & Decision Protocols

- **Standup Schedule:** 3 times daily during the 72-hour sprint (09:00, 15:00, 21:00 local time).
- **Format:** 10-minute timebox covering:
  1. What was completed in the last block?
  2. What is being built next?
  3. Any blockers impacting cross-service contracts?
- **Decision Authority Protocol:**
  - **API Contracts:** Somnath has final sign-off.
  - **UI/UX Aesthetics & Responsive Flow:** Falguni has final sign-off.
  - **Statistical Correctness & Algorithm Tuning:** Om Apar has final sign-off.

---

## 6. Document Revision History

| Version | Date | Author(s) | Summary of Changes |
|---|---|---|---|
| `v1.0.0` | Sept 2026 | Somnath, Falguni, Om Apar | Complete team roles, RACI matrix, and inter-service contracts approved. |
