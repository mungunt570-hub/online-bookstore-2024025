export interface BookSummary {
	id: number;
	title: string;
	author_name: string;
	price_cents: number;
}

export interface BookDetail extends BookSummary {
	description: string;
	available: boolean;
}

export interface CategorySummary { id: number; name: string }
export interface ErrorResponse { error: { code: string; message: string } }
