import type { AppEnv } from '../db/types';
import { findAvailableBookById, listAvailableBooks, listCategories, searchAvailableBooks } from './repository';

const json = (body: unknown, status = 200) => Response.json(body, { status });

export async function handleCatalogRequest(request: Request, env: AppEnv): Promise<Response> {
	const url = new URL(request.url);
	if (request.method !== 'GET') return json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed.' } }, 405);

	if (url.pathname === '/api/books/search') {
		const query = url.searchParams.get('q');
		if (query === null || query === '') {
			return json({ error: { code: 'EMPTY_QUERY', message: 'Search query is required.' } }, 400);
		}
		return json(await searchAvailableBooks(env.DB, query));
	}

	if (url.pathname === '/api/books') return json(await listAvailableBooks(env.DB));
	if (url.pathname === '/api/categories') return json(await listCategories(env.DB));

	const detailMatch = url.pathname.match(/^\/api\/books\/(\d+)$/);
	if (detailMatch) {
		const book = await findAvailableBookById(env.DB, Number(detailMatch[1]));
		return book
			? json(book)
			: json({ error: { code: 'BOOK_NOT_FOUND', message: 'Book not found.' } }, 404);
	}

	return json({ error: { code: 'NOT_FOUND', message: 'Route not found.' } }, 404);
}
