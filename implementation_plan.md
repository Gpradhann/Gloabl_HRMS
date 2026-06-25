# Implementation Plan - Global HRMS (WorkFlow) Mobile-First Web Application

This plan outlines the technical design, directory structure, mock data layer, component mapping, and verification process to build the WorkFlow Global HRMS application.

## User Review Required

> [!IMPORTANT]
> The application will be styled with Tailwind CSS, utilizing a premium **Teal & Orange themed design system** as per the product specification.
> The layout is restricted to a **mobile-first centered frame** (max-width `480px` on desktop, full screen on mobile) resembling a high-fidelity iOS/Android native app experience.
> LocalStorage will be integrated as a persistent store for actions like clocking in/out, submitting leaves/expenses, claiming contributions, and posting comments, to make the interactive demo feel complete.

## Proposed Changes

We will create and structure the components in a highly modular feature-based structure within the `next.js` codebase:

```
next.js/
├── app/
│   ├── api/
│   │   └── copilot/
│   │       └── route.ts         <- [NEW] Copilot API route
│   └── page.tsx                 <- [MODIFY] Primary application wrapper
├── components/
│   ├── Header.tsx               <- [NEW] Global application header with role switcher
│   ├── BottomNav.tsx            <- [NEW] Dynamic navigation bar based on role
│   ├── CopilotDrawer.tsx        <- [NEW] Conversational AI assistant panel
│   ├── onboarding/              <- [NEW] Pre-joining tasks, relocation, buddy introduction
│   ├── attendance/              <- [NEW] Selfie check-in, geolocation verification, shift logs
│   ├── leave/                   <- [NEW] Leave ledger, submission form, approval dashboard
│   ├── payroll/                 <- [NEW] Localized payslips (US & India), compliance panel
│   ├── documents/               <- [NEW] Document vault, verification flows, expiry flags
│   ├── expenses/                <- [NEW] Mileage calculator, policy enforcement, expense list
│   ├── performance/             <- [NEW] OKR charts, feedback forms, appraisal summaries
│   ├── contributions/           <- [NEW] gamified points leaderboard, claimable items
│   ├── training/                <- [NEW] Content viewer, quizzes, certificate vault
│   ├── recruitment/             <- [NEW] Kanban board candidate pipeline, scheduler
│   ├── recognition/             <- [NEW] Social shout-out wall, reactions, comment box
│   ├── announcements/           <- [NEW] Targeted notifications, acknowledgment receipts
│   ├── team/                    <- [NEW] Roster details, org reporting structures
│   └── analytics/               <- [NEW] Visual reports (burn rate, utilization, compliance)
├── lib/
│   └── mockData.ts              <- [NEW] Mock store, TypeScript entities, seed records
└── stores/
    └── uiStore.ts               <- [MODIFY] Extended store for tabs, roles, and states
```

---

### Phase 1: Core Systems & State

#### [MODIFY] [uiStore.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/stores/uiStore.ts)
- Extend the Zustand store to hold:
  - `activeRole` ('employee' | 'manager' | 'hr' | 'admin')
  - `isOnboarding` (boolean)
  - `currentTab` (string)
  - `copilotOpen` (boolean)
  - `unreadAnnouncementsCount` (number)

