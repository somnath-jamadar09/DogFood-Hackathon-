# Dogfood 2026 — Project Brief

## What We're Actually Building

In one line: **a hackathon submission-and-judging platform** — the same kind of system Unstop, Devpost, or MLH run, but built by us, for Hackathon Raptors to self-host and actually use for their next events.

Think of it as three connected systems stacked on top of each other:

1. **A participant-facing app** — register, form a team, submit a project, edit it until the deadline, browse a public gallery of everyone else's submissions.
2. **A judging system** — organizers invite judges, assign them projects, judges score against a weighted rubric, and the platform turns raw scores into a fair final ranking even though every judge scores differently.
3. **A public layer** — anyone can vote/comment on projects, with protections against fake votes and spam.

The twist that makes this different from a normal CRUD project: **the whole thing has to run with zero internet dependency.** No hosted database, no cloud auth provider, no external APIs. Just `docker compose up`, and it works — because the actual goal is for Hackathon Raptors to clone our repo and run their next hackathon on it.

## Why This Is Harder Than It Sounds

Anyone can build "register → submit → list projects." The part that separates a real submission from a toy one:

- **Authorization that survives a direct API call.** A judge shouldn't see another judge's scores or another track's projects — not just hidden in the UI, but blocked at the backend even if someone bypasses the frontend entirely.
- **Fair scoring across inconsistent judges.** Judge A rates everything 4–5. Judge B never goes above a 3. A plain average makes Judge B's projects look worse for no real reason — we need to mathematically correct for that (normalization).
- **Judge assignment as a real constraint problem.** Spread N projects across M judges, respecting track boundaries, conflict-of-interest exclusions, and balanced workload — not just random assignment.
- **Voting that can't be gamed.** Rate limits, duplicate/bot detection, audit trails — someone could otherwise just create 50 accounts and vote-stuff.
- **Offline-first architecture.** Everything runs locally in containers with seed data — no signup, no cloud service, no "works on my machine."

## The Four Tiers (Build Order)

| Tier | What It Adds | Priority |
|---|---|---|
| T1 — Core | Auth, roles, events, teams, submissions, public gallery | Mandatory — nothing below this gets judged |
| T2 — Judging | Judge assignment, weighted rubrics, backend-enforced isolation, score normalization, CSV export | Highest value — 25% of score alone, and hardest to fake |
| T3 — Public | Voting, comments, anti-abuse protections, audit trails | Build after T1+T2 are solid |
| T4 — Stretch | Public REST API, webhooks, certificate generation, embeddable widget | Optional — only if time remains |

**Strategy:** T1 → strong T2 → pick one standout feature (probably score normalization or pairwise judging) → bonuses → polish. A clean T2 beats a half-working T4, every time.

---

## Proposed Tech Stack

Matched to what the three of us already know, so we're not learning tools mid-hackathon.

### Core Platform (Somnath + Falguni — MERN)
- **Frontend:** React (Vite) + Tailwind CSS — fast to build, both of us know it
- **Backend:** Node.js + Express — REST API layer for auth, events, teams, submissions, voting
- **Database:** MongoDB — flexible schema, fast to iterate under time pressure; Mongoose for modeling
- **Auth:** JWT-based sessions with role middleware (visitor/participant/judge/organizer/admin) enforced at the route/controller level — not just in the frontend

### Judging & Normalization Service (Om Apar — ML/stats)
- **Language:** Python + FastAPI — a small internal service (or a module within the Node backend) that owns:
  - Cross-judge score normalization (z-score or Bayesian shrinkage per judge)
  - Bradley-Terry estimator for the Pairwise Mode bonus
  - Voting-abuse / anomaly detection on vote patterns
- Talks to the main backend over an internal REST call or shares the same MongoDB instance

### Infrastructure
- **Docker Compose** — one command (`docker compose up`) brings up: React frontend, Node/Express API, Python normalization service, MongoDB — all seeded with fixture data on first boot
- **No external dependencies** — no Auth0/Firebase, no hosted DB, no third-party API calls at runtime
- **Testing:** Jest/Supertest for the Node API, Pytest for the Python service
- **Docs:** README.md, ARCHITECTURE.md, DATA-MODEL.md, JUDGING.md (required deliverables — see full hackathon report)

### Why This Stack
- Zero new tools to learn under time pressure — Somnath and Falguni are both MERN-fluent, Om Apar's ML skills map directly onto FastAPI + Python's stats/ML ecosystem (NumPy/SciPy/Pandas)
- MongoDB's document model is fast to reshape as the schema evolves across 72 hours (submissions, rubrics, ballots all have variable shapes)
- Docker Compose is the simplest way to satisfy the "runs offline, one command" requirement, which is worth 20% of the score on its own

---

## Rough System Shape

```
                ┌─────────────────────┐
                │   React Frontend     │
                │  (participant/judge/  │
                │   organizer views)    │
                └──────────┬───────────┘
                           │ REST
                ┌──────────▼───────────┐
                │  Node/Express API     │
                │  auth, events, teams,  │
                │  submissions, voting   │
                └───┬───────────────┬───┘
                    │               │
            ┌───────▼─────┐   ┌─────▼──────────┐
            │  MongoDB     │   │  FastAPI Service │
            │ (all data)   │   │  normalization,   │
            │              │   │  pairwise ranking,│
            │              │   │  abuse detection  │
            └──────────────┘   └───────────────────┘

        All four containers wired together via docker-compose.yml
        No external network calls required to run the app.
```

This is the whole project in one picture: participants and judges interact through the same web app, everything's stored in one local database, and the "smart" scoring logic lives in a dedicated Python service so the ML piece stays cleanly separated from the CRUD piece.
