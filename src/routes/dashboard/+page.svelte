<script lang="ts">
	import { MoreVertical, Pencil, Plus, Trash } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import * as flashModule from 'sveltekit-flash-message/client';
	import { journalSchema } from '$lib/schemas';
	import type { Journal } from '../../database';
	import toast from 'svelte-french-toast';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import JournalModal from '$lib/components/JournalModal.svelte';
	import { flip } from 'svelte/animate';
	import { expoOut } from 'svelte/easing';
	import { page } from '$app/stores';

	export let data: PageData;
	const { journals: initialJournals, form: pageForm, supabase } = data;
	let journals = initialJournals;
	const flash = flashModule.getFlash(page);
	const form = superForm(pageForm, {
		flashMessage: {
			module: flashModule,
			onError: ({ result, message }) => {
				message.set({ type: 'error', message: result.error.message });
			}
		},
		onResult: ({ result }) => {
			if (result.type !== 'success') return;
			showJournalModal = false;
		},
		onSubmit: ({ formData }) => {
			if (journalModalMode === 'edit' && currentEditingJournal) {
				formData.set('journalId', currentEditingJournal.id);
			}
		},
		syncFlashMessage: false,
		validators: journalSchema,
		delayMs: 1000
	});
	const { delayed, errors } = form;
	let showJournalModal = false;
	let journalModalMode: 'create' | 'edit' = 'create';
	let dropdowns: HTMLDetailsElement[] | null[] = [];
	let currentEditingJournal: Journal | undefined;

	supabase
		.channel('custom-all-channel')
		.on('postgres_changes', { event: '*', schema: 'public', table: 'journals' }, (payload) => {
			if (payload.eventType === 'INSERT') {
				const newPayload = payload.new as Journal;
				journals = [...journals, newPayload];
			}
			if (payload.eventType === 'UPDATE') {
				const newPayload = payload.new as Journal;
				journals = journals.map((journal) => {
					if (journal.id === newPayload.id) {
						return newPayload;
					}
					return journal;
				});
				journals.sort(
					(journalA, journalB) => Date.parse(journalB.updated_at) - Date.parse(journalA.updated_at)
				);
			}
			if (payload.eventType === 'DELETE') {
				const newPayload = payload.old as Journal;
				journals = journals.filter((journal) => journal.id !== newPayload.id);
			}
		})
		.subscribe();

	onMount(() =>
		window.addEventListener('click', (event) => {
			dropdowns.forEach((dropdownElement) => {
				if (dropdownElement) {
					const node = event.target as Node;
					if (!dropdownElement.contains(node)) {
						dropdownElement.open = false;
					}
				}
			});
		})
	);

	$: if ($errors._errors) {
		toast.error($errors._errors[0]);
	}
</script>

<main class="container mx-auto py-8 flex flex-col gap-8">
	{#if $delayed}
		<div class="absolute w-full h-full bg-neutral/40 flex justify-center items-center">
			<span class="loading loading-spinner text-primary w-16" />
		</div>
	{/if}
	<div class="flex justify-between">
		<h1 class="text-4xl font-bold">Your Journals</h1>
		<div>
			<button
				class="btn"
				on:click={() => {
					journalModalMode = 'create';
					showJournalModal = true;
				}}
			>
				<Plus size={16} />
				<p>Create</p>
			</button>
		</div>
	</div>
	<div class="grid grid-cols-4 gap-4">
		<JournalModal
			mode={journalModalMode}
			open={showJournalModal}
			handleOnClose={() => {
				showJournalModal = false;
				currentEditingJournal = undefined;
			}}
			{currentEditingJournal}
			{form}
		/>
		{#if journals.length > 0}
			{#each journals as journal, i (journal.id)}
				<div
					class={`indicator w-full h-full ${journals.length > 1 ? '' : 'col-[1] row-[1]'}`}
					animate:flip={{ duration: 1000, easing: expoOut }}
					in:fade|global={{ delay: 250, duration: 500 }}
					out:fade|global={{ duration: 500 }}
				>
					<details class="dropdown indicator-item" bind:this={dropdowns[i]}>
						<summary class="btn btn-circle btn-sm border border-neutral z-10 no-animation">
							<MoreVertical size={16} />
						</summary>
						<ul class="menu dropdown-content z-10 p-1 shadow bg-base-300 rounded-box">
							<li>
								<button
									on:click={() => {
										journalModalMode = 'edit';
										currentEditingJournal = journal;
										showJournalModal = true;
									}}
								>
									<Pencil size={16} />
									<p>Edit</p>
								</button>
							</li>
							<li>
								<button
									on:click={async () => {
										const { error } = await supabase.from('journals').delete().eq('id', journal.id);
										if (error) $flash = { type: 'error', message: error.message };
									}}
								>
									<Trash size={16} />
									<p>Delete</p>
								</button>
							</li>
						</ul>
					</details>
					<button class="card border border-neutral hover:bg-neutral-focus w-full h-full">
						<div class="card-body max-w-full">
							<div class="flex justify-between">
								<h2 class="card-title">{journal.title}</h2>
							</div>
							{#if journal.description}
								<p class="truncate">{journal.description}</p>
							{/if}
						</div>
					</button>
				</div>
			{/each}
		{:else}
			<p
				in:fade={{ delay: 250, duration: 500 }}
				out:fade={{ duration: 500 }}
				class="col-[1] row-[1]"
			>
				You have no journals yet.
			</p>
		{/if}
	</div>
</main>
