<script>
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import UserButton from '$lib/components/UserButton.svelte';
</script>

<main class="flex flex-col h-full justify-center items-center">
	<div class="text-center mb-2">
		<h1 class="text-4xl font-bold">Welcome to SvelteKit</h1>
		<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
	</div>
	<div>
		<ThemeSwitcher />
		<UserButton />
	</div>
</main>
