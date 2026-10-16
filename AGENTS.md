# Frontend

## Stack
- **Framework:** React 19 with Next 15
- **Language:** TypeScript 5.9 (Strict mode enabled)
- **Styling:** Tailwind CSS v4 
- **Data Fetching & Server State:** TanStack Query v5
- **Package Manager:** npm


## Architecture & Module Conventions

### 1. Imports & Path Aliases
- **Strict Alias Usage:** Always use configured path aliases (`@/...`) for imports. Never use relative parent paths (`../`).
  - *Good:* `import { Button } from '@/components/ui/button'`
  - *Bad:* `import { Button } from '../../../components/ui/button'`

### 2. Component & Hook Separation (View / Logic Split)
- **Decouple View from Logic:** Split complex components and pages into a pure declarative **View Component** and a **Custom Hook** (`use[ComponentName]`) that encapsulates behavior, local state, and data mutations.
- Keep presentation components focused strictly on rendering UI based on props.

### 3. Mobile-First Styling (Tailwind v4)
- **Mobile-First:** Write base styles for mobile viewports first, then layer responsive utilities (`sm:`, `md:`, `lg:`, `xl:`) for larger screens.
- **Tailwind v4 Conventions:** Use `@import "tailwindcss";` and define design tokens inside `@theme` blocks in CSS rather than legacy `tailwind.config.js` files.

---

## React & State Management Rules

### 1. No `useEffect`
- **Avoid `useEffect` at all costs.** Do not use `useEffect` for state synchronization, data fetching, or handling user events.
- **Alternatives to use instead:**
  - **Derived state:** Compute values directly during render (or with `useMemo` if computationally expensive).
  - **Event-driven side effects:** Trigger logic directly inside event handlers (`onClick`, `onSubmit`).
  - **Server state:** Use **TanStack Query** (`useQuery`, `useMutation`).
  - **State resets on prop change:** Pass an explicit `key` prop to the child component.
  - **DOM measurements / third-party refs:** Use callback refs (`ref={(node) => ...}`).

### 2. Data Fetching
- **TanStack Query Only:** All API calls and async server state must be managed via TanStack Query (`useQuery`, `useMutation`, `useInfiniteQuery`).
- Centralize query keys using a factory pattern or constant objects to prevent key collisions and magic strings.

---

## TypeScript Best Practices

### 1. Domain Modeling & Readability
- **Explicit Domain Types:** Create semantic union types and discriminated unions for domain states instead of raw primitives.
  - *Good:* `type TestStatus = 'PASS' | 'FAIL';`
  - *Good:* `type AsyncState<T> = { status: 'loading' } | { status: 'success'; data: T } | { status: 'error'; error: Error };`
- **No `any`:** Never use `any`. Use `unknown` when the type is dynamic and narrow it with type guards or schema validators (e.g., Zod).
- **Prefer Unions over Enums:** Use string literal unions or `as const` objects instead of TypeScript `enum`.

### 2. No Magic Strings or Numbers
- Extract all repeated strings, configuration values, thresholds, status codes, and route paths into named constants (`UPPER_SNAKE_CASE` or `as const` objects).

### 3. Error Handling
- **Never Silently Suppress Errors:** Every `catch` block or error boundary must either explicitly log the error with context or re-throw a typed/domain-specific error. Empty `catch {}` blocks are strictly forbidden.

---

**No Test Cases Needed:** No test cases are needed or required for this project. Do not write, generate, or maintain unit, integration, or end-to-end test files.

---

## Post-Task Checklist (Mandatory)
Before marking any task as complete, you **must**:
1. Verify that no `useEffect` hooks, relative parent imports (`../`), or magic strings/numbers were introduced.
2. Run type-checking (`npm run typecheck`) to ensure zero regressions (no tests needed).
3. **Update Documentation:** Update `README.md` or `AGENTS.md` whenever architectural patterns, scripts, environment variables, or project conventions change.

# Backend

## Code Design & Clean Code Principles

### 1. Single Responsibility Principle (SRP) & Decoupling
- Every class, service, or module must have **one reason to change**.
- **Decompose Multi-Step Workflows:** Never bundle distinct responsibilities into a single class.
  - *Bad:* A single `DocumentService` that parses a file, uploads it to S3, and publishes an SNS notification.
  - *Good:* Split into `FileParser` (domain/application), `S3StorageAdapter` (infrastructure), and `SnsNotificationPublisher` (infrastructure), coordinated by a thin `ProcessDocumentUseCase` (application) via injected interfaces.

### 2. Guard Clauses & Happy-Path Alignment
- **Fail Fast:** Validate preconditions, permissions, and edge cases at the very top of functions using early `return` or `throw` statements.
- **No Arrow Code:** Avoid deep `if/else` nesting. Keep the happy path unindented and flowing straight down the left margin of the file.

```typescript
// BAD: Nested conditions obscure the happy path
async function processOrder(order: Order | null) {
  if (order !== null) {
    if (order.status === ORDER_STATUS.PENDING) {
      await chargeCustomer(order);
    } else {
      throw new InvalidOrderStateError(order.id);
    }
  } else {
    throw new OrderNotFoundError();
  }
}

// GOOD: Guard clauses keep the happy path flat
async function processOrder(order: Order | null) {
  if (!order) throw new OrderNotFoundError();
  if (order.status !== ORDER_STATUS.PENDING) {
    throw new InvalidOrderStateError(order.id);
  }

  await chargeCustomer(order);
}
```

### 3. Don't Reinvent the Wheel (Offload Infrastructure Logic)
- **Use Battle-Tested Libraries:** Never hand-roll generic infrastructure utilities such as HTTP client wrappers, exponential backoff/retry loops, circuit breakers, rate limiters, or schema validators.
- Offload heavy lifting to established packages (e.g., `ky` / `axios-retry` / `cockatiel` / `tenacity` for retries and resilience; `zod` / `pydantic` for validation; official AWS SDK middleware for cloud retries).

---

## Code Hygiene & Error Handling

### 1. No Magic Strings or Numbers
- Extract all timeouts, retry limits, buffer sizes, HTTP status codes, queue names, event topics, and status literals into named constants (`UPPER_SNAKE_CASE`), enums, or strongly typed configuration objects.

### 2. Explicit Domain Types
- Use semantic types, Value Objects, or union types for domain states and identifiers (e.g., `type JobStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED'`) instead of raw primitives.

### 3. Error Handling
- **Never Silently Suppress Errors:** Every caught error must be logged with structured context (correlation ID, relevant entity IDs) or wrapped and re-thrown as a domain/application error.
- Separate expected domain errors (e.g., `InsufficientBalanceError`) from unexpected infrastructure failures.


