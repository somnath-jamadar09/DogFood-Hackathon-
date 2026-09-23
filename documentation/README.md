# Dogfood 2026 — Master Documentation Portal

Welcome to the comprehensive documentation suite for **Dogfood 2026**, an offline-first, self-hosted hackathon submission, judging, and community platform built for Hackathon Raptors 2026.

```
       +-------------------------------------------------------+
       |               Dogfood 2026 Architecture               |
       |  Air-Gapped • Self-Hosted • Statistical Normalization  |
       +---------------------------+---------------------------+
                                   |
         +-------------------------+-------------------------+
         |                                                   |
+--------v--------+       +-------------------+       +------v------+
| React Frontend  | ----> |  Node/Express API | <---> |   FastAPI   |
|   (Port 3000)   | REST  |    (Port 5000)    | REST  | (Port 8000) |
+-----------------+       +---------+---------+       +-------------+
                                    |
                          +---------v---------+
                          |   MongoDB 7.0     |
                          |   (Port 27017)    |
                          +-------------------+
```

---

## 📚 Documentation Index (Docs V1)

| Document | Identifier | Target Audience | Primary Focus & Summary |
|---|---|---|---|
| [**PRD.md**](file:///c:/Users/jamad/Desktop/DogFood%20Hackathon/documentation/Docs%20V1/PRD.md) | `PRD-DOGFOOD-2026-V1` | Organizers, Product, All | Product vision, competitive differentiation, user personas, 4-tier build scope, and success criteria. |
| [**SRS.md**](file:///c:/Users/jamad/Desktop/DogFood%20Hackathon/documentation/Docs%20V1/SRS.md) | `SRS-DOGFOOD-2026-V1` | Engineers, QA, Evaluators | IEEE 830-compliant functional requirements (`SRS-F01` to `SRS-F23`), non-functional SLAs, and traceability matrix. |
| [**SDD.md**](file:///c:/Users/jamad/Desktop/DogFood%20Hackathon/documentation/Docs%20V1/SDD.md) | `SDD-DOGFOOD-2026-V1` | Developers, Architects | Software design, complete Mongoose schemas, Pydantic DTOs, Z-score & Bayesian math proofs, REST API catalog, and security middleware. |
| [**Architectural Blueprint**](file:///c:/Users/jamad/Desktop/DogFood%20Hackathon/documentation/Docs%20V1/Architectural_Blueprint.md) | `ARCH-DOGFOOD-2026-V1` | DevOps, SysAdmins | Multi-container Docker Compose v2 architecture, multi-stage Dockerfiles, network isolation, persistence volumes, and air-gap verification. |
| [**Implementation Roadmap**](file:///c:/Users/jamad/Desktop/DogFood%20Hackathon/documentation/Docs%20V1/Implementation_Roadmap.md) | `ROADMAP-DOGFOOD-2026-V1` | Team Leads, Organizers | Hour-by-hour 72-hour execution plan, Gantt chart, Work Breakdown Structure (WBS), risk fallbacks, and Definition of Done. |
| [**Team Roles & Governance**](file:///c:/Users/jamad/Desktop/DogFood%20Hackathon/documentation/Docs%20V1/Team_Roles.md) | `ROLES-DOGFOOD-2026-V1` | Core Engineering Trio | Skill matrices (Somnath, Falguni, Om Apar), granular RACI matrix, inter-service HTTP contracts, and Git workflows. |
| [**UI/UX Design Specification**](file:///c:/Users/jamad/Desktop/DogFood%20Hackathon/documentation/Docs%20V1/UI_UX_Design_Specification.md) | `UIUX-DOGFOOD-2026-V1` | Frontend Developers, Designers | High-density dark design tokens, typography, component anatomy, ASCII screen wireframes, and WCAG 2.1 AA accessibility standards. |
| [**AI Memory & Prompt Governance**](file:///c:/Users/jamad/Desktop/DogFood%20Hackathon/documentation/Docs%20V1/AI_Central_Memory_Architecture_System_Prompt_Governance_Specification.md) | `AI-GOV-DOGFOOD-2026-V1` | AI/ML Engineers, Evaluators | 3-tier central memory architecture, standardized prompt templates, adversarial prompt injection defense, and human-in-the-loop policies. |

---

## 🧭 Recommended Reading Pathways

### 1. For Tournament Evaluators & Judges:
1. Start with [**PRD.md**](file:///c:/Users/jamad/Desktop/DogFood%20Hackathon/documentation/Docs%20V1/PRD.md) (Sections 1 & 2) to understand the offline mandate and competitive edge.
2. Review [**SRS.md**](file:///c:/Users/jamad/Desktop/DogFood%20Hackathon/documentation/Docs%20V1/SRS.md) (Section 4.7 & 4.8) for score isolation and normalization guarantees.
3. Review [**SDD.md**](file:///c:/Users/jamad/Desktop/DogFood%20Hackathon/documentation/Docs%20V1/SDD.md) (Section 5) for the mathematical proof and numerical worked example.

### 2. For Core Full-Stack Developers:
1. Review [**Team_Roles.md**](file:///c:/Users/jamad/Desktop/DogFood%20Hackathon/documentation/Docs%20V1/Team_Roles.md) for ownership domains, RACI assignments, and inter-service schemas.
2. Study [**SDD.md**](file:///c:/Users/jamad/Desktop/DogFood%20Hackathon/documentation/Docs%20V1/SDD.md) for Mongoose models, Pydantic schemas, and the REST API catalog.
3. Reference [**Implementation_Roadmap.md**](file:///c:/Users/jamad/Desktop/DogFood%20Hackathon/documentation/Docs%20V1/Implementation_Roadmap.md) for sprint milestones and tasks.

### 3. For Frontend & UI Engineers:
1. Examine [**UI_UX_Design_Specification.md**](file:///c:/Users/jamad/Desktop/DogFood%20Hackathon/documentation/Docs%20V1/UI_UX_Design_Specification.md) for Tailwind tokens, component states, and ASCII wireframes.
2. Cross-reference [**SDD.md**](file:///c:/Users/jamad/Desktop/DogFood%20Hackathon/documentation/Docs%20V1/SDD.md) (Section 6) for endpoint query parameters and payloads.
3. Reference [**Implementation_Roadmap.md**](file:///c:/Users/jamad/Desktop/DogFood%20Hackathon/documentation/Docs%20V1/Implementation_Roadmap.md) for sprint milestones and tasks.

### 4. For DevOps & System Operators:
1. Review [**Architectural_Blueprint.md**](file:///c:/Users/jamad/Desktop/DogFood%20Hackathon/documentation/Docs%20V1/Architectural_Blueprint.md) for Docker Compose configs, multi-stage builds, and persistence mounts.
2. Follow the Air-Gap Verification Protocol in Section 7 of the Blueprint.
3. Reference [**Implementation_Roadmap.md**](file:///c:/Users/jamad/Desktop/DogFood%20Hackathon/documentation/Docs%20V1/Implementation_Roadmap.md) for sprint milestones and tasks.

---

## ⚡ Quickstart Deployment Command

```bash
# Clone the repository
git clone https://github.com/HackathonRaptors/dogfood-2026.git
cd dogfood-2026

# Launch the entire air-gapped platform with seed data
docker compose up --build
```

- **Frontend Application:** `http://localhost:3000`
- **Backend Core API:** `http://localhost:5000/api/v1`
- **Judging Analytics Microservice:** `http://localhost:8000` *(Internal network only)*
- **MongoDB Database:** `mongodb://localhost:27017/dogfood`
