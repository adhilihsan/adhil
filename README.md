# PrepAgent: Autonomous Student Question Paper Practice Agent

> **An intelligent, student-centered exam preparation platform that transforms curriculum syllabi and past exam papers into personalized practice papers, timed mock tests, rubric-level evaluations, and adaptive study schedules.**

[![React](https://img.shields.io/badge/React-18.3-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Status](https://img.shields.io/badge/Build-Passing-10b981?style=flat-square)]()

---

## 📖 Table of Contents

1. [Project Overview & Philosophy](#-project-overview--philosophy)
2. [Key Capabilities at a Glance](#-key-capabilities-at-a-glance)
3. [System Architecture](#-system-architecture)
4. [Step-by-Step User Journey & Screen Guide](#-step-by-step-user-journey--screen-guide)
   - [1. Landing Screen](#1-landing-screen)
   - [2. Authentication & Quick Student Demo](#2-authentication--quick-student-demo)
   - [3. Student Onboarding Wizard](#3-student-onboarding-wizard)
   - [4. Dashboard Hub](#4-dashboard-hub)
   - [5. Syllabus & Past Papers Manager](#5-syllabus--past-papers-manager)
   - [6. Adaptive Study Plan & Roadmap](#6-adaptive-study-plan--roadmap)
   - [7. Interactive Practice Session](#7-interactive-practice-session)
   - [8. Timed Mock Examination Simulator](#8-timed-mock-examination-simulator)
   - [9. Exam Results & Rubric Review](#9-exam-results--rubric-review)
   - [10. Progress Analytics & Mastery Breakdown](#10-progress-analytics--mastery-breakdown)
   - [11. Settings, Uploaded Files & Data Privacy](#11-settings-uploaded-files--data-privacy)
5. [The Autonomous AI Agent Engine](#-the-autonomous-ai-agent-engine)
   - [Topic Decomposition & Pattern Analyzer](#a-topic-decomposition--pattern-analyzer)
   - [Exam-Style Question Generator](#b-exam-style-question-generator)
   - [Rubric Evaluation & Scoring Scorer](#c-rubric-evaluation--scoring-scorer)
   - [Exam Readiness Index Formula](#d-exam-readiness-index-formula)
   - [Adaptive Schedule Pacing Algorithm](#e-adaptive-schedule-pacing-algorithm)
6. [Supported Question Archetypes & Marking Rubrics](#-supported-question-archetypes--marking-rubrics)
7. [Installation & Setup Guide](#-installation--setup-guide)
8. [Configuration & Environment Variables](#-configuration--environment-variables)
9. [Project Directory Layout](#-project-directory-layout)
10. [Educational & Evaluation Disclaimer](#-educational--evaluation-disclaimer)
11. [Troubleshooting & FAQ](#-troubleshooting--faq)

---

## 🎯 Project Overview & Philosophy

Preparing for major examinations (such as Class 10 & 12 Board Exams, CBSE, ICSE, Cambridge A-Levels, AP, SAT, or University Finals) often causes significant anxiety. Students typically suffer from three fundamental problems:
1. **Passive Revision:** Students re-read textbooks rather than practicing active question recall.
2. **Generic Question Banks:** Available question sets are rarely tailored to the student's exact syllabus weightages or current weak topics.
3. **Lack of Constructive Feedback:** While objective questions are easy to score, written answers and multi-step numericals are rarely evaluated with clear marking rubrics.

**PrepAgent** solves these challenges by acting as an autonomous personal practice agent. It ingests the student's syllabus documents and past board exam papers, extracts recurring question themes, creates a day-by-day study roadmap, generates realistic practice sessions, and evaluates both objective and written answers using transparent marking rubrics.

---

## ✨ Key Capabilities at a Glance

- **Multi-Format Document Ingestion:** Upload syllabus copies and past papers in PDF, TXT, DOCX, or Markdown format, or paste raw curriculum text.
- **Pre-Use Topic Review:** Automatically extracts chapter names, estimated weightage %, and subtopics, and allows students to edit, rename, or adjust topics before saving.
- **Multi-Archetype Question Engine:** Supports 1-mark Multiple Choice, 3-mark Numerical Calculations (with unit and tolerance validation), 2-mark Short Conceptual Explanations, and 5-mark Multi-step Derivations.
- **Rubric-Level Evaluation:** Evaluates written answers criterion-by-criterion against reference solutions, highlighting key strengths and missing points.
- **Full Timed Mock Simulator:** Configurable duration (30, 60, 90, 180 mins) with live countdown timer, `< 5 min` pulse warning, question palette (Answered, Flagged, Unattempted), and pre-submission confirmation.
- **Autosave Protection:** Continuous synchronization to `localStorage` ensures answers and session states survive accidental page refreshes or navigation.
- **Personalized Study Roadmap:** Generates daily study blocks (Revision, Topic Practice, Weakness Booster, Mock Test) tailored to target exam date and daily available study minutes.
- **Exam Readiness Index:** Real-time percentage indicator (0–100%) weighted by chapter exam importance.
- **100% Offline Capable with Optional Gemini API:** Out of the box, PrepAgent operates fully offline using a built-in heuristic agent. If a `GEMINI_API_KEY` is provided on the backend, it seamlessly enhances extraction without exposing credentials in client-side code.

---

## 🏗️ System Architecture

```
+---------------------------------------------------------------------------------+
|                                 CLIENT BROWSER                                  |
|                                                                                 |
|  +---------------------+   +---------------------+   +-----------------------+  |
|  |     React Views     |   |   Component State   |   |   LocalStorage Cache  |  |
|  | - Dashboard         |   | - Active Session    |   | - Student Profile     |  |
|  | - Syllabus & Upload |<->| - Question Palette  |<->| - Topics & Weightages |  |
|  | - Timed Mock Exam   |   | - Timer & Flags     |   | - Completed History   |  |
|  | - Results & Rubric  |   | - Study Schedule    |   | - Uploaded Documents  |  |
|  +---------------------+   +---------------------+   +-----------------------+  |
|            |                                                                    |
|            v                                                                    |
|  +---------------------------------------------------------------------------+  |
|  |                          AIAgentService (Client)                          |  |
|  |  - Topic Extractor & Parser        - Answer Rubric Evaluator              |  |
|  |  - Question Synthesizer            - Readiness Index Calculator           |  |
|  |  - Topic Mastery Updater           - Adaptive Pacing Generator            |  |
|  +---------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------+
                                      |
                       HTTP API / Reverse Proxy (/api/*)
                                      |
                                      v
+---------------------------------------------------------------------------------+
|                               EXPRESS BACKEND                                   |
|                                                                                 |
|  +---------------------------+       +---------------------------------------+  |
|  |   Static Asset Server     |       |         AI Proxy Controller           |  |
|  |   (dist/index.html & js)  |       |   POST /api/ai/extract-syllabus       |  |
|  +---------------------------+       |   GET  /api/health                    |  |
|                                      +---------------------------------------+  |
|                                                          |                      |
|                                                          v (Optional Key)       |
|                                              +-----------------------+          |
|                                              | Google Gemini 1.5 API |          |
|                                              +-----------------------+          |
+---------------------------------------------------------------------------------+
```

---

## 📱 Step-by-Step User Journey & Screen Guide

### 1. Landing Screen
- **Purpose:** Welcoming, non-intimidating entry point.
- **Key Elements:**
  - Hero banner with headline: *"Practice the exact exam questions you need to conquer your syllabus."*
  - **Start Practice (Pre-loaded Class 12 Physics)** 1-click test drive button.
  - 4-step interactive explanation cards: Add Syllabus ➔ Generate Questions ➔ Rubric Feedback ➔ Adaptive Study Plan.
  - Timed Mock Exam feature callout.

### 2. Authentication & Quick Student Demo
- **Purpose:** Frictionless access for both returning students and evaluators.
- **Key Elements:**
  - Email/Password Sign In and Sign Up tabs.
  - **Quick Tryout Button:** *"Continue as Demo Student (Alex)"* preloaded with 6 physics chapters, 3 board exam past papers, and active practice sessions.

### 3. Student Onboarding Wizard
- **Step 1:** Full Name, Email, Grade (Class 10, Class 12, Senior, College, Competitive), and Exam Board (CBSE, ICSE, Cambridge, AP/SAT, IB, University).
- **Step 2:** Subject Name (e.g. *Chemistry*), Subject Code (*043*), and Target Exam Date.
- **Step 3:** Daily Study Target (30, 45, 60, 90, 120 mins/day), Preferred Starting Difficulty (Easy, Medium, Hard), and Initial Syllabus Chapters input.

### 4. Dashboard Hub
- **Purpose:** The student's primary command center.
- **Key Elements:**
  - **Hero Action Card:** Shows primary action (*"Continue Adaptive Practice"* or *"Start Timed Mock Exam"*).
  - **Countdown & Pacing Strip:** Displays days remaining until exam date, exam readiness score, questions solved, and active streak.
  - **Priority Weak Topic Card:** Flags the chapter with the lowest mastery score relative to exam weightage with a 1-click *"Practice This Topic Now"* button.
  - **Study Plan Roadmap:** Displays today's scheduled sessions with interactive completion checkboxes.
  - **Topic Mastery Breakdown:** Quick view of all chapters with color-coded mastery progress bars.
  - **Recent Practice History:** Log of recently finished practice and mock sessions with direct score links.

### 5. Syllabus & Past Papers Manager
- **Syllabus Topics Tab:**
  - Shows each chapter, description, estimated weightage %, subtopics pill list, difficulty badge, and mastery level.
  - Edit inline: rename topics, change exam weightages, add or remove subtopics.
  - Add topic manually or upload document files.
- **Review Extracted Topics Modal:**
  - When a document is parsed, students review the extracted list of chapters and weightages in a modal, adjust values, and approve before adding to their syllabus.
- **Past Papers Tab:**
  - Lists indexed past papers with exam board, year, total marks, duration, and extracted question count.
  - Action button: *"Practice Exam Pattern"* directly launches questions sourced from that paper.

### 6. Adaptive Study Plan & Roadmap
- **Purpose:** Manages time pacing up to the target exam date.
- **Key Elements:**
  - Overall plan completion progress bar and total hours projected.
  - Day-by-day timeline cards categorized by session type:
    - 🔵 **Concept Revision:** Key formulas and textbook review.
    - 🟢 **Topic Drill:** Focused practice on specific chapters.
    - 🔴 **Weakness Booster:** Intensive practice on topics below 60% mastery.
    - 🟣 **Timed Mock:** Simulated full-length exam.
  - **Reschedule Button:** Adjust date of any session.
  - **Re-plan with Agent:** Recalculates the entire timeline dynamically.

### 7. Interactive Practice Session
- **Purpose:** Focused, step-by-step active recall practice.
- **Key Elements:**
  - Question counter and chapter tag.
  - Question palette navigation strip.
  - Bookmark and hint controls.
  - Instant **Submit & Evaluate** button.
  - Rubric criteria points awarded, overall feedback, key strengths, and missing points checklist.
  - Model solution toggle and **Retry This Question** option.

### 8. Timed Mock Examination Simulator
- **Start Screen:** Configurable duration (30 to 180 minutes), question count, difficulty, and clear exam rules.
- **Active Exam Interface:**
  - Prominent countdown timer that pulses red when under 5 minutes remaining.
  - Question palette with 4 distinct states: Answered (green), Flagged (purple), Unattempted (gray), Current (blue).
  - Next/Previous controls and **Flag for Review** toggle.
  - Continuous autosave to `localStorage`.
- **Pre-Submit Confirmation Modal:** Summarizes answered vs. unanswered vs. flagged counts before locking answers.

### 9. Exam Results & Rubric Review
- **Scorecard Header:** Overall score, percentage, letter grade, and confetti celebration for passing marks.
- **Automated Marking Notice:** Disclaimer that scores are rubric estimates.
- **Topic-by-Topic Breakdown:** Visual bars showing marks obtained vs. total marks per syllabus unit.
- **Agent Recommendation:** Suggests next topic to study based on the lowest scoring area.
- **Question-by-Question Review:** Filter by All, Needs Improvement, or Bookmarked; inspect student submitted answer side-by-side with reference solution and rubric points.

### 10. Progress Analytics & Mastery Breakdown
- **Metric Cards:** Exam Readiness %, Overall Accuracy %, Average Time per Question, and Active Streak.
- **Visual Trends Chart:** Upward trajectory bar chart comparing practice drills and timed mock scores over time.
- **Priority Action Areas:** Lists weak chapters needing immediate drill work alongside strong chapters.

### 11. Settings, Uploaded Files & Data Privacy
- **Student Profile:** Update name, email, grade, board, exam deadline, and daily study goal.
- **Uploaded Materials Manager:** Inspect and delete individual syllabus copies and past paper files.
- **Data & Privacy Controls:** 1-click **Reset & Reload Sample Data** or **Clear All Local Storage Data**.

---

## 🧠 The Autonomous AI Agent Engine

Located in [`src/services/aiAgentService.ts`](file:///c:/Users/AVINASH/Documents/adhil/src/services/aiAgentService.ts).

### A. Topic Decomposition & Pattern Analyzer
Ingests unstructured text and partitions it using regular expression heuristics and section header recognition:
- Identifies chapter headers (`Chapter`, `Unit`, `Module`, numbered lists).
- Extracts bulleted items into subtopics.
- Normalizes weightages across chapters so the sum equals 100%.

### B. Exam-Style Question Generator
Synthesizes questions matched to:
- **Selected Topic & Subtopic:** Pulls from real board past paper templates or generates targeted conceptual problems.
- **Target Difficulty:** Calibrates distractors for MCQs or complexity for numericals and derivations.
- **Bloom's Taxonomy:** Targets Remember, Understand, Apply, Analyze, or Evaluate based on chapter trends.

### C. Rubric Evaluation & Scoring Scorer
Evaluates student answers:
1. **MCQ:** Matches choice string directly.
2. **Numerical:** Parses numeric value using regex, calculates deviation $|V_{\text{student}} - V_{\text{target}}|$, checks tolerance interval $\pm \delta$, and verifies SI units.
3. **Written Answers:**
   - Extracts non-stopword terminology from reference answer.
   - Computes keyword coverage ratio $R_{\text{kw}} = \frac{N_{\text{matched}}}{N_{\text{unique}}}$.
   - Computes length/elaboration ratio $R_{\text{len}} = \min\left(1.2, \frac{\text{words}_{\text{student}}}{\text{words}_{\text{ref}}}\right)$.
   - Evaluates each rubric criterion individually and provides strengths and missing points.

### D. Exam Readiness Index Formula
The overall readiness score is computed as a weighted average of individual chapter masteries:

$$\text{Readiness Index} = \frac{\sum_{i=1}^{n} \left(\text{Mastery}_i \times \text{Weight}_i\right)}{\sum_{i=1}^{n} \text{Weight}_i}$$

Where:
- $\text{Mastery}_i$: Accuracy percentage of attempted questions in Chapter $i$ (bounded between $15\%$ and $100\%$).
- $\text{Weight}_i$: Estimated syllabus weightage percentage of Chapter $i$.

### E. Adaptive Schedule Pacing Algorithm
Divides the days remaining until exam day into daily study blocks. Dynamically schedules:
- **Topic Drills:** For standard progress.
- **Weakness Boosters:** For chapters where mastery $< 60\%$.
- **Timed Mock Exams:** Scheduled every 4th day to benchmark exam stamina.

---

## 📝 Supported Question Archetypes & Marking Rubrics

### 1. Multiple Choice (1 Mark)
```
Question: A point charge +q is placed at the center of a cubical Gaussian surface of edge length L.
          What is the total electric flux emerging through only one face of the cube?
Options:
  [A] q / (6 * ε₀)  (Correct)
  [B] q / ε₀
  [C] q / (4π * ε₀ * L²)
  [D] 6q / ε₀
Scoring: Exact match. Explanation provides Gauss's Law derivation.
```

### 2. Numerical Calculation (3 Marks)
```
Question: A long straight wire carries a steady electric current of 5.0 A.
          Calculate the magnitude of the magnetic field B at a perpendicular
          distance of 4.0 cm from the axis of the wire. (μ₀ = 4π × 10⁻⁷ T·m/A).
Target Answer: 25 µT
Tolerance: ±0.5 µT
Formula: B = (μ₀ * I) / (2π * r)
Scoring: Full marks if within tolerance; half marks if within 4x tolerance.
```

### 3. Short Conceptual Answer (2 Marks)
```
Question: Define drift velocity of free electrons. How does it change when the
          potential difference applied across the conductor is doubled?
Rubric Breakdown:
  - Definition of Drift Velocity (1 Mark): Average velocity in opposite direction of field.
  - Effect of Doubling Potential Difference (1 Mark): States vd ∝ V, correctly concludes it doubles.
```

### 4. Long Derivation & Multi-Part Problem (5 Marks)
```
Question: (a) Derive condition of electrical resonance in a series LCR circuit.
          (b) Calculate resonant frequency with given L and C.
          (c) Calculate average power transferred at resonance.
Rubric Breakdown:
  - Resonance Condition & Derivation: 2.0 Marks
  - Numerical Calculation of ω_r: 1.5 Marks
  - Power at Resonance (P = V_rms * I_rms): 1.5 Marks
```

---

## ⚙️ Installation & Setup Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0.0 or higher)
- npm (version 9.0.0 or higher)

### 1. Clone or Open the Repository
```bash
cd c:\Users\AVINASH\Documents\adhil
```

### 2. Install Project Dependencies
```bash
npm install
```

### 3. Build the Application
```bash
npm run build
```
This runs TypeScript validation (`tsc --noEmit`) and compiles optimized static assets to `dist/`.

### 4. Start the Application
You can run the application in two ways:

#### Option A: Full-Stack Production Server (Recommended)
```bash
npm run server
```
- Starts the Express backend on **`http://localhost:3001`**.
- Serves the compiled React frontend, handles API proxying, and enables offline intelligent scoring.

#### Option B: Vite Development Server
```bash
npm run dev
```
- Starts Vite on **`http://localhost:5173`** with hot module replacement (HMR).

---

## 🔧 Configuration & Environment Variables

The project includes an [`.env.example`](file:///c:/Users/AVINASH/Documents/adhil/.env.example) file. To customize the port or enable Google Gemini API:

```bash
cp .env.example .env
```

| Variable | Type | Default | Description |
|---|---|---|---|
| `PORT` | Number | `3001` | Express server port. |
| `GEMINI_API_KEY` | String | *(Optional)* | Google Gemini API key. When present, the server uses Gemini 1.5 Flash for advanced syllabus extraction. When omitted, the app operates 100% offline using the built-in heuristic agent. |

> [!IMPORTANT]
> **API Key Safety:** The `GEMINI_API_KEY` is strictly read on the Node.js server side. It is never bundled into client-side code or exposed to the browser.

---

## 📂 Project Directory Layout

```
adhil/
├── .env.example                    # Environment variable template
├── index.html                      # HTML entry with custom typography
├── package.json                    # Project configuration & scripts
├── postcss.config.js               # PostCSS plugins
├── tailwind.config.js              # Tailwind design tokens & colors
├── tsconfig.json                   # TypeScript compiler options
├── tsconfig.node.json              # TypeScript Node environment config
├── vite.config.ts                  # Vite build setup with /api proxy
├── README.md                       # Comprehensive documentation
│
├── server/
│   └── index.js                    # Express server (static SPA host + Gemini proxy)
│
├── dist/                           # Production build output
│   ├── index.html
│   └── assets/                     # Bundled JS and CSS
│
└── src/
    ├── main.tsx                    # React DOM entry
    ├── App.tsx                     # Master state machine & router
    ├── index.css                   # Global styles & animations
    │
    ├── types/
    │   └── index.ts                # TypeScript data interfaces
    │
    ├── services/
    │   ├── aiAgentService.ts       # AI syllabus extractor, generator & rubric evaluator
    │   ├── storageService.ts       # LocalStorage persistence & analytics calculations
    │   └── mockData.ts             # Pre-loaded CBSE Class 12 Physics & Math sample data
    │
    ├── utils/
    │   └── helpers.ts              # Time formatters, confetti triggers, badge styles
    │
    └── components/
        ├── layout/
        │   ├── Navbar.tsx          # Top bar with streak, readiness badge & subject switcher
        │   └── Footer.tsx          # Encouraging footer with marking scheme notice
        ├── landing/
        │   └── LandingPage.tsx     # Student landing page & interactive walkthrough
        ├── auth/
        │   └── AuthModal.tsx       # Sign In / Sign Up modal with 1-click demo login
        ├── onboarding/
        │   └── OnboardingModal.tsx # 3-step setup wizard (Grade, Board, Subject, Date)
        ├── dashboard/
        │   └── DashboardView.tsx   # Study hub with practice hero & weak topic alerts
        ├── syllabus/
        │   ├── SyllabusView.tsx    # Topics editor, weightage adjuster & review modal
        │   └── DocumentUploader.tsx# File drag-and-drop & text parser
        ├── studyplan/
        │   └── StudyPlanView.tsx   # Interactive schedule timeline & session toggle
        ├── practice/
        │   ├── PracticeSetupModal.tsx # Custom practice session configurator
        │   ├── PracticeSessionView.tsx# Interactive practice runner
        │   └── QuestionCard.tsx    # Card supporting MCQ, Numerical, Short & Long answers
        ├── mockexam/
        │   ├── MockExamStart.tsx   # Exam instructions & duration configurator
        │   ├── MockExamView.tsx    # Timed exam interface with live timer & palette
        │   └── ExamSubmitModal.tsx # Warning of unanswered questions before submission
        ├── results/
        │   └── ExamResultsView.tsx # Scorecard, rubric breakdown & question review
        ├── analytics/
        │   └── AnalyticsView.tsx   # Score trends chart, mastery bars & pacing
        └── settings/
            └── SettingsView.tsx    # Profile editor, uploaded file manager & reset controls
```

---

## 🛡️ Educational & Evaluation Disclaimer

> **Marking Scheme Notice:**
> All automated evaluations, criteria scoring, and feedback provided by this application are algorithmic estimates designed to aid revision and highlight knowledge gaps. They do **not** represent official board evaluations and are not guaranteed to match official marking criteria. Always consult official curriculum marking guidelines when preparing for certified examinations.

---

## ❓ Troubleshooting & FAQ

### Q1: Can I use PrepAgent without an internet connection?
**Yes.** All core features—including document extraction, question generation, timed mock exams, rubric evaluations, and study plans—run fully client-side and offline using the built-in intelligent agent engine.

### Q2: What happens if I accidentally close the tab during a timed mock exam?
Your answers, flags, and time remaining are continuously autosaved to `localStorage`. When you reopen the application, it will restore your exam session exactly where you left off.

### Q3: How do I reset the data or restore the default sample syllabus?
Go to **Settings** in the top navigation bar, scroll down to **Data & Privacy Controls**, and click **"Reset & Reload Sample Data"**.

### Q4: Can I add multiple subjects?
**Yes.** You can switch between subjects using the subject selector in the top navbar or add new subjects anytime through the onboarding wizard.

---

*PrepAgent &bull; Designed for focused, stress-free exam preparation.*
