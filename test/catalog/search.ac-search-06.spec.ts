import { SELF } from 'cloudflare:test';
import { beforeEach, expect, it } from 'vitest';
import { resetAndSeedDatabase } from './helpers';

beforeEach(resetAndSeedDatabase);

it('AC-SEARCH-06: surrounding whitespace produces the same search results', async () => {
	const plainResponse = await SELF.fetch('https://example.com/api/books/search?q=database');
	const spacedResponse = await SELF.fetch('https://example.com/api/books/search?q=%20database%20');

	expect(plainResponse.status).toBe(200);
	expect(spacedResponse.status).toBe(200);
	expect(await spacedResponse.json()).toEqual(await plainResponse.json());
});
