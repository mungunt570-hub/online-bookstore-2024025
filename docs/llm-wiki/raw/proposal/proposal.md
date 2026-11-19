# Proposal: Personalized Learning Bookstore

## 1. Problem and target users

Students who want to learn a subject (for example databases or web development) usually do not know which books to read, or in what order. A normal online bookstore lets them search by title or keyword, but it cannot say "read this book first, because you need its skills before the next one."

**Target users:** university students and self-learners who want a reading path for a skill, and bookstore staff who maintain the catalog.

**Common system (all students):** Book Catalog, Book Search (FTS5), Customer & Order, Purchase Transaction, Concurrent Purchase, Order Events, Semantic Search, Book Recommendation, Testing & Deployment on Cloudflare Workers, D1, Queues, Workers AI and Vectorize.

## 2. Individual extension: Personalized Learning Bookstore

The extension adds a skill graph on top of the book catalog. A customer picks a skill they want to learn, and the system recommends books in the right prerequisite order, using only books that exist in D1.

**New data (candidate tables):**

| Table                 | Purpose                                    | Key columns                                                                                               |
| --------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `skills`              | A learnable skill                          | `skill_id` (PK), `name` (UNIQUE), `description`                                                           |
| `book_skills`         | M:N link between books and skills          | `book_id` (FK), `skill_id` (FK), `level` ; PK (`book_id`, `skill_id`)                                     |
| `skill_prerequisites` | Which skill must be learned before another | `skill_id` (FK), `prerequisite_skill_id` (FK) ; PK of both; CHECK (`skill_id` <> `prerequisite_skill_id`) |

**Example:** SQL Basics -> Relational Model -> Normalization (3NF) -> Transactions -> Concurrency Control. Each skill is covered by one or more books in the catalog.

## 3. User Story

**US-01:** As a student who wants to learn database concurrency, I want to see which skills I must learn first and which books in the store teach them, so that I can buy and read the right books in the right order.

**US-02:** As a bookstore administrator, I want to define which skill is a prerequisite of another, so that recommendations always follow a valid learning order.

## 4. Acceptance Criteria (verifiable with SQL and tests)

1. **Prerequisite order:** For a target skill, the recommendation API returns skills in an order where every prerequisite appears before the skill that needs it. A test checks that no skill appears before any of its prerequisites.
2. **Only books in D1:** Every book returned by the recommendation exists in the `books` table. A SQL check joining the result to `books` returns zero unmatched rows, and a skill with no book is reported as "no book available" instead of an invented title.
3. **No duplicates and no self-prerequisite:** Inserting the same (`book_id`, `skill_id`) pair twice, or a skill that is its own prerequisite, is rejected by a constraint, and a test confirms the error.
4. **No cycles:** Adding a prerequisite that would create a cycle (A needs B, B needs A) is rejected, and a test confirms that the data stays unchanged.

## 5. Out of scope

- Real payment processing (only simulated purchases)
- User accounts with passwords, login, or any real personal data
- Automatic generation of skills or prerequisites by an AI model (the skill graph is entered by hand and checked)
- Recommending books that are not in the D1 catalog, such as external websites or ebooks
- Multi-language support