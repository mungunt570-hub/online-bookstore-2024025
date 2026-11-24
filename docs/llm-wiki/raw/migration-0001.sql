CREATE TABLE categories (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE CHECK (name <> '')
);

CREATE TABLE books (
  id INTEGER PRIMARY KEY,
  category_id INTEGER NOT NULL,
  title TEXT NOT NULL CHECK (title <> ''),
  author TEXT NOT NULL CHECK (author <> ''),
  description TEXT NOT NULL,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  stock INTEGER NOT NULL CHECK (stock >= 0),
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL CHECK (name <> ''),
  email TEXT NOT NULL UNIQUE CHECK (email <> '')
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  request_key TEXT NOT NULL UNIQUE CHECK (request_key <> ''),
  created_at TEXT NOT NULL CHECK (created_at <> ''),
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT
);

CREATE TABLE order_items (
  order_id INTEGER NOT NULL,
  book_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents >= 0),
  PRIMARY KEY (order_id, book_id),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE RESTRICT
);

CREATE TABLE order_events (
  id INTEGER PRIMARY KEY,
  order_id INTEGER NOT NULL,
  sequence INTEGER NOT NULL CHECK (sequence >= 1),
  event_type TEXT NOT NULL CHECK (event_type IN ('CREATED', 'CONFIRMED', 'CANCELLED')),
  occurred_at TEXT NOT NULL CHECK (occurred_at <> ''),
  UNIQUE (order_id, sequence),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT
);
