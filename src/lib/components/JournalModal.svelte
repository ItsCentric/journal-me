<script lang="ts">
	import type { journalSchema } from '$lib/schemas';
	import type { superForm } from 'sveltekit-superforms/client';
	import FormTextInput from '$lib/components/FormTextInput.svelte';
	import type { Journal } from '../../database';

	type JournalForm = ReturnType<typeof superForm<typeof journalSchema>>;

	export let mode: 'create' | 'edit' = 'create';
	export let open = false;
	export let form: JournalForm;
	export let handleOnClose: () => void;
	export let currentEditingJournal: Journal | undefined;

	let dialog: HTMLDialogElement | undefined;
	const { enhance, form: formStore } = form;

	$: if (open) {
		dialog?.showModal();
	} else {
		dialog?.close();
	}

	$: if (currentEditingJournal) {
		$formStore.title = currentEditingJournal.title;
		$formStore.description = currentEditingJournal.description ?? undefined;
	}
	$: isInitial =
		$formStore.title === currentEditingJournal?.title &&
		$formStore.description === currentEditingJournal?.description;
</script>

<dialog bind:this={dialog} class="modal" on:close={handleOnClose}>
	<div class="modal-box">
		{#if mode === 'edit'}
			<h3 class="font-bold text-lg">Edit Journal</h3>
			<p>Need to change something?</p>
		{:else}
			<h3 class="font-bold text-lg">Create Journal</h3>
			<p>Let's get you started with a new journal!</p>
		{/if}
		<form
			id="journal-create"
			method="POST"
			action={mode === 'create' ? '/dashboard?/journalCreate' : '/dashboard?/journalEdit'}
			use:enhance
		>
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
			<button type="submit" class="btn" form="journal-create" disabled={isInitial}>
				{mode === 'edit' ? 'Save' : 'Create'}
			</button>
			<form method="dialog">
				<button class="btn btn-error">Cancel</button>
			</form>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button class="cursor-default" />
	</form>
</dialog>
