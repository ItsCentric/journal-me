import { setError, superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { signInSchema } from '$lib/schemas';
import { fail, redirect } from '@sveltejs/kit';

export const load = (async () => {
	const form = await superValidate(signInSchema);

	return { form };
}) satisfies PageServerLoad;

export const actions = {
	credentialsSignIn: async (event) => {
		const { request, locals } = event;
		const form = await superValidate(request, signInSchema);

		if (!form.valid) return fail(400, { form });
		const { email, password } = form.data;
		const { error } = await locals.supabase.auth.signInWithPassword({ email, password });
		if (error?.status === 400) return setError(form, '', 'Invalid email or password');

		throw redirect(303, '/');
	}
};
