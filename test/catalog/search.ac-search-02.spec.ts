import { beforeEach, expect, it } from 'vitest';
import { SELF } from 'cloudflare:test';
import { resetAndSeedDatabase } from './helpers';

beforeEach(resetAndSeedDatabase);
it('AC-SEARCH-02: DATABASE returns the same results', async () => {
	const lowerResponse = await SELF.fetch('https://example.com/api/books/search?q=database');
	const upperResponse = await SELF.fetch('https://example.com/api/books/search?q=DATABASE');
	expect(lowerResponse.status).toBe(200);
	expect(upperResponse.status).toBe(200);
	const lower = await lowerResponse.json();
	const upper = await upperResponse.json();
	expect(upper).toEqual(lower);
});
