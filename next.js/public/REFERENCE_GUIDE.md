# WorkFlow Global HRMS - Technical Reference Document

Welcome to the technical reference documentation for **WorkFlow**, a Global Human Resource Management System (HRMS). This document lists all features, user stories, role capabilities, and maps them directly to the source code files in the project.

---

## 1. Project Architecture Overview

WorkFlow is built as a mobile-first responsive web application.
* **Framework:** Next.js 16 (App Router) with React 19 and TypeScript.
* **State Management:** Zustand (leveraging persistent local state middleware).
* **Styling:** Tailwind CSS (Teal & Orange palette with glassmorphism).
* **Database & APIs:** Served via Next.js server API routes fetching and saving state to a mock JSON database file (`db.json`) via TanStack React Query mutations.

---

## 2. Directory Structure Map

```
next.js/
├── app/                        # Next.js Page & API Routing
│   ├── (app)/                  # Role-Protected Views (Layout & Pages)
│   │   ├── home/               # Home Landing Dashboard
│   │   ├── attendance/         # Time Capture & Verification
│   │   ├── leave/              # Request & Approvals Queue
│   │   ├── payroll/            # Payslips & Compliance
│   │   ├── documents/          # Document Vault
│   │   ├── expenses/           # Reimbursements Tracker
│   │   ├── performance/        # Goals & Reviews OKRs
│   │   ├── contributions/      # Gamified Points Feed
│   │   ├── training/           # Learning Portal
│   │   ├── recruitment/        # Job Board & Candidates
│   │   ├── recognition/        # Social Shout-outs Feed
│   │   ├── announcements/      # Bulletins & Receipts
│   │   ├── team/               # Organization Directory
│   │   ├── analytics/          # CSS SVG Trends Charts
│   │   ├── todos/              # Daily Task Checklist
│   │   └── onboarding/         # New Joiner Checklist
│   ├── (auth)/                 # Authentication routes (Login)
│   ├── api/                    # REST API Endpoint handlers (reads/writes db.json)
│   ├── globals.css             # Core design system stylesheet
│   └── layout.tsx              # Root Page wrapper
├── components/                 # Shared UI Components
│   ├── shell/                  # App header, bottom navigation, switches
│   └── copilot/                # AI drawer & assistant
├── data/                       # Default mock fallback data
├── hooks/                      # React Query hook abstractions (API requests)
├── lib/                        # Common utilities, API fetcher client, db mock wrapper
├── stores/                     # Zustand global stores (roles, view toggles)
└── db.json                     # Local mock database file
```

---

## 3. Detailed Module Feature & Code Mapping

### Module 1: Onboarding
* **Key Capabilities:** Phased tasks (5 phases), welcome messages (playable CEO video), team introductions ("Mark as Met" connections), relocation coordination (accommodation, visa, travel status, allowance, ticket log, ticket creation), completion handoff.
* **Employee View:** [app/(app)/onboarding/page.tsx](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/(app)/onboarding/page.tsx)
* **Zustand Store Hook-up:** [stores/hrmsStore.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/stores/hrmsStore.ts)
* **React Query Hook:** [hooks/useOnboarding.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/hooks/useOnboarding.ts)
* **Database Seed Schema:** [lib/seed.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/lib/seed.ts) (key `onboardingData`)
* **API Endpoints:**
  * Get Onboarding Details: `GET /api/onboarding/[id]` -> [app/api/onboarding/[id]/route.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/api/onboarding/[id]/route.ts)
  * Complete Task: `PATCH /api/onboarding/tasks/[id]` -> [app/api/onboarding/tasks/[id]/route.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/api/onboarding/tasks/[id]/route.ts)
  * Complete Onboarding: `POST /api/onboarding/[id]/complete` -> [app/api/onboarding/[id]/complete/route.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/api/onboarding/[id]/complete/route.ts)
  * Connect Team Member: `PATCH /api/onboarding/team/[id]` -> [app/api/onboarding/team/[id]/route.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/api/onboarding/team/[id]/route.ts)
  * Submit Relocation Ticket: `POST /api/onboarding/relocation/tickets` -> [app/api/onboarding/relocation/tickets/route.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/api/onboarding/relocation/tickets/route.ts)

