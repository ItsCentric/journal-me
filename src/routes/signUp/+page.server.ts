import { signUpSchema } from '$lib/schemas.js';
import { error, fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import type { ClientResponseError } from 'pocketbase';
import { setError, superValidate } from 'sveltekit-superforms/server';
import handleOAuth from '$lib/handleOAuth.js';

export const load = async () => {
	const form = await superValidate(signUpSchema);

	return { form };
};

export const actions = {
	credentialsSignUp: async (event) => {
		const { request, locals } = event;
		const form = await superValidate(request, signUpSchema);

		if (!form.valid) return fail(400, { form });
		const { username, email, password } = form.data;
		try {
			await locals.pb
				.collection('users')
				.create({ username, email, password, passwordConfirm: password });
			await locals.pb.collection('users').authWithPassword(email, password);
			await locals.pb.collection('users').requestVerification(email);
		} catch (err) {
			const pbError = err as ClientResponseError;
			const { data: errors } = pbError;
			let alreadyExists = false;
			if (errors.data.email?.code === 'validation_invalid_email') {
				setError(form, 'email', 'Email already exists');
				alreadyExists = true;
			}
			if (errors.data.username?.code === 'validation_invalid_username') {
				setError(form, 'username', 'Username already exists');
				alreadyExists = true;
			}
			if (alreadyExists) return fail(pbError.status, { form });
			throw error(500, 'Something went wrong. Please try again later.');
		}

		throw redirect(
			'/',
			{ message: 'Sign up successful! Check your email to verify your account.', type: 'success' },
			event
		);
	},
	oauthSignUp: handleOAuth
};
