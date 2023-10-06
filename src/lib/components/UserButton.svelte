<script lang="ts">
	export let user: App.Locals['user'];
</script>

<main>
	{#if user}
		<a href="/signOut" class="btn">Sign Out</a>
	{:else}
		<a href="/signUp" class="btn">Sign Up</a>
		<a href="/signIn" class="btn">Sign In</a>
	{/if}
</main>