### Module 2: Attendance
* **Key Capabilities:** Clock in (selfie frame visual, IP check, geolocation), clock out (hours tracker, break computations), shift calendar, manager team roster coverage list.
* **Component View:** [app/(app)/attendance/page.tsx](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/(app)/attendance/page.tsx)
* **React Query Hook:** [hooks/useAttendance.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/hooks/useAttendance.ts)
* **API Endpoints:**
  * Get Shift Records: `GET /api/attendance` -> [app/api/attendance/route.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/api/attendance/route.ts)
  * Punch In: `POST /api/attendance/clockin` -> [app/api/attendance/clockin/route.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/api/attendance/clockin/route.ts)
  * Punch Out: `POST /api/attendance/clockout` -> [app/api/attendance/clockout/route.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/api/attendance/clockout/route.ts)

### Module 3: Leave Management
* **Key Capabilities:** Casual/sick/maternity balance meters, new leave application form validation, reporting manager approvals queue, employee request ledger.
* **Component View:** [app/(app)/leave/page.tsx](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/(app)/leave/page.tsx)
* **React Query Hook:** [hooks/useLeave.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/hooks/useLeave.ts)
* **API Endpoints:**
  * Get Balances: `GET /api/leave/balances` -> [app/api/leave/balances/route.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/api/leave/balances/route.ts)
  * Submit & Approve Requests: `GET/POST /api/leave/requests` -> [app/api/leave/requests/route.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/api/leave/requests/route.ts)
  * Review Request Status: `PATCH /api/leave/requests/[id]` -> [app/api/leave/requests/[id]/route.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/api/leave/requests/[id]/route.ts)

### Module 4: Payroll & Compliance
* **Key Capabilities:** Itemized India & US pay stub (basic, HRA, PF, FICA, social security deductions), downloadable receipts trigger, regulatory statutory tracker.
* **Component View:** [app/(app)/payroll/page.tsx](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/(app)/payroll/page.tsx)
* **React Query Hook:** [hooks/usePayroll.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/hooks/usePayroll.ts)
* **API Endpoint:** `GET /api/payroll` -> [app/api/payroll/route.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/api/payroll/route.ts)

### Module 5: Documents
* **Key Capabilities:** File category uploads, status indicators (missing, verified, rejected), expiration dates.
* **Component View:** [app/(app)/documents/page.tsx](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/(app)/documents/page.tsx)
* **React Query Hook:** [hooks/useDocuments.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/hooks/useDocuments.ts)
* **API Endpoints:** `GET/POST /api/documents` -> [app/api/documents/route.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/api/documents/route.ts)

### Module 6: Expenses & Reimbursements
* **Key Capabilities:** Category picker, mileage distance cost multiplier, policy limit overrides, receipts uploader, approval state queue.
* **Component View:** [app/(app)/expenses/page.tsx](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/(app)/expenses/page.tsx)
* **React Query Hook:** [hooks/useExpenses.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/hooks/useExpenses.ts)
* **API Endpoints:**
  * Get and Submit: `GET/POST /api/expenses` -> [app/api/expenses/route.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/api/expenses/route.ts)
  * Update Status: `PATCH /api/expenses/[id]` -> [app/api/expenses/[id]/route.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/api/expenses/[id]/route.ts)

### Module 7: Performance & Goals
* **Key Capabilities:** Measurable Key Results progress bars, ratings, feedback categories (strengths, growth areas), manager coaching directory.
* **Component View:** [app/(app)/performance/page.tsx](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/(app)/performance/page.tsx)
* **React Query Hook:** [hooks/usePerformance.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/hooks/usePerformance.ts)
* **API Endpoints:**
  * Goals: `GET/POST /api/performance/goals` -> [app/api/performance/goals/route.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/api/performance/goals/route.ts)
  * Reviews: `GET /api/performance/reviews` -> [app/api/performance/reviews/route.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/api/performance/reviews/route.ts)

### Module 8: Contributions
* **Key Capabilities:** Value-points logs, ranking leaderboard (points and badges), open claims tasks catalog.
* **Component View:** [app/(app)/contributions/page.tsx](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/(app)/contributions/page.tsx)
* **React Query Hook:** [hooks/useContributions.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/hooks/useContributions.ts)
* **API Endpoints:**
  * Feed: `GET/POST /api/contributions` -> [app/api/contributions/route.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/api/contributions/route.ts)
  * Leaderboard: `GET /api/contributions/leaderboard` -> [app/api/contributions/leaderboard/route.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/api/contributions/leaderboard/route.ts)
  * Catalog items: `GET /api/contributions/items` -> [app/api/contributions/items/route.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/api/contributions/items/route.ts)
  * Claim Item: `POST /api/contributions/items/[id]/claim` -> [app/api/contributions/items/[id]/claim/route.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/api/contributions/items/[id]/claim/route.ts)

