import { redirect, setFlash } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { journalSchema } from '$lib/schemas';

export const load = (async (event) => {
	const { locals } = event;
	const session = await locals.getSession();
	if (!session) throw redirect(303, '/signIn');
	const form = superValidate(journalSchema);
	const { data: journalsData, error: journalsError } = await locals.supabase
		.from('journals')
		.select('*')
		.eq('author', session.user.id)
		.order('updated_at', { ascending: false });
	if (journalsError) {
		setFlash({ type: 'error', message: 'Something went wrong while getting your journals' }, event);
		fail(500);
	}
	if (!journalsData) return { journals: [], form };

	return { journals: journalsData, form };
}) satisfies PageServerLoad;

export const actions = {
	journalCreate: async (event) => {
		const { request, locals } = event;
		const { supabase, getSession } = locals;
		const session = await getSession();
		if (!session) throw redirect(303, '/signIn');
		const form = await superValidate(request, journalSchema);

		if (!form.valid) return fail(400, { form });
		const { title, description } = form.data;
		const { error } = await supabase
			.from('journals')
			.insert({ title, description, author: session.user.id, entries: [] });
		if (error) return setError(form, '', error.message);
	},
	journalEdit: async (event) => {
		const { request, locals } = event;
		const { supabase, getSession } = locals;
		const session = await getSession();
		if (!session) throw redirect(303, '/signIn');
		const formData = await request.formData();
		const form = await superValidate(formData, journalSchema);
		const journalId = formData.get('journalId');

		if (!journalId) return fail(400, { form });
		if (!form.valid) return fail(400, { form });

		const { title, description } = form.data;
		const { error } = await supabase
			.from('journals')
			.update({ title, description })
			.eq('id', journalId);
		if (error) return setError(form, '', error.message);
	}
};
