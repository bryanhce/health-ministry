# Health Ministry - Implementation Plan

**Application Name**: Health Ministry  
**Domain**: Health & Symptom Tracking (Headache & Migraine Logging & Analytics)  
**Architecture**: Domain-Driven Design (DDD) with Strict Frontend / Backend Separation & Mobile-First UI  
**Tech Stack**: Next.js 15 (App Router), TypeScript, TypeORM, PostgreSQL, Tailwind CSS, Lucide Icons, Recharts

---

## 1. Architectural Philosophy: Best Practice Frontend / Backend Split

In Next.js full-stack applications, separating `frontend` and `backend` at the root of `src/` is the industry best practice because:
1. **Zero Client/Server Leaks**: Guarantees server-only modules (`typeorm`, `pg`, database credentials) are never accidentally imported into React Client Components, preventing Next.js bundler errors.
2. **Domain-Driven Backend (Controller → Service → Repository → Entity)**:
   - **Entities**: Core business objects and database schemas.
   - **Repositories**: Encapsulate TypeORM queries and data access behind interfaces.
   - **Services**: Pure business rules, validations, statistics calculations (e.g., 3-month average pain, frequency).
   - **Controllers**: Handle HTTP request parsing, DTO validation, and response formatting.
3. **Domain-Driven Frontend (Domain → API → Hooks → Components → Pages)**:
   - **Domain**: Frontend TypeScript models, types, and value formatting.
   - **API**: Typed client fetchers for interacting with REST endpoints.
   - **Hooks**: State management and data synchronization (`useHeadaches`, `useDashboardStats`).
   - **Components**: Mobile-first UI widgets (Touch Sliders, Duration Picker, Mobile Cards, KPI StatCards, Recharts).
   - **Pages**: Top-level page compositions.
4. **App Router as a Thin Delivery Layer**:
   - `src/app/api/*` acts purely as thin route handlers forwarding to backend controllers.
   - `src/app/page.tsx` simply renders the frontend `DashboardPage`.

---

## 2. Directory Structure

```
src/
├── backend/                             # BACKEND DOMAIN LAYER
│   ├── config/
│   │   └── dataSource.ts                # TypeORM DataSource singleton (hot-reload cached)
│   ├── shared/
│   │   └── errors/
│   │       └── AppError.ts              # Custom domain & HTTP error classes
│   │
│   ├── headache/                        # Headache Bounded Context
│   │   ├── entity/
│   │   │   └── HeadacheEntry.ts         # TypeORM Entity (UUID, date, painSeverity, durationMinutes, notes)
│   │   ├── repository/
│   │   │   ├── IHeadacheRepository.ts   # Repository contract
│   │   │   └── TypeORMHeadacheRepository.ts # TypeORM data access implementation
│   │   ├── service/
│   │   │   └── headache.service.ts      # Business logic: CRUD operations, seed data generator
│   │   └── controller/
│   │       ├── headache.dto.ts          # Zod request validation schemas
│   │       └── headache.controller.ts   # HTTP request parsing, response formatting
│   │
│   └── dashboard/                       # Dashboard Analytics Bounded Context
│       ├── service/
│       │   └── dashboard.service.ts     # Aggregates 3-month avg pain, avg duration, frequency trends
│       └── controller/
│           └── dashboard.controller.ts  # HTTP controller for dashboard stats
│
├── frontend/                            # FRONTEND PRESENTATION & CLIENT LAYER
│   ├── domain/                          # Client Domain Models & Types
│   │   ├── headache.types.ts            # Entry types, Severity scale (1-10), Duration types
│   │   └── dashboard.types.ts           # KPI metrics & chart data types
│   │
│   ├── api/                             # Typed API Client Layer
│   │   ├── headacheApi.ts               # fetchEntries, createEntry, updateEntry, deleteEntry, seedEntries
│   │   └── dashboardApi.ts              # fetchDashboardStats
│   │
│   ├── hooks/                           # Custom React Hooks
│   │   ├── useHeadaches.ts              # CRUD state, refetching, mutations
│   │   └── useDashboardStats.ts         # KPI stats caching and loading state
│   │
│   ├── components/                      # Mobile-First UI Components
│   │   ├── ui/                          # Reusable UI Primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Slider.tsx               # Touch-friendly 1-10 pain slider with color coding
│   │   │   ├── Badge.tsx                # Pain severity badges (1-3 Green, 4-6 Yellow, 7-8 Orange, 9-10 Red)
│   │   │   └── Navbar.tsx               # Health Ministry branding & header actions
│   │   ├── headache/
│   │   │   ├── HeadacheLogModal.tsx     # Mobile-first entry modal for Create / Edit
│   │   │   ├── HeadacheCard.tsx         # Mobile touch-friendly card item
│   │   │   ├── HeadacheTable.tsx        # Desktop responsive table
│   │   │   ├── EntriesFeed.tsx          # Adaptive container (Cards on mobile, Table on desktop)
│   │   │   └── QuickLogFab.tsx          # Floating Action Button for 1-tap mobile logging
│   │   └── dashboard/
│   │       ├── StatCard.tsx             # KPI stat card
│   │       ├── DashboardStats.tsx       # Grid: 3-mo avg pain, avg duration, weekly & monthly frequency
│   │       └── FrequencyCharts.tsx      # Responsive Recharts for monthly frequency & pain severity trends
│   │
│   ├── pages/                           # Page-level composition
│   │   └── DashboardPage.tsx            # Main page assembling Navbar, Stats, Charts, Feed, and FAB
│   │
│   └── utils/                           # Formatting & Date Utilities
│       ├── formatters.ts                # Duration ("2h 30m"), Severity labels
│       └── dateUtils.ts                 # Date helpers (defaults to today's local date)
│
└── app/                                 # NEXT.JS APP ROUTER (Thin Delivery Layer)
    ├── api/
    │   ├── entries/
    │   │   ├── route.ts                 # GET, POST -> headacheController
    │   │   └── [id]/
    │   │       └── route.ts             # GET, PUT, DELETE -> headacheController
    │   ├── dashboard/
    │   │   └── stats/
    │   │       └── route.ts             # GET -> dashboardController
    │   └── seed/
    │       └── route.ts                 # POST -> headacheController.seed()
    ├── layout.tsx                       # Root layout with mobile-first viewport meta tags
    ├── page.tsx                         # Simply renders <DashboardPage /> from frontend/pages
    └── globals.css                      # Tailwind base & mobile touch styles
```

