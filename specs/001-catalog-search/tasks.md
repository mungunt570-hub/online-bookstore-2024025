# Tasks: Book Catalog and Search

**Input**: Design documents from `specs/001-catalog-search/`

**Prerequisites**: `plan.md`, `spec.md`, `data-model.md`

**Tests**: Exactly one Vitest acceptance test is required for each of AC-SEARCH-01 through
AC-SEARCH-05. Tests MUST be written and observed failing before the corresponding search
implementation tasks begin.

**Organization**: Tasks are grouped by user story so catalog browsing, book detail, and search can
be implemented and validated as separate increments.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it changes a different file and has no incomplete dependency.
- **[Story]**: Maps the task to a user story from `spec.md`.
- Every task includes an exact file or directory path.

## Scope Boundaries

The task list covers the six-table migration, sample catalog seed data, catalog/category reads,
book detail, and catalog search. Purchase behavior, order-processing behavior, queues, semantic
search, release operations, and unrelated extensions are outside this task list.

---

## Phase 1: Setup

**Purpose**: Establish the feature and test directories without changing runtime behavior.

- [X] T001 Create the planned catalog, database-type, and catalog-test directories at `src/catalog/`, `src/db/`, and `test/catalog/`

---

## Phase 2: Foundational Data and Worker Infrastructure

**Purpose**: Create the database foundation and shared Worker structures required by every story.

**⚠️ CRITICAL**: Complete this phase before starting any user story.

- [X] T002 Create `migrations/0001_initial.sql` for `categories`, `books`, `customers`, `orders`, `order_items`, and `order_events`, implementing every PK, FK, UNIQUE, and CHECK rule from `data-model.md`: `categories.name`; `books.category_id`, `books.title`, `books.author`, `books.description`, `books.price_cents`, `books.stock`; `customers.name`, `customers.email`; `orders.customer_id`, `orders.request_key`, `orders.created_at`; `order_items.order_id`, `order_items.book_id`, `order_items.quantity`, `order_items.unit_price_cents`; and `order_events.order_id`, `order_events.sequence`, `order_events.event_type`, `order_events.occurred_at`
- [X] T003 Create deterministic sample categories and available books for catalog and AC-SEARCH-01 through AC-SEARCH-05 in `sql/seed.sql`, using integer `price_cents` values and enough matching books to exercise the 10-result cap
- [X] T004 [P] Define the D1 binding and database row types required by the six-table schema in `src/db/types.ts`, citing the canonical field definitions in `specs/001-catalog-search/data-model.md`
- [X] T005 [P] Define catalog-list, category-list, book-detail, search-result, not-found, and `EMPTY_QUERY` response types in `src/catalog/types.ts`
- [X] T006 Create the catalog request handler boundary and connect the Worker entry point to it in `src/catalog/routes.ts` and `src/index.ts`, without implementing story-specific endpoint behavior
- [X] T007 Create reusable local-D1 reset and seed helpers for acceptance tests in `test/catalog/helpers.ts`, applying `migrations/0001_initial.sql` and `sql/seed.sql`

**Checkpoint**: The six-table schema, sample data, Worker routing boundary, and test fixture are ready.

---

## Phase 3: User Story 1 — Browse the Book Catalog (Priority: P1) 🎯 MVP

**Goal**: Customers can list all available books and list categories.

**Independent Test**: With the seed loaded, `GET /api/books` returns each available book exactly
once with identifier, title, author name, and integer `price_cents`; `GET /api/categories` returns
the seeded categories. An empty catalog produces an empty book list.

### Implementation for User Story 1

- [X] T008 [US1] Implement parameterized D1 reads for available books and categories in `src/catalog/repository.ts`, using `books.stock` from `data-model.md` as the availability source and mapping `books.id`, `books.title`, `books.author`, and `books.price_cents`
- [X] T009 [US1] Implement `GET /api/books` and `GET /api/categories` response handling in `src/catalog/routes.ts`

**Checkpoint**: Catalog and category listing work independently of detail and search behavior.

---

## Phase 4: User Story 2 — View One Book (Priority: P2)

**Goal**: Customers can request one available book by identifier and receive its full public details.

**Independent Test**: A known ID returns identifier, title, author name, description, integer
`price_cents`, and derived availability; an unknown ID returns a clear not-found response.

### Implementation for User Story 2

- [X] T010 [US2] Implement the parameterized available-book-by-ID read in `src/catalog/repository.ts`, mapping `books.id`, `books.title`, `books.author`, `books.description`, `books.price_cents`, and availability derived from `books.stock` as defined in `data-model.md`
- [X] T011 [US2] Implement `GET /api/books/:id` and its not-found response in `src/catalog/routes.ts`, ensuring the fixed `/api/books/search` path is routed before the `:id` path

**Checkpoint**: Book detail works independently with known and unknown identifiers.

---

## Phase 5: User Story 3 — Search by Title or Author (Priority: P3)

**Goal**: Customers can perform deterministic, case-insensitive title/author search with no more
than 10 results and the approved empty-query error.

**Independent Test**: AC-SEARCH-01 through AC-SEARCH-05 each pass in exactly one dedicated Vitest
test after first being observed failing before implementation.

