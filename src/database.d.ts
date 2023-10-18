export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	public: {
		Tables: {
			entries: {
				Row: {
					author: string;
					content: string;
					created_at: string;
					id: string;
					title: string;
					updated_at: string;
				};
				Insert: {
					author: string;
					content: string;
					created_at?: string;
					id?: string;
					title: string;
					updated_at?: string;
				};
				Update: {
					author?: string;
					content?: string;
					created_at?: string;
					id?: string;
					title?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'entries_author_fkey';
						columns: ['author'];
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
			journals: {
				Row: {
					author: string;
					created_at: string;
					description: string | null;
					entries: string[];
					id: string;
					title: string;
					updated_at: string;
				};
				Insert: {
					author: string;
					created_at?: string;
					description?: string | null;
					entries: string[];
					id?: string;
					title: string;
					updated_at?: string;
				};
				Update: {
					author?: string;
					created_at?: string;
					description?: string | null;
					entries?: string[];
					id?: string;
					title?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'journals_author_fkey';
						columns: ['author'];
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}
