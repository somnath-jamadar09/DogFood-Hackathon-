# UI/UX Design Specification & Component Design System — Dogfood 2026
**Document ID:** `UIUX-DOGFOOD-2026-V1`  
**System Title:** Dogfood 2026 User Interface & Experience Specification  
**Target Event:** Hackathon Raptors 2026  
**Author:** Falguni (Frontend & UI/UX Lead)  
**Status:** Approved Design Baseline  

---

> [!TIP]
> **Design Philosophy: High-Density, Dark-Mode-First, Frictionless Execution**  
> Hackathon participants and judges operate under intense cognitive load and time fatigue. The UI prioritizes high contrast, instant visual feedback, rapid keyboard shortcuts for grading, and zero extraneous animations that could degrade local browser performance.

---

## Table of Contents
1. [Design System Tokens & Foundations](#1-design-system-tokens--foundations)
   - [1.1 Color Hierarchy & Semantic Palette](#11-color-hierarchy--semantic-palette)
   - [1.2 Typography Hierarchy](#12-typography-hierarchy)
   - [1.3 Spacing, Elevation & Border Radii](#13-spacing-elevation--border-radii)
2. [Global Navigation & System Health Header](#2-global-navigation--system-health-header)
3. [Component Design Library & Anatomy](#3-component-design-library--anatomy)
   - [3.1 Buttons & Interactive Triggers](#31-buttons--interactive-triggers)
   - [3.2 Input Fields & Form Controls](#32-input-fields--form-controls)
   - [3.3 Interactive Criteria Slider](#33-interactive-criteria-slider)
   - [3.4 Status Badges & Alert Toasts](#34-status-badges--alert-toasts)
4. [Screen Layout Specifications & Wireframes](#4-screen-layout-specifications--wireframes)
   - [4.1 Participant Submission Editor (Dual-Pane)](#41-participant-submission-editor-dual-pane)
   - [4.2 Public Project Showcase & Gallery](#42-public-project-showcase--gallery)
   - [4.3 Judge Evaluation Portal & Rubric Matrix](#43-judge-evaluation-portal--rubric-matrix)
   - [4.4 Organizer Command Center & Analytics Dashboard](#44-organizer-command-center--analytics-dashboard)
5. [User Interaction Flows](#5-user-interaction-flows)
6. [Accessibility (WCAG 2.1 AA) & Responsive Breakpoints](#6-accessibility-wcag-21-aa--responsive-breakpoints)
7. [Document Revision History](#7-document-revision-history)

---

## 1. Design System Tokens & Foundations

Configured directly within `frontend/tailwind.config.js` to ensure uniform styles across all React components.

### 1.1 Color Hierarchy & Semantic Palette

```
+-----------------------------------------------------------------------------------+
|                              COLOR DESIGN TOKENS                                  |
+--------------------------+----------------------------+---------------------------+
| Base Dark Theme          | Primary Interactive Brand  | Semantic Status Indicators|
|                          |                            |                           |
| Background: #0B0F17      | Accent Blue: #3B82F6       | Success / Scored: #10B981 |
| Surface Card: #111827    | Hover Blue: #2563EB        | Pending Review: #F59E0B   |
| Subtle Border: #1F2937   | Glow Tint: #1D4ED8 (20%)   | Conflict / Error: #EF4444 |
| Text Primary: #F9FAFB    | Muted Accent: #6366F1      | Offline Indicator: #059669|
+--------------------------+----------------------------+---------------------------+
```

| Token Name | Hex Code | HSL Value | Semantic Application |
|---|---|---|---|
| `bg-canvas` | `#0B0F17` | `220°, 35%, 7%` | Main page body background |
| `bg-surface` | `#111827` | `220°, 38%, 11%` | Card surfaces, modals, popovers |
| `bg-surface-raised`| `#1F2937` | `217°, 33%, 17%` | Hovered cards, table header rows |
| `border-subtle` | `#374151` | `217°, 19%, 27%` | Card borders, dividers, form outlines |
| `text-primary` | `#F9FAFB` | `210°, 20%, 98%` | High-contrast headings and body text |
| `text-secondary` | `#9CA3AF` | `218°, 11%, 65%` | Captions, metadata, secondary labels |
| `accent-primary` | `#3B82F6` | `217°, 91%, 60%` | Primary action buttons, active tab lines |
| `accent-hover` | `#2563EB` | `221°, 83%, 53%` | Button hover and focus states |
| `status-success` | `#10B981` | `160°, 84%, 39%` | Scored ballots, healthy connection |
| `status-warning` | `#F59E0B` | `38°, 92%, 50%` | Pending submissions, approaching deadlines |
| `status-danger` | `#EF4444` | `0°, 84%, 60%` | Validation errors, rate-limit violations |

### 1.2 Typography Hierarchy
- **Primary Font Family:** `Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `sans-serif` (vendored locally in `public/fonts/`).
- **Monospace Family:** `JetBrains Mono`, `Fira Code`, `monospace` (used for join codes, commit hashes, formulas).

| Style | Font Size | Weight | Line Height | Application |
|---|---|---|---|---|
| **Display 1** | `32px (2.0rem)` | Bold (700) | `1.2` | Hero header, tournament title |
| **Heading 1** | `24px (1.5rem)` | Bold (700) | `1.3` | Page titles, modal headings |
| **Heading 2** | `18px (1.125rem)`| Semi-Bold (600) | `1.4` | Component section headers, card titles |
| **Body Regular** | `14px (0.875rem)`| Normal (400) | `1.5` | Form inputs, project narratives |
| **Caption / Meta** | `12px (0.75rem)` | Medium (500) | `1.4` | Track pills, timestamps, vote tallies |
| **Code Display** | `16px (1.0rem)` | Bold (700) | `1.0` | 6-character team join codes, endpoints |

### 1.3 Spacing, Elevation & Border Radii
- **Spacing Units:** 4px base (`p-1` = 4px, `p-2` = 8px, `p-4` = 16px, `p-6` = 24px, `p-8` = 32px).
- **Border Radii:** Inputs and buttons = `rounded-lg` (8px); Cards and modals = `rounded-xl` (12px).
- **Shadows:** Dark elevation shadows with subtle border glow:
  - `shadow-card`: `0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.5)`
  - `shadow-glow`: `0 0 15px rgba(59, 130, 246, 0.25)`

---

## 2. Global Navigation & System Health Header

The navigation bar persists across all application views:

```
+-----------------------------------------------------------------------------------+
| [RAPTOR LOGO] Dogfood 2026   | Gallery | My Team | Judging | Admin |  (● LOCAL) [Profile] |
+-----------------------------------------------------------------------------------+
```

- **Dynamic Role Tabs:** Shows `Judging` tab only for judges/organizers, and `Admin` tab only for organizers.
- **Offline Health Status Beacon (`(● LOCAL)`):**
  - **Pulsing Green (`#10B981`):** Local Node.js API and MongoDB operational.
  - **Pulsing Amber (`#F59E0B`):** Local API latency $> 300\text{ ms}$.
  - **Solid Red (`#EF4444`):** API unreachable.

---

## 3. Component Design Library & Anatomy

### 3.1 Buttons & Interactive Triggers
- **Primary Button:** Solid Blue `#3B82F6`, text `#FFFFFF`, hover `#2563EB`, focus ring `ring-2 ring-blue-400`.
- **Secondary Button:** Surface `#1F2937`, border `#374151`, hover `#374151`.
- **Danger Button:** Red `#EF4444`, hover `#DC2626`.
- **Disabled State:** Opacity 50%, cursor `not-allowed`.

### 3.2 Input Fields & Form Controls
- **Text Inputs:** Background `#111827`, border `#374151`, text `#F9FAFB`, placeholder `#6B7280`.
- **Focus Ring:** Border transitions to `#3B82F6` with subtle outer glow.
- **Validation Error:** Border `#EF4444`, error caption rendered in red 12px below input.

### 3.3 Interactive Criteria Slider
- **Track Rail:** Height 6px, background `#1F2937`, filled track `#3B82F6`.
- **Slider Thumb:** Diameter 20px, background `#FFFFFF`, border 2px `#3B82F6`, shadow-md.
- **Keyboard Navigation:** Left/Right arrow keys increment/decrement by $0.5$. Value displayed prominently in real time.

---

## 4. Screen Layout Specifications & Wireframes

### 4.1 Participant Submission Editor (Dual-Pane)

```
+-----------------------------------------------------------------------------------+
| PROJECT SUBMISSION: "Neural Raptor"                       [Deadline: 02h 15m 30s] |
+-----------------------------------------+-----------------------------------------+
| Left Column: Form Controls              | Right Column: Live Markdown Preview     |
|                                         |                                         |
| Title: [ Neural Raptor                ] | # Neural Raptor                         |
| Tagline: [ AI submission engine       ] | *AI submission engine*                  |
| Track: (● AI/ML)  ( ) Web3  ( ) FinTech |                                         |
| GitHub Repo: [ https://github.com/... ] | ### Architecture Overview               |
| Video Demo URL: [ https://...         ] | Neural Raptor deploys a dual-service    |
| Thumbnail: [ Drag & Drop File Upload  ] | offline architecture...                 |
|                                         |                                         |
| Markdown Description Editor:            | [Local Thumbnail Preview]               |
| [Write Mode] [Preview Mode]             | +-------------------------------------+ |
| ```markdown                             | | [ Image: neural-architecture.webp ] | |
| ### Architecture Overview               | +-------------------------------------+ |
| ...                                     |                                         |
+-----------------------------------------+-----------------------------------------+
| [ Save Draft ]                                    [ Submit Final Project (Lock) ] |
+-----------------------------------------------------------------------------------+
```

### 4.2 Public Project Showcase & Gallery

```
+-----------------------------------------------------------------------------------+
| PUBLIC PROJECT SHOWCASE                                                           |
| Search: [ Search by title, team, or keyword... ]   Sort: [ Highest Rated | Newest ]|
| Filter by Track: [ All Tracks (15) ] [ AI/ML (6) ] [ Web3 (5) ] [ FinTech (4) ]   |
+-----------------------------------------------------------------------------------+
|  +---------------------------+  +---------------------------+  +----------------+ |
|  | [ Thumbnail Preview ]     |  | [ Thumbnail Preview ]     |  | [ Thumbnail ]  | |
|  | Track: [ AI/ML Badge ]    |  | Track: [ Web3 Badge ]     |  | Track: [FinTech| |
|  | Title: Neural Raptor      |  | Title: RaptorDAO          |  | Title: PayRapt | |
|  | Team: CyberDinos (3)      |  | Team: HashRaptors (4)     |  | Team: CashRex  | |
|  | "Autonomous offline AI"   |  | "Decentralized consensus" |  | "Instant pay"  | |
|  | [▲ Upvote (42)] [Details] |  | [▲ Upvote (38)] [Details] |  | [▲ Upvote (19)]| |
|  +---------------------------+  +---------------------------+  +----------------+ |
+-----------------------------------------------------------------------------------+
```

### 4.3 Judge Evaluation Portal & Rubric Matrix

```
+-----------------------------------------------------------------------------------+
| EVALUATION QUEUE: Project 2 of 5                               [ Track: AI/ML ]   |
+-----------------------------------------+-----------------------------------------+
| Left Panel: Project Review              | Right Panel: Interactive Scoring Rubric |
|                                         |                                         |
| Project Title: Neural Raptor            | 1. Technical Execution (Weight: 30%)    |
| Team: CyberDinos                        | [----●---------------------] 8.0 / 10   |
| Repo: [github.com/raptors/neural] (Link)|                                         |
|                                         | 2. Innovation & Originality (Weight: 25%)|
| Project Narrative:                      | [-------●------------------] 9.0 / 10   |
| Neural Raptor implements an offline-    |                                         |
| first scoring engine using Bayesian     | 3. Practical Impact (Weight: 25%)       |
| shrinkage...                            | [---●----------------------] 7.5 / 10   |
|                                         |                                         |
| [View Architecture Diagram (Image)]     | 4. Polish & Presentation (Weight: 20%)  |
|                                         | [--------●-----------------] 8.5 / 10   |
| Private Judge Notes:                    |                                         |
| [ Exceptional ML implementation...    ] | Composite Raw Score: 8.25 / 10.0        |
+-----------------------------------------+-----------------------------------------+
| [ < Previous Project ]                            [ Submit Final Evaluation Score ]|
+-----------------------------------------------------------------------------------+
```

### 4.4 Organizer Command Center & Analytics Dashboard

```
+-----------------------------------------------------------------------------------+
| ORGANIZER COMMAND CENTER                                                          |
| [ Total Teams: 15 ] [ Submissions: 15 ] [ Judges: 6 ] [ Ballots Submitted: 45/45 ] |
+-----------------------------------------------------------------------------------+
| Actions: [ Run Judge Assignment ] [ Compute Normalization ] [ Download CSV Export]|
+-----------------------------------------------------------------------------------+
| TOURNAMENT LEADERBOARD                                                            |
| View Mode: ( ) Raw Average Scores       (●) Z-Score Normalized (Bayesian Adjusted)|
|                                                                                   |
| Rank | Project Title | Track  | Raw Mean | Z-Score | Normalized (0-100) | Status  |
|  1   | Neural Raptor | AI/ML  | 8.25     | +1.84   | 96.5               | Ranked  |
|  2   | RaptorDAO     | Web3   | 8.40     | +1.42   | 92.1               | Ranked  |
|  3   | QuantRaptor   | FinTech| 7.90     | +0.95   | 86.8               | Ranked  |
+-----------------------------------------------------------------------------------+
| SCORE VARIANCE VISUALIZATION (Recharts)                                           |
| [ Bar Chart displaying Raw Judge Severities vs. Normalized Project Distributions] |
+-----------------------------------------------------------------------------------+
```

---

## 5. User Interaction Flows

```mermaid
sequenceDiagram
    autonumber
    actor Participant
    participant Browser as React Frontend
    participant Server as Node.js Backend

    Participant->>Browser: Enters Title, Markdown, Track
    Browser->>Browser: Renders Sanitized Markdown Preview
    Participant->>Browser: Clicks "Save Draft"
    Browser->>Server: POST /api/v1/submissions (draft)
    Server-->>Browser: HTTP 200 OK (draft saved)
    Browser->>Participant: Displays green toast: "Draft saved locally"

    Participant->>Browser: Clicks "Submit Final Project"
    Browser->>Browser: Prompts confirmation modal
    Participant->>Browser: Confirms Lock
    Browser->>Server: POST /api/v1/submissions/finalize
    Server-->>Browser: HTTP 200 OK (status: submitted)
    Browser->>Participant: Renders submission locked badge
```

---

## 6. Accessibility (WCAG 2.1 AA) & Responsive Breakpoints

1. **Accessibility Compliance:**
   - **Contrast Ratio:** Every text token exceeds $\ge 4.5:1$ against `#0B0F17` and `#111827`.
   - **Keyboard Navigable:** Full Tab and Shift-Tab navigation with visible focus outlines.
   - **ARIA Attributes:** Sliders declare `aria-valuemin="1"`, `aria-valuemax="10"`, `aria-valuenow="8.0"`.
2. **Responsive Breakpoints:**
   - **Mobile (`< 768px`):** Single-column stacked layouts, bottom tab bar.
   - **Tablet (`768px - 1024px`):** 2-column cards, collapsible judging queue.
   - **Desktop (`>= 1024px`):** Full side-by-side dual-pane split views.

---

## 7. Document Revision History

| Version | Date | Author(s) | Summary of Changes |
|---|---|---|---|
| `v1.0.0` | Sept 2026 | Falguni (Frontend Lead) | Complete UI/UX design tokens, component specifications, and wireframes approved. |
