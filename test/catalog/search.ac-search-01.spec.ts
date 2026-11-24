import { beforeEach, expect, it } from 'vitest';
import { SELF } from 'cloudflare:test';
import { resetAndSeedDatabase } from './helpers';

beforeEach(resetAndSeedDatabase);
it('AC-SEARCH-01: database matches title or author', async () => {
	const response = await SELF.fetch('https://example.com/api/books/search?q=database');
	const books = await response.json<Array<{ title: string; author_name: string }>>();
	expect(response.status).toBe(200);
	expect(books.length).toBeGreaterThan(0);
	expect(books.every((book) => `${book.title} ${book.author_name}`.toLowerCase().includes('database'))).toBe(true);
});
