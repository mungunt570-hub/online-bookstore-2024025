import { env } from 'cloudflare:test';
import type { AppEnv } from '../../src/db/types';
import migrationSql from '../../migrations/0001_initial.sql';
import seedSql from '../../sql/seed.sql';

const database = (env as unknown as AppEnv).DB;

export async function resetAndSeedDatabase(): Promise<void> {
	await database.exec('PRAGMA foreign_keys = OFF;');
	for (const table of ['order_events', 'order_items', 'orders', 'customers', 'books', 'categories']) {
		await database.exec(`DROP TABLE IF EXISTS ${table};`);
	}
	await database.exec(migrationSql.replace(/\r?\n/g, ' '));
	await database.exec(seedSql.replace(/\r?\n/g, ' '));
}
