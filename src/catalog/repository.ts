import type { BookRow, CategoryRow } from '../db/types';
import type { BookDetail, BookSummary, CategorySummary } from './types';

const summarySql = `
  SELECT id, title, author, price_cents
  FROM books
  WHERE stock > 0
`;

function toSummary(row: Pick<BookRow, 'id' | 'title' | 'author' | 'price_cents'>): BookSummary {
	return { id: row.id, title: row.title, author_name: row.author, price_cents: row.price_cents };
}

export async function listAvailableBooks(db: D1Database): Promise<BookSummary[]> {
	const result = await db.prepare(`${summarySql} ORDER BY title COLLATE NOCASE ASC, id ASC`).all<Pick<BookRow, 'id' | 'title' | 'author' | 'price_cents'>>();
	return result.results.map(toSummary);
}

export async function listCategories(db: D1Database): Promise<CategorySummary[]> {
	const result = await db.prepare('SELECT id, name FROM categories ORDER BY name COLLATE NOCASE ASC, id ASC').all<CategoryRow>();
	return result.results;
}

export async function findAvailableBookById(db: D1Database, id: number): Promise<BookDetail | null> {
	const row = await db.prepare(`
    SELECT id, title, author, description, price_cents, stock
    FROM books
    WHERE id = ? AND stock > 0
  `).bind(id).first<Pick<BookRow, 'id' | 'title' | 'author' | 'description' | 'price_cents' | 'stock'>>();
	if (!row) return null;
	return { ...toSummary(row), description: row.description, available: row.stock > 0 };
}

export async function searchAvailableBooks(db: D1Database, query: string): Promise<BookSummary[]> {
	const pattern = `%${query}%`;
	const result = await db.prepare(`
    ${summarySql}
      AND (title LIKE ? COLLATE NOCASE OR author LIKE ? COLLATE NOCASE)
    ORDER BY title COLLATE NOCASE ASC, id ASC
    LIMIT 10
  `).bind(pattern, pattern).all<Pick<BookRow, 'id' | 'title' | 'author' | 'price_cents'>>();
	return result.results.map(toSummary);
}
