import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient<Database>;
			getSession: () => Promise<Session | null>;
		}
		interface PageData {
			flash?: { type: 'success' | 'error'; message: string };
			session: Session | null;
		}
		// interface Platform {}
	}
}

export {};
