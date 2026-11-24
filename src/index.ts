import { handleCatalogRequest } from './catalog/routes';
import type { AppEnv } from './db/types';

export default {
	async fetch(request, env): Promise<Response> {
		return handleCatalogRequest(request, env);
	},
} satisfies ExportedHandler<AppEnv>;
