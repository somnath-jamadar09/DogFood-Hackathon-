# Dogfood 2026 — Self-Hosted Hackathon Submission & Judging Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Architecture: Offline-First](https://img.shields.io/badge/Architecture-Offline--First-green.svg)](documentation/Docs%20V1/Architectural_Blueprint.md)
[![Stack: MERN + FastAPI](https://img.shields.io/badge/Stack-MERN%20%2B%20FastAPI-orange.svg)](documentation/Dogfood_2026_Tech_Stack.md)

**Dogfood 2026** is an offline-first, self-hosted hackathon submission, judging, and community platform engineered for **Hackathon Raptors 2026**. Designed for complete containerized isolation, it runs with zero external internet dependencies via a single Docker command.

---

## 🚀 Quickstart Deployment

Launch the entire air-gapped platform with automated MongoDB fixtures and internal microservices:

```bash
# Clone the repository
git clone https://github.com/HackathonRaptors/dogfood-2026.git
cd dogfood-2026

# Launch all containerized services
docker compose up --build
```

### 🌐 Service Ports & Access Points

| Service | Host URL | Description |
|---|---|---|
| **Frontend Web App** | [http://localhost:3000](http://localhost:3000) | React 18 + Vite + Tailwind SPA |
| **Backend REST API** | [http://localhost:5000/api/v1](http://localhost:5000/api/v1) | Node.js 20 + Express 4 Core API |
| **Judging Service** | *Internal Only (`http://judging-service:8000`)* | Python 3.11 + FastAPI + NumPy/SciPy |
| **Database** | `mongodb://localhost:27017/dogfood` | MongoDB 7.0 Persistent Volume |

---

## 🔑 Default Seed Accounts

The platform automatically boots with pre-seeded fixtures (Password for all: `Raptor2026!`):
- **Organizer:** `organizer@raptors.local`
- **AI/ML Judge:** `judge.ai@raptors.local`
- **Web3 Judge:** `judge.web3@raptors.local`
- **Participant:** `hacker@raptors.local`

---

## 📚 Complete Documentation Suite

For detailed specifications, refer to the [**Documentation Portal**](documentation/README.md):
- [**PRD**](documentation/Docs%20V1/PRD.md): Product vision, user personas, and tier scopes.
- [**SRS**](documentation/Docs%20V1/SRS.md): IEEE 830 functional requirements and SLAs.
- [**SDD**](documentation/Docs%20V1/SDD.md): Schemas, normalization math proofs, and REST catalog.
- [**Architectural Blueprint**](documentation/Docs%20V1/Architectural_Blueprint.md): Multi-stage Dockerfiles and container networking.
- [**Implementation Roadmap**](documentation/Docs%20V1/Implementation_Roadmap.md): 72-hour milestone breakdown.
- [**Team Roles & Governance**](documentation/Docs%20V1/Team_Roles.md): RACI matrix and interservice contracts.
- [**UI/UX Design Specification**](documentation/Docs%20V1/UI_UX_Design_Specification.md): Design tokens and wireframes.
- [**AI Central Memory & Prompt Governance**](documentation/Docs%20V1/AI_Central_Memory_Architecture_System_Prompt_Governance_Specification.md): Prompt injection defenses.
