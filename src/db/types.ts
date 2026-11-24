export interface AppEnv {
	DB: D1Database;
}

export interface CategoryRow {
	id: number;
	name: string;
}

export interface BookRow {
	id: number;
	category_id: number;
	title: string;
	author: string;
	description: string;
	price_cents: number;
	stock: number;
}

export interface CustomerRow { id: number; name: string; email: string }
export interface OrderRow { id: number; customer_id: number; request_key: string; created_at: string }
export interface OrderItemRow { order_id: number; book_id: number; quantity: number; unit_price_cents: number }
export interface OrderEventRow { id: number; order_id: number; sequence: number; event_type: 'CREATED' | 'CONFIRMED' | 'CANCELLED'; occurred_at: string }
