import {
	SELF,
} from "cloudflare:test";
import { beforeEach, describe, it, expect } from "vitest";
import { resetAndSeedDatabase } from './catalog/helpers';

describe("catalog worker", () => {
	beforeEach(resetAndSeedDatabase);

	it("lists available books and categories", async () => {
		const books = await (await SELF.fetch("https://example.com/api/books")).json<Array<{ price_cents: number }>>();
		const categories = await (await SELF.fetch("https://example.com/api/categories")).json<unknown[]>();
		expect(books).toHaveLength(13);
		expect(books.every((book) => Number.isInteger(book.price_cents))).toBe(true);
		expect(categories).toHaveLength(2);
	});

	it("returns details for an available book and 404 for an unknown book", async () => {
		const found = await SELF.fetch("https://example.com/api/books/1");
		const missing = await SELF.fetch("https://example.com/api/books/999");
		expect(found.status).toBe(200);
		expect(await found.json()).toMatchObject({ id: 1, price_cents: 2599, available: true });
		expect(missing.status).toBe(404);
	});
});
