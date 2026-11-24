import { beforeEach, expect, it } from 'vitest';
import { SELF } from 'cloudflare:test';
import { resetAndSeedDatabase } from './helpers';

beforeEach(resetAndSeedDatabase);
it('AC-SEARCH-03: unknown query returns an empty list', async () => {
	const response = await SELF.fetch('https://example.com/api/books/search?q=unknown-book-xyz');
	expect(response.status).toBe(200);
	expect(await response.json()).toEqual([]);
});
