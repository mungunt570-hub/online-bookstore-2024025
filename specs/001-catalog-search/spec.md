# Feature Specification: Book Catalog and Search

**Feature Branch**: `001-catalog-search`

**Created**: 2026-11-24

**Status**: Draft

**Input**: User description: "Book Catalog and Book Search. Customers can list books, view one book, and search books by title or author. Search is case-insensitive. Return at most 10 books. No match returns an empty list. Do not implement code yet. Write testable acceptance criteria."

## Clarifications

### Session 2026-11-24

- Q: When more than 10 books match a search, how should the 10 returned books be selected? → A:
  Sort by title A–Z, then book identifier, and return the first 10.
- Q: What response body should accompany HTTP 400 when the search query is empty? → A: Return
  `{ "error": { "code": "EMPTY_QUERY", "message": "Search query is required." } }`.
- Q: Which fields should each book in a search response contain? → A: Book identifier, title,
  author name, and integer `price_cents`.
- Q: Should integer `price_cents` replace the generic `price` field in every book response or only
  in search results? → A: Use integer `price_cents` in catalog, search, and book-detail responses.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse the Book Catalog (Priority: P1)

A customer can view the available book catalog to discover books without entering a search term.

**Why this priority**: Catalog browsing is the basic discovery path and provides value even when a
customer does not know a title or author.

**Independent Test**: Populate the catalog with known books, request the catalog, and verify that
each available book is represented once with the summary information needed to identify it.

**Acceptance Scenarios**:

1. **Given** the catalog contains available books, **When** a customer lists the catalog, **Then**
   the customer receives every available book exactly once.
2. **Given** the catalog contains no available books, **When** a customer lists the catalog,
   **Then** the customer receives an empty list.
3. **Given** a catalog result, **When** the customer examines each entry, **Then** each entry
   contains the book identifier, title, author name, and integer `price_cents`.

---

### User Story 2 - View One Book (Priority: P2)

A customer can select a catalog or search result and view the complete public details for that book.

**Why this priority**: Customers need enough information about an individual book to decide whether
they are interested in purchasing it.

**Independent Test**: Create one known book, request it by its identifier, and verify that the
returned details belong to that book; then request an unknown identifier and verify the not-found
outcome.

**Acceptance Scenarios**:

1. **Given** a book exists, **When** a customer requests that book by its identifier, **Then** the
   customer receives that book's identifier, title, author name, description, integer
   `price_cents`, and availability status.
2. **Given** no book has the requested identifier, **When** a customer requests it, **Then** the
   customer receives a clear not-found outcome and no different book is returned.

---

### User Story 3 - Search by Title or Author (Priority: P3)

A customer can search the catalog using all or part of a title or author name and receive a concise
set of matching books.

**Why this priority**: Search speeds up discovery in a larger catalog while browsing and detail
viewing still provide a viable catalog without it.

**Independent Test**: Use a controlled catalog containing mixed-case titles and author names, run
searches with known title and author fragments in different letter cases, and verify the exact
matching set and result limit.

**Acceptance Scenarios**:

- **AC-SEARCH-01**: Searching "database" returns books whose title or author matches.
- **AC-SEARCH-02**: Searching "DATABASE" returns the same results.
- **AC-SEARCH-03**: Searching "unknown-book-xyz" returns `[]`.
- **AC-SEARCH-04**: The response never contains more than 10 books.
- **AC-SEARCH-05**: An empty query returns HTTP 400 with
  `{ "error": { "code": "EMPTY_QUERY", "message": "Search query is required." } }`.
- **AC-SEARCH-06**: Searching " database " returns the same results as searching "database".
- **AC-SEARCH-07**: A book matching both its title and author appears only once in the response.
- **AC-SEARCH-08**: When more than 10 books match, results are sorted by title A–Z and then by
  book identifier; only the first 10 are returned.
- **AC-SEARCH-09**: Every returned book contains its identifier, title, author name, and integer
  `price_cents`.
- **AC-SEARCH-10**: Searching with a spaces-only query returns HTTP 400 with
  `{ "error": { "code": "EMPTY_QUERY", "message": "Search query is required." } }`.

### Edge Cases

- A book that matches in both its title and author name appears only once.
- Two distinct books with the same title remain separate results because their identifiers differ.
- Search remains case-insensitive when the stored text and search term use different letter cases.
- Leading and trailing whitespace in a non-empty search query is removed before matching.
- A query that is empty after trimming leading and trailing whitespace returns the same HTTP 400
  `EMPTY_QUERY` response as a truly empty query.