#### [NEW] [mockData.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/lib/mockData.ts)
- Define TypeScript types for all 15 modules.
- Create initial seed data for employees, tasks, welcome messages, leave ledger, payslips, courses, pipeline candidates, and recognition posts.
- Build functions that save/load from `localStorage` to allow real-time modifications (e.g. submitting a leave request changes the balance and puts it in the manager's pending queue).

---

### Phase 2: Navigation & Global Shell

#### [MODIFY] [page.tsx](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/page.tsx)
- Embed a mobile shell wrapper: standard desktop view shows a mockup device frame with the app running inside, whereas mobile browsers take up the full screen.
- Manage layout rendering based on the active tab and role.

#### [NEW] [Header.tsx](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/components/Header.tsx)
- Add the app header featuring:
  - WorkFlow logo in a gradient accent.
  - Role switcher dropdown allowing quick evaluation of employee, manager, HR, and admin perspectives.
  - "Onboarding Mode" toggle to experience Alex's new-joiner dashboard.

#### [NEW] [BottomNav.tsx](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/components/BottomNav.tsx)
- Adapt icons and labels dynamically according to Section 3.2:
  - Employee: Home, Attendance, Performance, Training, Contributions
  - Manager: Home, Team, Leave, Performance, Training
  - HR: Home, Recruitment, Analytics, Training, Announcements
  - Admin: Home, Analytics, Team, Training, Announcements

#### [NEW] [CopilotDrawer.tsx](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/components/CopilotDrawer.tsx)
- Floats as a chat widget.
- Collects active states: `currentTab`, `activeRole`, `isOnboarding` and posts to the API route.
- Shows dynamic prompt suggestions depending on the view (e.g., in Payroll, shows "How is my PF calculated?").

#### [NEW] [route.ts](file:///c:/Users/DELL/OneDrive/Desktop/New%20folder/next.js/app/api/copilot/route.ts)
- Backend endpoint that returns contextual guidance depending on the user's role and screen.

---

### Phase 3: Implementation of Functional Modules

We will create detailed sub-folders and components under `components/` for each of the core modules:

1. **Onboarding Module** (`components/onboarding/`): Progress circular indicator, checklists grouped by pre-joining/day 1/week 1, relocation section, introductions grid with cards.
2. **Attendance Module** (`components/attendance/`): Selfie clock-in modal with mock canvas capture, simulated geolocation check, shift calendar, and time summary.
3. **Leave Module** (`components/leave/`): Interactive cards for Sick, Casual, Maternity leaves with balances. Submission form. Approval inbox (for Manager/HR).
4. **Payroll Module** (`components/payroll/`): Localized components for India (basic, HRA, PF, ESI) and US (gross, federal tax, social security, 401k). Download mock PDF trigger.
5. **Documents Module** (`components/documents/`): Grid of passport, visa, and education credentials. File drop simulations with status badges.
6. **Expenses Module** (`components/expenses/`): Category picker, mileage distance cost calculation, limit violations flag, receipt uploader.
7. **Performance Module** (`components/performance/`): Goals OKR tracker with key results progress slider, reviews report view.
8. **Contributions Module** (`components/contributions/`): Point tracker, team leaderboard, claimable tasks list, manager approval logs.
9. **Training Module** (`components/training/`): Video content player, quiz question card, completion certificate pop-up.
10. **Recruitment Module** (`components/recruitment/`): Job listings manager, interactive candidates pipeline Kanban board, schedule calendar helper.
11. **Recognition Module** (`components/recognition/`): Peer appreciations, like reaction triggers, comment inputs.
12. **Announcements Module** (`components/announcements/`): Feed of announcements with priority level flags, HR creation dialog, and policy acknowledgement checkboxes.
13. **Team Management Module** (`components/team/`): Directory view of direct reports, hierarchy mapping.
14. **Analytics Module** (`components/analytics/`): CSS/SVG-based data charts visualizing attendance averages, learning completion rates, and leave trends.

---

## Verification Plan

### Automated Tests
We will build the next project using:
```bash
npm run build
```
to ensure typescript checks, lint rules, and bundling compile without warning or error.

### Manual Verification
1. We will launch the development server using `npm run dev`.
2. Open in browser to examine the premium look-and-feel (glassmorphic elements, teal/orange gradients, subtle animations).
3. Test all role switch flows (Sarah -> Michael -> HR -> Admin) and verify bottom navigation items adapt correctly.
4. Interact with the copilot in different tabs to verify context-aware guidance.
5. Test the Onboarding checklist and relocation tabs, then mark as complete and verify the transition to the main dashboard.
6. Perform action cycles: clock-in/out, submit leave, upload doc, submit expense, approve team items, add recognition likes, check org charts.