### Acceptance Tests for User Story 3

- [X] T012 [P] [US3] Add exactly one failing Vitest test for AC-SEARCH-01 (`q=database` matches book title or author) in `test/catalog/search.ac-search-01.spec.ts`
- [X] T013 [P] [US3] Add exactly one failing Vitest test for AC-SEARCH-02 (`q=DATABASE` returns the same results as `q=database`) in `test/catalog/search.ac-search-02.spec.ts`
- [X] T014 [P] [US3] Add exactly one failing Vitest test for AC-SEARCH-03 (`q=unknown-book-xyz` returns `[]`) in `test/catalog/search.ac-search-03.spec.ts`
- [X] T015 [P] [US3] Add exactly one failing Vitest test for AC-SEARCH-04 (a successful search never returns more than 10 books) in `test/catalog/search.ac-search-04.spec.ts`
- [X] T016 [P] [US3] Add exactly one failing Vitest test for AC-SEARCH-05 (a truly empty `q` returns HTTP 400 with the exact `EMPTY_QUERY` body) in `test/catalog/search.ac-search-05.spec.ts`

### Implementation for User Story 3

- [X] T017 [US3] Implement the bound-parameter title/author search in `src/catalog/repository.ts`, returning only available books, sorting by title A–Z then `books.id`, limiting results to 10, and mapping `books.id`, `books.title`, `books.author`, and `books.price_cents` from `data-model.md`
- [X] T018 [US3] Implement `GET /api/books/search?q=` in `src/catalog/routes.ts`, including the exact HTTP 400 `EMPTY_QUERY` response for an empty query and an empty array for no matches

**Checkpoint**: All five requested search acceptance tests pass independently and together.

---

## Phase 6: Validation and Evidence

**Purpose**: Prove schema integrity and feature behavior with reproducible local evidence.

- [X] T019 Validate `migrations/0001_initial.sql` and `sql/seed.sql` against local D1, verifying all six tables plus PK, FK, CHECK, and UNIQUE enforcement, and record the commands and results in `specs/001-catalog-search/evidence.md`
- [X] T020 Run the complete Vitest suite, confirm exactly one test covers each of AC-SEARCH-01 through AC-SEARCH-05, and record the command and passing result in `specs/001-catalog-search/evidence.md`

---

## Dependencies and Execution Order

### Phase Dependencies

- **Phase 1 — Setup**: No dependencies.
- **Phase 2 — Foundational**: Depends on T001 and blocks every user story.
- **Phase 3 — US1**: Depends on Phase 2.
- **Phase 4 — US2**: Depends on Phase 2; logically independent of US1, though both update shared files.
- **Phase 5 — US3**: Depends on Phase 2. T012–T016 must fail before T017–T018 begin.
- **Phase 6 — Validation**: Depends on all selected user-story phases.

### User Story Dependencies

```text
Setup → Foundation ─┬→ US1: Catalog + Categories ─┐
                    ├→ US2: Book Detail ─────────┼→ Validation Evidence
                    └→ US3: Search ──────────────┘
```

US1, US2, and US3 are behaviorally independent after the foundation. Sequential execution is
recommended because they intentionally update the shared `src/catalog/repository.ts` and
`src/catalog/routes.ts` files.

### Within Each User Story

- Repository behavior precedes endpoint behavior.
- For US3, write and observe all five acceptance tests failing before implementation.
- Complete each story's independent test before advancing to the next priority.

### Parallel Opportunities

- T004 and T005 can run in parallel after T002 defines the schema.
- T012 through T016 can run in parallel after T007 provides the shared test helper.
- Documentation review of `spec.md`, `plan.md`, and `data-model.md` can happen alongside T001.

## Parallel Example: User Story 3

```text
Task T012: AC-SEARCH-01 test in test/catalog/search.ac-search-01.spec.ts
Task T013: AC-SEARCH-02 test in test/catalog/search.ac-search-02.spec.ts
Task T014: AC-SEARCH-03 test in test/catalog/search.ac-search-03.spec.ts
Task T015: AC-SEARCH-04 test in test/catalog/search.ac-search-04.spec.ts
Task T016: AC-SEARCH-05 test in test/catalog/search.ac-search-05.spec.ts
```

## Implementation Strategy

### MVP First

1. Complete Setup and Foundational phases.
2. Complete US1 to provide catalog and category listing.
3. Stop and validate US1 independently.
4. Add US2 and validate book detail independently.
5. Add US3 test-first and validate AC-SEARCH-01 through AC-SEARCH-05.
6. Complete local integrity and test-evidence tasks.

### Incremental Delivery

1. Migration and seed establish the shared data foundation.
2. Catalog/category listing provides the first usable increment.
3. Book detail adds one-book lookup without changing catalog behavior.
4. Search adds the five explicitly requested acceptance behaviors.
5. Final evidence confirms database integrity and acceptance coverage.

## Notes

- All runtime SQL values MUST use bound parameters.
- `data-model.md` is authoritative for field definitions and constraints.
- Tests MUST be written and observed failing before search implementation.
- Do not add work outside the explicit scope boundaries above.
- No implementation starts until this task list receives user approval.
