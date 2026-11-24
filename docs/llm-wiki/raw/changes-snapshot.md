# Specification Change Requests

## CHG-001 — Trim surrounding search-query whitespace

**Status**: Approved
**Date**: 2026-11-24
**Feature**: `specs/001-catalog-search/spec.md`

### Reason

A manual request using `q=%20%20database%20%20` showed that leading and trailing spaces are
currently treated as part of the search term. The approved specification intentionally left
whitespace behavior undefined, so changing the implementation requires a specification update
before code changes.

### Impact

- Search input will remove leading and trailing whitespace before matching titles or authors.
- A spaced query such as `" database "` will produce the same ordered, capped results as
  `"database"`.
- Existing case-insensitive matching, result ordering, the 10-result cap, response fields, and
  integer `price_cents` representation remain unchanged.
- The existing empty-query contract is not redefined by this change; only the stated non-empty
  spaced-query behavior is proposed.
- No database schema, seed data, catalog endpoint, detail endpoint, category endpoint, currency
  field, or deployment behavior changes.

### New test

Add one Vitest acceptance test proving that
`GET /api/books/search?q=%20database%20` returns the same HTTP status and response body as
`GET /api/books/search?q=database`.

### Proposed specification updates

- Add `FR-SEARCH-06`: Search MUST trim leading and trailing whitespace from a non-empty query
  before matching.
- Add `AC-SEARCH-06`: Searching `" database "` returns the same results as searching
  `"database"`.
- Renumber the existing `AC-SEARCH-06` through `AC-SEARCH-08` to `AC-SEARCH-07` through
  `AC-SEARCH-09` to keep acceptance-criterion identifiers unique.

## CHG-002 — Reject queries empty after trimming

**Status**: Approved
**Date**: 2026-11-24
**Feature**: `specs/001-catalog-search/spec.md`

### Reason

A manual request using `q=%20%20` showed that a spaces-only query is non-empty before trimming but
empty afterward. The current handler searches with the trimmed empty string, which matches all
available books and returns HTTP 200. This conflicts with the intended empty-query behavior.

### Impact

- Search validation will occur after leading and trailing whitespace is removed.
- A query that becomes empty after trimming will return HTTP 400 with the existing exact
  `EMPTY_QUERY` error body.
- The existing truly empty query behavior remains unchanged.
- Non-empty spaced queries continue to use CHG-001 behavior.
- No database schema, seed data, response fields, `price_cents` representation, currency field,
  catalog/detail/category endpoint, or deployment behavior changes.

### New test

Add one Vitest acceptance test proving that `GET /api/books/search?q=%20%20` returns HTTP 400 with
`{ "error": { "code": "EMPTY_QUERY", "message": "Search query is required." } }`.

### Proposed specification updates

- Add `FR-SEARCH-07`: Search MUST return HTTP 400 with the existing `EMPTY_QUERY` error body when
  the query is empty after trimming leading and trailing whitespace.
- Add `AC-SEARCH-10`: Searching with a spaces-only query returns HTTP 400 with the exact
  `EMPTY_QUERY` error body.