### Module 9: Training & Learning
* **Key Capabilities:** Course listings, video playback players, quiz modules cards, certificates generation on 100% completion.
* **Component View:** [app/(app)/training/page.tsx](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/(app)/training/page.tsx)
* **React Query Hook:** [hooks/useTraining.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/hooks/useTraining.ts)
* **API Endpoints:**
  * Get Courses: `GET /api/training` -> [app/api/training/route.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/api/training/route.ts)
  * Update Progress: `POST /api/training/[id]/progress` -> [app/api/training/[id]/progress/route.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/api/training/[id]/progress/route.ts)

### Module 10: Recruitment
* **Key Capabilities:** Active postings, Kanban pipeline board columns, candidate details panels, interview scheduler.
* **Component View:** [app/(app)/recruitment/page.tsx](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/(app)/recruitment/page.tsx)
* **React Query Hook:** [hooks/useRecruitment.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/hooks/useRecruitment.ts)
* **API Endpoints:**
  * Job Postings: `GET /api/recruitment/jobs` -> [app/api/recruitment/jobs/route.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/api/recruitment/jobs/route.ts)
  * Pipeline: `GET/POST /api/recruitment/candidates` -> [app/api/recruitment/candidates/route.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/api/recruitment/candidates/route.ts)

### Module 11: Recognition
* **Key Capabilities:** Social shout-outs wall, reaction counters, comments box.
* **Component View:** [app/(app)/recognition/page.tsx](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/(app)/recognition/page.tsx)
* **React Query Hook:** [hooks/useRecognition.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/hooks/useRecognition.ts)
* **API Endpoints:**
  * Feed: `GET/POST /api/recognition` -> [app/api/recognition/route.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/api/recognition/route.ts)
  * Like: `POST /api/recognition/[id]/like` -> [app/api/recognition/[id]/like/route.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/api/recognition/[id]/like/route.ts)

### Module 12: Announcements
* **Key Capabilities:** bulletins feeds, target scopes, policy acknowledgments checklist triggers.
* **Component View:** [app/(app)/announcements/page.tsx](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/(app)/announcements/page.tsx)
* **React Query Hook:** [hooks/useAnnouncements.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/hooks/useAnnouncements.ts)
* **API Endpoints:**
  * Bulletins: `GET/POST /api/announcements` -> [app/api/announcements/route.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/api/announcements/route.ts)
  * Acknowledge: `POST /api/announcements/[id]/acknowledge` -> [app/api/announcements/[id]/acknowledge/route.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/api/announcements/[id]/acknowledge/route.ts)

### Module 13: Team Management
* **Key Capabilities:** designation maps, team rosters lists.
* **Component View:** [app/(app)/team/page.tsx](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/(app)/team/page.tsx)
* **React Query Hook:** [hooks/useTeam.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/hooks/useTeam.ts)
* **API Endpoint:** `GET /api/employees` -> [app/api/employees/route.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/api/employees/route.ts)

### Module 14: Analytics
* **Key Capabilities:** SVG compliance indicators charts, headcount trends lines.
* **Component View:** [app/(app)/analytics/page.tsx](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/(app)/analytics/page.tsx)

### Module 15: HR Copilot (AI Assistant)
* **Key Capabilities:** Context-aware suggestions, floating panel toggle.
* **UI Drawer View:** [components/copilot/CopilotDrawer.tsx](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/components/copilot/CopilotDrawer.tsx)
* **API Route Endpoint:** `POST /api/copilot` -> [app/api/copilot/route.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/api/copilot/route.ts)

### Extra Module: Todos (Tasks Widget)
* **Key Capabilities:** Quick add tasks, checklists check-offs, status filters.
* **Dashboard Widget:** [app/(app)/home/page.tsx](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/(app)/home/page.tsx) (HomeTodosWidget)
* **Dedicated Manager Page:** [app/(app)/todos/page.tsx](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/(app)/todos/page.tsx)
* **React Query Hook:** [hooks/useTodos.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/hooks/useTodos.ts)
* **API Route Endpoint:** `GET/POST/PATCH /api/todos` -> [app/api/todos/route.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/api/todos/route.ts)
