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