---

## 3. Mobile-First UX Architecture
- **Mobile Baseline (375px–430px)**:
  - Sticky bottom **Quick Log Floating Action Button (FAB)**.
  - Large touch targets (≥ 44px) for all buttons and inputs.
  - Interactive **1–10 Pain Slider** with instant visual color transitions:
    - 1–3: Mild (Emerald Green)
    - 4–6: Moderate (Amber Yellow)
    - 7–8: Severe (Orange)
    - 9–10: Very Severe / Debilitating (Crimson Red)
  - Quick Duration Presets (+30m, +1h, +2h, +4h) alongside custom hour/minute pickers.
  - **Card-based feed** for logged headaches on mobile to prevent horizontal scrolling.
- **Desktop Enhancement (≥ 768px / 1024px)**:
  - Multi-column KPI stats grid.
  - Side-by-side frequency and severity trend charts.
  - Full tabular view with sorting and inline action buttons.

---

## 4. Database Schema (`headache_entries`)

| Column | Type | Constraints / Details |
| :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, auto-generated |
| `date` | `DATE` | Default: current date (`YYYY-MM-DD`) |
| `painSeverity` | `INT` | 1 to 10 (1 = minimal pain, 10 = debilitating) |
| `durationMinutes`| `INT` | Total duration in minutes (e.g. 150 = 2h 30m) |
| `notes` | `TEXT` | Nullable, triggers, symptoms, or medications |
| `createdAt` | `TIMESTAMPTZ` | Auto-set on creation |
| `updatedAt` | `TIMESTAMPTZ` | Auto-updated on modification |

---

## 5. API Endpoints Specification

| Method | Route | Controller Method | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/entries` | `headacheController.list()` | Returns recent headache entries ordered by date desc |
| `POST` | `/api/entries` | `headacheController.create()` | Validates payload and creates entry |
| `GET` | `/api/entries/:id` | `headacheController.getById()` | Returns single entry |
| `PUT` | `/api/entries/:id` | `headacheController.update()` | Updates entry |
| `DELETE` | `/api/entries/:id` | `headacheController.delete()` | Deletes entry |
| `GET` | `/api/dashboard/stats` | `dashboardController.getStats()` | Returns 3-month metrics and frequency trends |
| `POST` | `/api/seed` | `headacheController.seed()` | Seeds 90 days of realistic sample data |

---

## 6. Verification Plan

### Automated Verification
```bash
npm run build
```
Ensures complete TypeScript compilation, zero client/server import leakage, and Next.js routing integrity.

### API & Functional Verification
1. **Database Seeding**:
   - `POST /api/seed` populates 15–20 entries over the last 90 days.
2. **Dashboard Calculations**:
   - `GET /api/dashboard/stats` confirms 3-month average pain severity, average duration, and weekly/monthly frequency calculations.
3. **Mobile & CRUD Walkthrough**:
   - At 390px viewport width:
     - Tap **Quick Log FAB**.
     - Verify date defaults to today.
     - Move pain slider to 7 ("Severe") and select duration "2h 30m".
     - Add notes: "Screen glare trigger", submit.
     - Confirm entry appears at the top of the mobile card feed and dashboard stats update.
     - Test editing and deleting the entry.
