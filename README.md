# Health Ministry

**Health Ministry** is a modern, mobile-first health & symptom tracking application dedicated to headache and migraine logging, duration analytics, and 3-month frequency insights.

Built with **Next.js 15 (App Router)**, **TypeScript**, **TypeORM**, **PostgreSQL** (with zero-config in-memory fallback via `pg-mem`), **Tailwind CSS v4**, **TanStack Query**, and **Recharts**.

---

## Architecture & Code Philosophy

This project strictly adheres to **Domain-Driven Design (DDD)** with clean separation between the Backend Domain and Frontend Client layers inside `src/`.

```
src/
├── backend/                       # BACKEND DOMAIN LAYER
│   ├── config/                    # TypeORM DataSource singleton & fallback
│   ├── shared/errors/             # Custom domain error classes & status codes
│   ├── headache/                  # Headache Bounded Context
│   │   ├── entity/                # TypeORM Entity & Schema
│   │   ├── repository/            # Repository pattern (IHeadacheRepository & TypeORM implementation)
│   │   ├── service/               # Core business logic, validations, realistic 90-day seeder
│   │   └── controller/            # Zod validation schemas & HTTP controller
│   └── dashboard/                 # Analytics Bounded Context
│       ├── service/               # 3-month KPI statistics & trend aggregations
│       └── controller/            # Dashboard stats controller
│
├── frontend/                      # FRONTEND PRESENTATION & CLIENT LAYER
│   ├── config/                    # Centralized routes, tab config & app constants
│   ├── domain/                    # Client models, TypeScript interfaces & severity constants
│   ├── api/                       # Typed client API fetchers with structured error handling
│   ├── hooks/                     # Custom React hooks (TanStack Query, zero useEffect)
│   ├── utils/                     # Duration & localized date formatting
│   ├── components/
│   │   ├── ui/                    # Reusable primitives (Button, Card, Modal, Input, Slider, Badge, Navbar)
│   │   ├── headache/              # Headache feature components (SubHeader, Feed, Cards, Table, Modal, QuickLogFab)
│   │   └── dashboard/             # Dashboard KPI cards & Recharts graphs
│   └── pages/                     # Declarative pages (DashboardPage, MedicationPage)
│
└── app/                           # NEXT.JS APP ROUTER (Thin Delivery Layer)
    ├── api/                       # Lightweight route handlers delegating to backend controllers
    ├── headaches/page.tsx         # Headaches dashboard route (/headaches)
    ├── medication/page.tsx        # Medication route placeholder (/medication)
    ├── globals.css                # Tailwind v4 `@import "tailwindcss";` and `@theme` tokens
    ├── layout.tsx                 # Root layout with primary Health Ministry header
    ├── providers.tsx              # TanStack Query client provider
    └── page.tsx                   # Root page redirecting to /headaches
```

---

## Key Features

- **Application Header & Multi-Tab Navigation**:
  - Global top header with **Health Ministry** branding and active tab navigation.
  - **Headaches Tab**: Links to `/headaches` (current headache dashboard).
  - **Medication Tab**: Links to `/medication` (medication overview placeholder).
  - **Secondary Headache Header**: Present strictly on the headaches dashboard page, housing the **Log Headache** action and demo data seeder.
- **Mobile-First UX (375px–430px baseline)**:
  - Sticky bottom **Quick Log Floating Action Button (FAB)** for 1-tap mobile logging.
  - Large touch targets ($\ge 44\text{px}$) across all interactive controls.
  - Interactive **1–10 Pain Severity Slider** with instant color transitions:
    - **1–3**: Mild (Emerald Green)
    - **4–6**: Moderate (Amber Yellow)
    - **7–8**: Severe (Orange)
    - **9–10**: Debilitating (Crimson Red)
  - Quick Duration Presets (+30m, +1h, +2h, +4h) alongside custom hour/minute pickers.
  - Responsive Card Feed on mobile preventing horizontal scroll; desktop table view on $\ge 768\text{px}$.
  - **Backend-Driven Pagination**: Server-side pagination via TypeORM `findAndCount` (`limit` & `offset`), wired via TanStack Query `useInfiniteQuery` with a clean "Load More" button.
- **3-Month Clinical & Lifestyle Analytics**:
  - 3-Month average pain severity score with severity badge positioned clearly beneath the KPI value.
  - Average episode duration.
  - Monthly and weekly frequency metrics.
  - Monthly frequency bar chart & severity trend timeline with Recharts.
  - 3-Month pain distribution breakdown.
- **Strict React Hygiene**:
  - **Zero `useEffect`**: All side effects are event-driven or handled via TanStack Query.
  - **Strict Path Aliases**: All imports use `@/...`. Never relative parent paths (`../`).
  - **Component & Hook Separation**: Presentation components are decoupled from hooks (`useHeadacheLogModal`, `useDashboardPage`, `useHeadaches`).

---

## Getting Started

### Prerequisites
- Node.js $\ge 18$ (Tested on Node.js 23)
- npm $\ge 9$

### Installation
```bash
npm install
```

### Environment Variables (Optional)
By default, the application runs with an **in-memory PostgreSQL database (`pg-mem`)**, enabling instant, zero-configuration local development and testing without needing a local PostgreSQL server.

To connect to a persistent PostgreSQL instance, set `DATABASE_URL` in `.env.local`:
```env
DATABASE_URL=postgres://username:password@localhost:5432/health_ministry
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Type Checking
```bash
npm run typecheck
```

### Production Build
```bash
npm run build
npm start
```

---

## API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/entries` | List recent headache entries ordered by date desc |
| `POST` | `/api/entries` | Create a new headache entry (validated with Zod) |
| `GET` | `/api/entries/:id` | Retrieve single entry by UUID |
| `PUT` | `/api/entries/:id` | Update an existing headache entry |
| `DELETE` | `/api/entries/:id` | Delete an entry (returns 204 No Content) |
| `GET` | `/api/dashboard/stats` | Aggregated 3-month statistics and frequency trends |
| `POST` | `/api/seed` | Seeds 17 realistic sample headache entries over the last 90 days |
