INSERT INTO categories (id, name) VALUES
  (1, 'Databases'),
  (2, 'Software Engineering');

INSERT INTO books (id, category_id, title, author, description, price_cents, stock) VALUES
  (1, 1, 'Database Design Basics', 'Ada Query', 'An introduction to relational design.', 2599, 5),
  (2, 1, 'Advanced Database Systems', 'Lin Database', 'Advanced database architecture.', 4599, 4),
  (3, 1, 'Cloud Database Patterns', 'Rina Scale', 'Patterns for cloud data systems.', 3999, 6),
  (4, 1, 'Database Reliability', 'Sam Durable', 'Reliable data operations.', 3499, 3),
  (5, 1, 'Database Indexing', 'Ivy Btree', 'Practical indexing techniques.', 2899, 2),
  (6, 1, 'Database Transactions', 'Tara Atomic', 'Transaction design and isolation.', 3299, 8),
  (7, 1, 'Database Normalization', 'Nora Form', 'Relational normalization explained.', 2799, 7),
  (8, 1, 'Database Security', 'Seth Guard', 'Protecting stored data.', 3699, 5),
  (9, 1, 'Database Testing', 'Tess Verify', 'Testing relational applications.', 3099, 9),
  (10, 1, 'Database Performance', 'Pia Fast', 'Query performance fundamentals.', 4199, 3),
  (11, 1, 'Database Migrations', 'Mira Change', 'Safe schema evolution.', 2999, 5),
  (12, 1, 'Database Operations', 'Omar Runtime', 'Operating production databases.', 3899, 4),
  (13, 2, 'TypeScript Workers', 'Cora Edge', 'Building edge applications.', 3199, 6),
  (14, 2, 'Unavailable Database Archive', 'Uma Shelf', 'An unavailable catalog record.', 1999, 0);
