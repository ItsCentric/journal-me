<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import { signUpSchema } from '$lib/schemas';
	import FormTextInput from '$lib/components/FormTextInput.svelte';
	import { goto } from '$app/navigation';
	import * as flashModule from 'sveltekit-flash-message/client';
	import { siGoogle } from 'simple-icons';

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
	const { enhance, delayed } = form;
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
			<h2 class="text-xl text-center text-neutral-content">
				Already have an account? <a href="/signIn" class="link text-accent">Sign in</a>.
			</h2>
		</div>
		<form id="sign-up-form" method="POST" action="?/credentialsSignUp" use:enhance>
			<FormTextInput {form} field="email" placeholder="johndoe@domain.com">
				<svelte:fragment slot="label">Email</svelte:fragment>
			</FormTextInput>
			<FormTextInput {form} field="password" placeholder="Password" type="password">
				<svelte:fragment slot="label">Password</svelte:fragment>
				<svelte:fragment slot="description">Must be at least 8 characters long</svelte:fragment>
			</FormTextInput>
		</form>
		<div class="divider">OR</div>
		<div class="flex justify-center">
			<button class="btn" on:click={handleGoogleSignUp}>
				<div class="w-4 mr-2 invert">
					{@html siGoogle.svg}
				</div>
				<p>Sign up with Google</p>
			</button>
		</div>
		<div>
			<button type="submit" class="btn btn-primary w-full mt-6" form="sign-up-form">Sign Up</button>
		</div>
	</div>
</main>
