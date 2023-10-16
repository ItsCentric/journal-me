import { updatePasswordSchema } from '$lib/schemas';
import { fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { setError, superValidate } from 'sveltekit-superforms/server';

export const load = async (event) => {
	const session = await event.locals.getSession();
	if (!session)
		throw redirect(
			303,
			'/signUp',
			{ message: 'You must be signed in to reset your password', type: 'error' },
			event
		);
	const form = await superValidate(updatePasswordSchema);

	return { form };
};

export const actions = {
	default: async (event) => {
		const { locals, request } = event;
		const form = await superValidate(request, updatePasswordSchema);

		if (!form.valid) return fail(400, { form });

		const { newPassword } = form.data;
		const { error } = await locals.supabase.auth.updateUser({ password: newPassword });

		if (error && error.status !== 422) {
			return setError(
				form,
				'',
				'Something went wrong resetting your password, please try again in a few minutes'
			);
		} else if (error && error.status === 422) {
			return setError(form, '', error.message);
		}

		throw redirect('/', { message: 'Password reset successful!', type: 'success' }, event);
	}
};
