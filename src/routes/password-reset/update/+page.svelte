<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import toast from 'svelte-french-toast';
	import { updatePasswordSchema } from '$lib/schemas';
	import FormPasswordInput from '$lib/components/FormPasswordInput.svelte';

	export let data: PageData;
	const form = superForm(data.form, {
		validators: updatePasswordSchema,
		delayMs: 1000
	});
	const { enhance, errors, delayed } = form;

	$: if ($errors._errors) {
		toast.error($errors._errors[0]);
	}
</script>

<main class="flex justify-center items-center h-full">
	{#if $delayed}
		<div class="absolute w-full h-full bg-neutral opacity-40 flex justify-center items-center">
			<span class="loading loading-spinner text-primary w-16" />
		</div>
	{/if}
	<div class="card card-bordered p-4 lg:basis-1/4">
		<div>
			<h1 class="card-title">Reset Password</h1>
			<h2 class="card-title opacity-60">Enter your new password below</h2>
		</div>
		<form id="reset-password" method="POST" use:enhance>
			<FormPasswordInput {form} field="newPassword">
				<svelte:fragment slot="label">New Password</svelte:fragment>
				<svelte:fragment slot="description">Must be at least 8 characters long</svelte:fragment>
			</FormPasswordInput>
			<FormPasswordInput {form} field="confirmPassword">
				<svelte:fragment slot="label">Confirm Password</svelte:fragment>
			</FormPasswordInput>
		</form>
		<div class="card-actions mt-4">
			<button class="btn w-full" form="reset-password">Reset Password</button>
		</div>
	</div>
</main>
