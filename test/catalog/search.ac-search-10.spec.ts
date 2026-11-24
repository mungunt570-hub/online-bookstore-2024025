import { SELF } from 'cloudflare:test';
import { beforeEach, expect, it } from 'vitest';
import { resetAndSeedDatabase } from './helpers';

beforeEach(resetAndSeedDatabase);

it('AC-SEARCH-10: a query empty after trimming returns the exact HTTP 400 error', async () => {
	const response = await SELF.fetch('https://example.com/api/books/search?q=%20%20');

	expect(response.status).toBe(400);
	expect(await response.json()).toEqual({
		error: { code: 'EMPTY_QUERY', message: 'Search query is required.' },
	});
});
