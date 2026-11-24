---
title: Design Decisions
summary: Approved catalog, search, relational-model, and personalized-learning design decisions.
sources:
  - raw/001-spec-snapshot.md
  - raw/001-data-model-snapshot.md
  - raw/migration-0001.sql
  - raw/changes-snapshot.md
  - raw/004-spec-snapshot.md
  - raw/proposal/proposal.md
---

# Design Decisions

## Catalog and search

- Customer-visible catalog and search results include only books with derived availability from
  `books.stock > 0`; availability is not stored as a separate database fact. Source:
  `docs/llm-wiki/raw/001-data-model-snapshot.md`.
- Search matches title or author text case-insensitively, orders by title and then book identifier,
  and returns at most 10 books. Source: `docs/llm-wiki/raw/001-spec-snapshot.md`.
- Search responses use integer `price_cents`; decimal amounts and currency columns are excluded
  from the approved data model. Source: `docs/llm-wiki/raw/001-spec-snapshot.md` and
  `docs/llm-wiki/raw/001-data-model-snapshot.md`.
- Leading and trailing whitespace is removed before search matching. A query that is empty after
  trimming returns HTTP 400 with the exact `EMPTY_QUERY` body. Source:
  `docs/llm-wiki/raw/changes-snapshot.md` and `docs/llm-wiki/raw/001-spec-snapshot.md`.

## Common relational model

- The common schema contains `categories`, `books`, `customers`, `orders`, `order_items`, and
  `order_events`. Source: `docs/llm-wiki/raw/migration-0001.sql`.
- `books.stock` and both cent-denominated price fields reject negative values; `orders.request_key`
  is unique. Source: `docs/llm-wiki/raw/migration-0001.sql`.
- Orders and books form a many-to-many relationship through `order_items`, whose composite primary
  key is `(order_id, book_id)`. Source: `docs/llm-wiki/raw/001-data-model-snapshot.md` and
  `docs/llm-wiki/raw/migration-0001.sql`.
- The model is intended to satisfy 3NF by separating category, book, customer, order, order-line,
  and event facts and deriving totals and availability rather than duplicating them. Source:
  `docs/llm-wiki/raw/001-data-model-snapshot.md`.
- Atomic purchase behavior, overselling prevention, event transitions, and idempotent order
  creation are described as design rules, but their implementation and runtime behavior are
  **Not verified** by the ingested test log. Source:
  `docs/llm-wiki/raw/001-data-model-snapshot.md` and `docs/llm-wiki/raw/test-log.txt`.

## Personalized learning extension

- A selected skill yields books for that skill and its transitive prerequisites, with prerequisite
  skills ordered before dependent skills. Source: `docs/llm-wiki/raw/004-spec-snapshot.md`.
- Results use only existing D1 `books` rows, contain no duplicate book identifiers, order books
  within a skill by `position` then `book_id`, and order independent branches by `skill_id`.
  Source: `docs/llm-wiki/raw/004-spec-snapshot.md`.
- The extension defines `skills`, `book_skills`, and `skill_prerequisites`; `book_skills.book_id`
  references the existing common `books` table. Source:
  `docs/llm-wiki/raw/004-spec-snapshot.md`.
- Duplicate book-skill pairs are prevented by the `book_skills` composite primary key, and direct
  self-prerequisites are rejected by `CHECK (skill_id <> prerequisite_skill_id)`. Source:
  `docs/llm-wiki/raw/004-spec-snapshot.md`.
- Indirect-cycle rejection requires graph validation beyond the row-level CHECK. Its implementation
  is **Not verified**. Source: `docs/llm-wiki/raw/004-spec-snapshot.md` and
  `docs/llm-wiki/raw/test-log.txt`.
- The earlier proposal called the book-skill ordering field `level`; the approved feature snapshot
  uses `position` and adds `UNIQUE (skill_id, position)`. The approved snapshot is treated as the
  current decision. Source: `docs/llm-wiki/raw/proposal/proposal.md` and
  `docs/llm-wiki/raw/004-spec-snapshot.md`.

See also [[test-results-and-lessons|Test Results and Lessons]].
