<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import { signUpSchema } from '$lib/schemas';
	import FormTextInput from '$lib/components/FormTextInput.svelte';
	import * as flashModule from 'sveltekit-flash-message/client';
	import toast from 'svelte-french-toast';
	import FormPasswordInput from '$lib/components/FormPasswordInput.svelte';

	export let data: PageData;
	const { supabase } = data;
	const form = superForm(data.form, {
		flashMessage: {
			module: flashModule,
			onError: ({ result, message }) => {
				message.set({ type: 'error', message: result.error.message });
			}
		},
		syncFlashMessage: false,
		validators: signUpSchema,
		delayMs: 1000
	});
	const { enhance, delayed, errors, form: formStore } = form;
	async function handleGoogleSignUp(_event: Event) {
		await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				queryParams: {
					access_type: 'offline',
					prompt: 'consent'
				}
			}
		});
	}

	$: if ($errors._errors) {
		toast.error($errors._errors[0]);
	}
</script>

<main class="flex justify-center items-center h-full">
	{#if $delayed}
		<div class="absolute w-full h-full bg-neutral/40 flex justify-center items-center">
			<span class="loading loading-spinner text-primary w-16" />
		</div>
	{/if}
	<div class="max-w-3xl w-full">
		<div class="mb-8">
			<h1 class="text-5xl font-bold text-center">
				Welcome to <span class="text-primary">Journal Me</span>
			</h1>
			<h2 class="text-xl text-center text-base-content/50">
				Already have an account? <a href="/signIn" class="link text-accent">Sign in</a>.
			</h2>
		</div>
		<form id="sign-up-form" method="POST" action="?/credentialsSignUp" use:enhance>
			<FormTextInput {form} field="email" placeholder="johndoe@domain.com">
				<svelte:fragment slot="label">Email</svelte:fragment>
			</FormTextInput>
			<FormPasswordInput {form} field="password" placeholder="Password">
				<svelte:fragment slot="label">Password</svelte:fragment>
				<svelte:fragment slot="description">Must be at least 8 characters long</svelte:fragment>
			</FormPasswordInput>
		</form>
		<div class="divider">OR</div>
		<div class="flex justify-center">
			<button class="btn" on:click={handleGoogleSignUp}>
				<img
					src="https://cdn.simpleicons.org/google/black/white"
					alt="google icon"
					class="w-5 mr-1"
				/>
				<p>Sign up with Google</p>
			</button>
		</div>
		<div class="mt-6 flex flex-col gap-4">
			<div class="flex flex-col items-center">
				<div class="flex gap-2">
					<input
						name="termsAndPrivacy"
						type="checkbox"
						class="checkbox aria-[invalid]:checkbox-error"
						form="sign-up-form"
						bind:checked={$formStore.termsAndPrivacy}
						aria-invalid={$errors.termsAndPrivacy ? 'true' : undefined}
					/>
					<p class="text-center">
						By signing up, you agree to our <a href="/terms" class="link text-accent"
							>Terms of Service</a
						>
						and <a href="/privacy" class="link text-accent">Privacy Policy</a>.
					</p>
				</div>
				{#if $errors.termsAndPrivacy}
					<small class="text-error">{$errors.termsAndPrivacy}</small>
				{/if}
			</div>
			<button type="submit" class="btn btn-primary w-full" form="sign-up-form">Sign Up</button>
			<button on:click={() => history.back()} class="btn w-full mb-2">Back</button>
		</div>
	</div>
</main>
