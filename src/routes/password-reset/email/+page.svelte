<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import toast from 'svelte-french-toast';
	import FormTextInput from '$lib/components/FormTextInput.svelte';
	import { Lock } from 'lucide-svelte';
	import { forgotPasswordSchema } from '$lib/schemas';

	export let data: PageData;
	const form = superForm(data.form, {
		validators: forgotPasswordSchema,
		delayMs: 1000
	});
	const { enhance, errors, delayed, posted } = form;
	let canSendNextEmailIn = 60;
	let canSendNextEmail = true;
	let interval: NodeJS.Timeout;

	$: if ($errors._errors) {
		toast.error($errors._errors[0]);
	}
	$: if (canSendNextEmail) {
		interval = setInterval(() => {
			if (canSendNextEmail) return;
			canSendNextEmailIn--;

			if (canSendNextEmailIn === 0) {
				clearInterval(interval);
				canSendNextEmailIn = 60;
				canSendNextEmail = true;
			}
		}, 1000);
	}
</script>

<main class="flex flex-col justify-center items-center h-full">
	{#if $delayed}
		<div class="absolute w-full h-full bg-neutral opacity-40 flex justify-center items-center">
			<span class="loading loading-spinner text-primary w-16" />
		</div>
	{/if}
	<div class="card card-bordered p-4">
		<Lock size={48} class="mb-2" />
		<div>
			<h1 class="card-title">Let's reset your password</h1>
			<h2 class="card-title opacity-60">
				Enter your email address and we'll send you a link to reset your password
			</h2>
		</div>
		<form
			method="POST"
			on:submit={() => (canSendNextEmail = false)}
			use:enhance
			class="flex flex-col gap-2"
		>
			<FormTextInput {form} field="email" placeholder="johndoe@domain.com" />
			<button class="btn w-full" disabled={!canSendNextEmail}>Send email</button>
			<button on:click={() => history.back()} type="button" class="btn w-full">Back</button>
		</form>
		{#if $posted && !canSendNextEmail}
			<small>You may request again in {canSendNextEmailIn} seconds.</small>
		{/if}
	</div>
</main>
