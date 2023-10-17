import { forgotPasswordSchema } from '$lib/schemas';
import { fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { setError, superValidate } from 'sveltekit-superforms/server';

export const load = async () => {
	const form = await superValidate(forgotPasswordSchema);

	return { form };
};

export const actions = {
	default: async (event) => {
		const { locals, request, url } = event;
		const form = await superValidate(request, forgotPasswordSchema);

		if (!form.valid) return fail(400, { form });
		const { email } = form.data;
		const { error: supabaseError } = await locals.supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${url.origin}/password-reset/callback?next=/password-reset/update`
		});
		if (supabaseError && supabaseError.status === 429) {
			return setError(form, '', 'You may only request once every minute');
		} else if (supabaseError && supabaseError.status !== 429) {
			return setError(
				form,
				'',
				'Something went wrong when sending your email, please try again in a few minutes'
			);
		}
		setFlash({ type: 'success', message: 'Password reset email sent! Check your email' }, event);

		return { form };
	}
};
