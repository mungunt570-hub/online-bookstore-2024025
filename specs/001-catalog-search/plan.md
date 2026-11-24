# Implementation Plan: Book Catalog and Search

**Branch**: `001-catalog-search` | **Date**: 2026-11-24 | **Spec**: [spec.md](spec.md)

## Summary

Implement catalog listing, book detail, and title/author search as a TypeScript Cloudflare Worker
backed by Cloudflare D1 (SQLite). Search is case-insensitive, ordered by title A–Z then book ID,
and capped at 10 results. Data access uses parameterized SQL only. This plan also defines the
approved relational foundation for categories, books, customers, orders, order items, and order
events. It creates no code or migrations.

## Technical Context

**Language/Version**: TypeScript 5.5+ targeting ES2024  
**Primary Dependencies**: Cloudflare Workers runtime, Wrangler 4, Cloudflare D1  
**Storage**: Cloudflare D1 using SQLite relations and constraints  
**Testing**: Vitest 5 with `@cloudflare/vitest-plugin` and local D1 integration tests  
**Target Platform**: Cloudflare Workers  
**Project Type**: Web service  
**Performance Goals**: At least 95% of catalog, detail, and search requests produce a complete
result or clear empty/not-found outcome within 2 seconds under the agreed acceptance workload  
**Constraints**: Parameterized SQL only; 3NF; maximum 10 search results; integer `price_cents`
amounts only; no decimal amount storage; no currency column; no real payment data  
**Scale/Scope**: One Worker and one D1 database; catalog/search behavior plus six approved tables

## Constitution Check

*GATE: Evaluated before design and re-checked after the data model.*

| Principle | Plan evidence | Status |
|-----------|---------------|--------|
| Database Integrity First | PK, FK, UNIQUE, CHECK, and transaction rules are defined in `data-model.md`. | PASS |
| Testable Acceptance Criteria | Catalog, detail, and AC-SEARCH criteria map to planned tests. | PASS |
| Normalized Relational Design | The six-table model is in 3NF with a documented rationale. | PASS |
| Parameterized SQL Only | Repository queries bind all runtime values; no dynamic identifiers are needed. | PASS |
| Atomic and Idempotent Purchasing | Purchase writes are transactional; stock cannot be negative; `request_key` is unique. | PASS |
| Evidence-Gated AI-Generated Code | Acceptance requires real Vitest and local D1 evidence. | PASS |
| Living Specifications | Decisions and the approved exception are recorded in feature artifacts. | PASS |
| No Real Payment Information | No card, bank, payment token, or other real payment data is stored. | PASS |

### Approved Policy Exception

The constitution normally requires explicit currency for monetary values. The project owner
approved integer cent fields only and prohibited a currency column for this feature. The model uses
`books.price_cents` and `order_items.unit_price_cents`, stores no decimals, and adds no currency
column. This is a documented feature-scoped waiver; changing it requires later specification and
constitution review.

### Post-Design Gate

The model preserves relational integrity, prevents negative stock, provides database-backed
idempotency, and separates repeating and historical facts. The approved waiver above is the only
constitution variance. The design gate passes with that waiver.

## Architecture and Data Access

- `src/index.ts`: Worker entry point and route dispatch.
- `src/catalog/routes.ts`: catalog, detail, and search request/response handling.
- `src/catalog/repository.ts`: D1 queries using bound parameters only.
- `src/catalog/types.ts`: response shapes using integer `price_cents`.
- `src/db/types.ts`: shared D1 row and binding types.
- Availability is derived from `books.stock > 0`; it is not duplicated in storage.
- Search performs case-insensitive title/author substring matching, orders by title A–Z and book
  ID, and applies a limit of 10.
- A truly empty query returns HTTP 400 with the approved `EMPTY_QUERY` response. No other query
  normalization behavior is introduced.

## Transaction and Integrity Strategy

- Enable SQLite foreign-key enforcement for application and test connections.
- Purchase creation atomically validates/decrements stock, inserts the order and order items, and
  inserts the initial order event.
- Inventory updates combine sufficient-stock conditions with `CHECK (stock >= 0)` and affected-row
  verification to prevent overselling.
- `orders.request_key` is the database idempotency safeguard against duplicate orders.
- Derive order totals from `order_items.quantity * order_items.unit_price_cents`; do not store a
  redundant total.

## Test Strategy

- **Contract**: statuses, response fields, integer `price_cents`, `EMPTY_QUERY`, empty lists, and
  the 10-result cap.
- **Integration**: parameterized D1 queries, case-insensitive matching, title/ID ordering, FK,
  CHECK, UNIQUE, and stock constraints.
- **Unit**: request validation, row mapping, and error mapping.
- **Purchase integrity**: when purchase behavior is implemented, prove rollback, idempotent retry,
  duplicate-order prevention, and no overselling.
- Required implementation evidence: `npx vitest run` and relevant
  `wrangler d1 execute --local` output. This planning step runs no implementation tests.

## Project Structure

### Documentation (this feature)

```text
specs/001-catalog-search/
├── spec.md
├── plan.md
├── data-model.md
└── checklists/
    └── requirements.md
```

Only `plan.md` and `data-model.md` are created in this approved step. Research, contracts,
quickstart, tasks, code, and migrations are deferred.

### Planned Source Code

```text
src/
├── index.ts
├── catalog/
│   ├── routes.ts
│   ├── repository.ts
│   └── types.ts
└── db/
    └── types.ts

test/
├── contract/
├── integration/
└── unit/
```

**Structure Decision**: Use one Worker project. Group catalog routing, persistence, and transport
types by feature, and keep shared D1 types under `src/db`. Separate tests by contract, integration,
and unit responsibility. These future paths are not created by this plan.

## Complexity Tracking

| Variation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Feature-scoped monetary-policy waiver | Approved design requires integer cent fields without a currency column. | Adding a currency column contradicts the project owner's approved scope. |
