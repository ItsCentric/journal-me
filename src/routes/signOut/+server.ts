import { redirect } from 'sveltekit-flash-message/server';
import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';

export const POST: RequestHandler = async (event) => {
	const { locals } = event;
	const session = await locals.getSession();
	if (!session)
		throw redirect('/signIn', { type: 'error', message: 'You are not logged in' }, event);
	const { error: supabaseError } = await locals.supabase.auth.signOut();
	if (supabaseError) throw error(supabaseError.status ?? 500, supabaseError.message);
	throw redirect(303, '/');
};
