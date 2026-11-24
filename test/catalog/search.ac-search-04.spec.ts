import { beforeEach, expect, it } from 'vitest';
import { SELF } from 'cloudflare:test';
import { resetAndSeedDatabase } from './helpers';

beforeEach(resetAndSeedDatabase);
it('AC-SEARCH-04: response contains no more than 10 books', async () => {
	const response = await SELF.fetch('https://example.com/api/books/search?q=database');
	const books = await response.json<unknown[]>();
	expect(books.length).toBeLessThanOrEqual(10);
	expect(books.length).toBe(10);
});
