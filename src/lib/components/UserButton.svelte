<script lang="ts">
	import { page } from '$app/stores';
	import type { SupabaseClient } from '@supabase/supabase-js';

	export let supabaseClient: SupabaseClient;
	const { session } = $page.data;
	async function signOut(_event: Event) {
		await supabaseClient.auth.signOut();
		await supabaseClient.auth.refreshSession();
	}
</script>

<main>
	{#if session}
		<button on:click={signOut} class="btn">Sign Out</button>
	{:else}
		<a href="/signUp" class="btn">Sign Up</a>
		<a href="/signIn" class="btn">Sign In</a>
	{/if}
</main>
