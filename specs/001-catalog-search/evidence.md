# Implementation Evidence: Book Catalog and Search

**Date**: 2026-11-24

## Test-first evidence

Before search implementation, the five dedicated acceptance tests were run locally. After the
fixture was corrected, AC-SEARCH-01, AC-SEARCH-03, AC-SEARCH-04, and AC-SEARCH-05 failed against
the 404 route boundary. AC-SEARCH-02 initially produced a false positive because both requests
returned the same 404 body; the test was strengthened to require HTTP 200 and then observed
failing before search implementation.

## Local D1 evidence

Commands used only the local D1 database:

```text
npx wrangler d1 migrations apply bookstore-db --local
npx wrangler d1 execute bookstore-db --local --file sql/seed.sql
npx wrangler d1 execute bookstore-db --local --command <schema/query checks>
```

Results:

- Migration `0001_initial.sql`: 7 commands executed successfully.
- Seed: 2 commands executed successfully.
- Six tables found: `books`, `categories`, `customers`, `order_events`, `order_items`, `orders`.
- Available `database` matches: 12, exceeding the AC-SEARCH-04 limit threshold.
- Invalid probes were rejected with SQLite constraint errors:
  - FK: `FOREIGN KEY constraint failed`.
  - CHECK: `CHECK constraint failed: stock >= 0`.
  - UNIQUE: `UNIQUE constraint failed: categories.name`.
  - PK: `UNIQUE constraint failed: categories.id` with primary-key classification.

## Full test suite

Command:

```text
npx vitest run
```

Real output:

```text
Test Files  6 passed (6)
Tests       7 passed (7)
Duration    3.12s
```

Acceptance results:

- AC-SEARCH-01: PASS
- AC-SEARCH-02: PASS
- AC-SEARCH-03: PASS
- AC-SEARCH-04: PASS
- AC-SEARCH-05: PASS

Type validation also passed with `npx tsc --noEmit`.
