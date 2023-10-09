<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import { signInSchema } from '$lib/schemas';
	import FormTextInput from '$lib/components/FormTextInput.svelte';
	import { goto } from '$app/navigation';
	import * as flashModule from 'sveltekit-flash-message/client';
	import { siGoogle } from 'simple-icons';
	import toast from 'svelte-french-toast';

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
		validators: signInSchema,
		delayMs: 1000
	});
	const { enhance, delayed, errors } = form;
	async function handleGoogleSignIn(_event: Event) {
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
			<h1 class="text-5xl font-bold text-center">Welcome back!</h1>
			<h2 class="text-xl text-center text-neutral-content">
				Don't have an account? <a href="/signUp" class="link text-accent">Sign up</a>.
			</h2>
		</div>
		<form id="sign-in-form" method="POST" action="?/credentialsSignIn" use:enhance>
			<FormTextInput {form} field="email" placeholder="johndoe@domain.com">
				<svelte:fragment slot="label">Email</svelte:fragment>
			</FormTextInput>
			<FormTextInput {form} field="password" placeholder="Password" type="password">
				<svelte:fragment slot="label">Password</svelte:fragment>
			</FormTextInput>
		</form>
		<div class="divider">OR</div>
		<div class="flex justify-center">
			<button class="btn" on:click={handleGoogleSignIn}>
				<div class="w-4 mr-2 invert">
					{@html siGoogle.svg}
				</div>
				<p>Sign in with Google</p>
			</button>
		</div>
		<div>
			<button type="submit" class="btn btn-primary w-full mt-6" form="sign-in-form">Sign in</button>
		</div>
		<div class="text-center mt-2">
			<p>Forgot your password? <a href="/password-reset/email" class="link">No worries</a>.</p>
		</div>
	</div>
</main>
