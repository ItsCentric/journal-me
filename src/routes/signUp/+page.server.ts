export const ssr = false;
import { signUpSchema } from '$lib/schemas.js';
import { fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { setError, superValidate } from 'sveltekit-superforms/server';

export const load = async () => {
	const form = await superValidate(signUpSchema);

	return { form };
};

export const actions = {
	credentialsSignUp: async (event) => {
		const { request, locals, url } = event;
		const { supabase } = locals;
		const form = await superValidate(request, signUpSchema);

		if (!form.valid) return fail(400, { form });
		const { email, password } = form.data;
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: { emailRedirectTo: `${url.origin}/auth/callback` }
		});
		if ((data.user?.identities?.length ?? 0) === 0)
			return setError(form, 'email', 'An account with that email already exists.');

		if (error) return setError(form, '', error.message);
		if (!data.user) return setError(form, '', 'Something went wrong.');

		throw redirect(
			'/',
			{ message: 'Sign up successful! Check your email to verify your account.', type: 'success' },
			event
		);
	}
};
