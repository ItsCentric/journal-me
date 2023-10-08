<script lang="ts">
	import { page } from '$app/stores';

	const { session } = $page.data;
</script>

<main>
	{#if session}
		<form method="POST" action="/signOut">
			<button type="submit" class="btn">Sign Out</button>
		</form>
	{:else}
		<a href="/signUp" class="btn">Sign Up</a>
		<a href="/signIn" class="btn">Sign In</a>
	{/if}
</main>
