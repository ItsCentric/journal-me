import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, url }) => {
	const code = url.searchParams.get('code');

	if (!code) throw error(400, 'No code provided');
	await locals.supabase.auth.exchangeCodeForSession(code);

	const next = url.searchParams.get('next');

	if (!next) throw error(400, 'No next provided');

	throw redirect(303, next);
};
