import { beforeEach, expect, it } from 'vitest';
import { SELF } from 'cloudflare:test';
import { resetAndSeedDatabase } from './helpers';

beforeEach(resetAndSeedDatabase);
it('AC-SEARCH-05: an empty query returns the exact HTTP 400 error', async () => {
	const response = await SELF.fetch('https://example.com/api/books/search?q=');
	expect(response.status).toBe(400);
	expect(await response.json()).toEqual({
		error: { code: 'EMPTY_QUERY', message: 'Search query is required.' },
	});
});