- Books with identical titles are ordered by book identifier before the 10-result limit is applied.
- Catalog listing returns an empty list when the catalog has no available books.
- An unknown book identifier produces a not-found outcome rather than an empty or unrelated book.
- Search never returns an unavailable book, even when its title or author matches.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow customers to list all available books in the catalog.
- **FR-002**: Each catalog entry MUST include the book identifier, title, author name, and integer
  `price_cents`.
- **FR-003**: The system MUST allow a customer to view one book using its identifier.
- **FR-004**: A book detail result MUST include the identifier, title, author name, description,
  integer `price_cents`, and availability status.
- **FR-005**: The system MUST return a clear not-found outcome when the requested book does not
  exist.
- **FR-006**: The system MUST allow customers to search available books using title or author text.
- **FR-007**: Search MUST match when the search text occurs anywhere within a title or author name.
- **FR-008**: Search comparisons MUST be case-insensitive.
- **FR-009**: Search MUST sort matches by title A–Z, then by book identifier, and return the first
  10 books.
- **FR-010**: Search MUST return an empty list when no books match.
- **FR-011**: Search MUST return HTTP 400 with
  `{ "error": { "code": "EMPTY_QUERY", "message": "Search query is required." } }` when the query
  is empty.
- **FR-012**: A book that matches both title and author MUST appear only once in a search result.
- **FR-013**: Catalog and search results MUST include only books currently available to customers.
- **FR-014**: Each search result MUST include the book identifier, title, author name, and integer
  `price_cents`.
- **FR-SEARCH-06**: Search MUST trim leading and trailing whitespace from a non-empty query before
  matching titles or authors.
- **FR-SEARCH-07**: Search MUST return HTTP 400 with
  `{ "error": { "code": "EMPTY_QUERY", "message": "Search query is required." } }` when the
  query is empty after trimming leading and trailing whitespace.

### Key Entities *(include if feature involves data)*

- **Book**: A catalog item identified by a unique book identifier, with a title, author,
  description, integer `price_cents`, and availability status.
- **Author**: The person credited for one or more books; the displayed author name is searchable.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Customers can list the catalog, select a book, and view its details without an error
  for 100% of available books in the acceptance dataset.
- **SC-002**: Every case-variation of a known title or author query returns the same matching set in
  the acceptance dataset.
- **SC-003**: Every successful search response contains between 0 and 10 distinct books, sorted by
  title A–Z and then book identifier before the 10-result limit is applied.
- **SC-004**: Searches with no matching title or author return an empty list in 100% of acceptance
  tests.
- **SC-005**: Empty-query searches return HTTP 400 with error code `EMPTY_QUERY` and message
  `Search query is required.` in 100% of acceptance tests.
- **SC-006**: At least 95% of catalog, detail, and search requests show the customer a complete
  result or clear empty/not-found outcome within 2 seconds under the agreed acceptance workload.
- **SC-007**: At least 90% of representative users can find a known book by browsing or searching
  and open its details on their first attempt without assistance.
- **SC-008**: Every catalog, search, and book-detail response containing a price represents it as
  integer `price_cents` in 100% of acceptance tests.
- **SC-009**: A non-empty search query with leading or trailing whitespace returns the same ordered
  and capped result set as the same query without surrounding whitespace in 100% of acceptance
  tests.
- **SC-010**: Queries that are empty after trimming return HTTP 400 with error code `EMPTY_QUERY`
  and message `Search query is required.` in 100% of acceptance tests.

## Assumptions

- The 10-book maximum applies to search results; the catalog-listing feature returns all available
  books because no catalog limit was requested.
- Search uses partial-text matching within title and author name rather than exact matching.
- An empty search is invalid and returns HTTP 400 rather than catalog results.
- Only books marked available are customer-visible in catalog and search results.
- Catalog administration, customer-selected sorting, filtering, pagination, recommendations,
  purchasing, and search relevance ranking are outside this feature's scope.

## Specification Change Record

- **2026-11-24**: Renamed the feature directory to `001-catalog-search`; added explicit
  AC-SEARCH-01 through AC-SEARCH-05; and changed empty-query behavior from an empty list to HTTP 400.
- **2026-11-24**: Clarified deterministic search ordering, the empty-query error response, search
  result fields, and consistent integer `price_cents` representation across book responses. No
  application code was changed.
- **2026-11-24**: Approved CHG-001 to trim leading and trailing whitespace from non-empty search
  queries and add acceptance coverage for equivalent spaced and unspaced queries.
- **2026-11-24**: Approved CHG-002 to treat queries that are empty after trimming as empty queries
  and return the existing HTTP 400 `EMPTY_QUERY` response.
