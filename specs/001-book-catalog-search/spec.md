# Feature Specification: Book Catalog and Search

**Feature Branch**: `001-book-catalog-search`

**Created**: 2026-11-24

**Status**: Draft

**Input**: User description: "Book Catalog and Book Search. Customers can list books, view one book, and search books by title or author. Search is case-insensitive. Return at most 10 books. No match returns an empty list. Do not implement code yet. Write testable acceptance criteria."

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
   contains the book identifier, title, author name, and price.

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
   customer receives that book's identifier, title, author name, description, price, and
   availability status.
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

1. **Given** a book title contains "The Hobbit", **When** a customer searches for "hobbit",
   **Then** that book appears in the results.
2. **Given** an author is named "Ursula K. Le Guin", **When** a customer searches for "LE GUIN",
   **Then** books by that author appear in the results.
3. **Given** books match the search text in either title or author name, **When** a customer searches,
   **Then** each matching book appears no more than once.
4. **Given** more than 10 books match the search text, **When** a customer searches, **Then** no more
   than 10 books are returned.
5. **Given** no title or author matches the search text, **When** a customer searches, **Then** an
   empty list is returned.
6. **Given** a search term has leading or trailing whitespace, **When** a customer searches,
   **Then** the whitespace is ignored and results match the trimmed term.
7. **Given** a search term is empty or contains only whitespace, **When** a customer searches,
   **Then** an empty list is returned.

### Edge Cases

- A book that matches in both its title and author name appears only once.
- Two distinct books with the same title remain separate results because their identifiers differ.
- Search remains case-insensitive when the stored text and search term use different letter cases.
- Catalog listing returns an empty list when the catalog has no available books.
- An unknown book identifier produces a not-found outcome rather than an empty or unrelated book.
- Search never returns an unavailable book, even when its title or author matches.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow customers to list all available books in the catalog.
- **FR-002**: Each catalog entry MUST include the book identifier, title, author name, and price.
- **FR-003**: The system MUST allow a customer to view one book using its identifier.
- **FR-004**: A book detail result MUST include the identifier, title, author name, description,
  price, and availability status.
- **FR-005**: The system MUST return a clear not-found outcome when the requested book does not
  exist.
- **FR-006**: The system MUST allow customers to search available books using title or author text.
- **FR-007**: Search MUST match when the search text occurs anywhere within a title or author name.
- **FR-008**: Search comparisons MUST be case-insensitive.
- **FR-009**: Search MUST ignore leading and trailing whitespace in the supplied term.
- **FR-010**: Search MUST return no more than 10 books.
- **FR-011**: Search MUST return an empty list when no books match.
- **FR-012**: Search MUST return an empty list for an empty or whitespace-only term.
- **FR-013**: A book that matches both title and author MUST appear only once in a search result.
- **FR-014**: Catalog and search results MUST include only books currently available to customers.

### Key Entities *(include if feature involves data)*

- **Book**: A catalog item identified by a unique book identifier, with a title, author,
  description, price, and availability status.
- **Author**: The person credited for one or more books; the displayed author name is searchable.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Customers can list the catalog, select a book, and view its details without an error
  for 100% of available books in the acceptance dataset.
- **SC-002**: Every case-variation of a known title or author query returns the same matching set in
  the acceptance dataset.
- **SC-003**: Every search returns between 0 and 10 distinct books, inclusive.
- **SC-004**: Searches with no matching title or author return an empty list in 100% of acceptance
  tests.
- **SC-005**: At least 95% of catalog, detail, and search requests show the customer a complete
  result or clear empty/not-found outcome within 2 seconds under the agreed acceptance workload.
- **SC-006**: At least 90% of representative users can find a known book by browsing or searching
  and open its details on their first attempt without assistance.

## Assumptions

- The 10-book maximum applies to search results; the catalog-listing feature returns all available
  books because no catalog limit was requested.
- Search uses partial-text matching within title and author name rather than exact matching.
- Leading and trailing whitespace is not meaningful search text.
- An empty search is not treated as a catalog-listing request; it returns an empty list.
- Only books marked available are customer-visible in catalog and search results.
- Catalog administration, sorting, filtering, pagination, recommendations, purchasing, and search
  relevance ranking are outside this feature's scope.
