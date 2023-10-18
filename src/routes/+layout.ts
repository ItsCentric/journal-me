import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';
import type { Database } from '../database';

export const load = async ({ fetch, data, depends }) => {
	depends('supabase:auth');
	const dataWithFlash = data as {
		session: (typeof data)['session'];
		flash: { type: string; message: string } | undefined;
	};

	const supabase = createSupabaseLoadClient<Database>({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event: { fetch },
		serverSession: data.session
	});

	const {
		data: { session }
	} = await supabase.auth.getSession();

	return { supabase, session, flash: dataWithFlash.flash };
};
