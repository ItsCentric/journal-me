<script lang="ts">
	import { Plus } from 'lucide-svelte';
	import type { PageData } from './$types';
	import FormTextInput from '$lib/components/FormTextInput.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import * as flashModule from 'sveltekit-flash-message/client';
	import { createJournalSchema } from '$lib/schemas';
	import type { Database } from '../../database';
	import toast from 'svelte-french-toast';
	import { fade } from 'svelte/transition';

	export let data: PageData;
	const { journals: initialJournals, form: pageForm, supabase } = data;
	let journals = initialJournals;
	const form = superForm(pageForm, {
		flashMessage: {
			module: flashModule,
			onError: ({ result, message }) => {
				message.set({ type: 'error', message: result.error.message });
			}
		},
		onResult: ({ result }) => {
			if (result.type !== 'success') return;
			createJournalModal?.close();
		},
		syncFlashMessage: false,
		validators: createJournalSchema,
		delayMs: 1000
	});
	const { enhance, delayed, errors, form: formStore } = form;
	let createJournalModal: HTMLDialogElement | undefined;

	supabase
		.channel('custom-all-channel')
		.on('postgres_changes', { event: '*', schema: 'public', table: 'journals' }, (payload) => {
			if (payload.eventType === 'INSERT') {
				const newPayload = payload.new as Database['public']['Tables']['journals']['Row'];
				journals = [...journals, newPayload];
			}
		})
		.subscribe();

	$: if ($errors._errors) {
		toast.error($errors._errors[0]);
	}
</script>

<main class="container mx-auto py-8 flex flex-col gap-4">
	{#if $delayed}
		<div class="absolute w-full h-full bg-neutral/40 flex justify-center items-center">
			<span class="loading loading-spinner text-primary w-16" />
		</div>
	{/if}
	<dialog bind:this={createJournalModal} class="modal">
		<div class="modal-box">
			<h3 class="font-bold text-lg">Create Journal</h3>
			<p>Let's get you started with a new journal!</p>
			<form id="journal-create" method="POST" action="?/journalCreate" use:enhance>
				<FormTextInput {form} field="title" placeholder="My Awesome Journal">
					<svelte:fragment slot="label">Title</svelte:fragment>
				</FormTextInput>
				<FormTextInput
					{form}
					field="description"
					placeholder="This journal is just so amazingly awesome"
				>
					<svelte:fragment slot="label">Description</svelte:fragment>
					<svelte:fragment slot="description">Must be 50 characters or less</svelte:fragment>
				</FormTextInput>
				<p class="text-sm mt-1">Character count: {$formStore.description?.length ?? 0}</p>
			</form>
			<div class="modal-action">
				<button type="submit" class="btn" form="journal-create">Create</button>
				<form method="dialog">
					<button class="btn btn-error">Cancel</button>
				</form>
			</div>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button class="cursor-default" />
		</form>
	</dialog>
	<div class="flex justify-between">
		<h1 class="text-3xl font-bold">Your Journals</h1>
		<div>
			<button class="btn" on:click={() => createJournalModal?.showModal()}>
				<Plus size={16} />
				<p>Create</p>
			</button>
		</div>
	</div>
	<div class="grid grid-cols-4 gap-4">
		{#if journals.length > 0}
			{#each journals as journal (journal.id)}
				<button class="card border border-neutral hover:bg-neutral-focus" transition:fade>
					<div class="card-body max-w-full">
						<h2 class="card-title">{journal.title}</h2>
						{#if journal.description}
							<p class="truncate">{journal.description}</p>
						{/if}
					</div>
				</button>
			{/each}
		{:else}
			<p>You have no journals yet.</p>
		{/if}
	</div>
</main>
