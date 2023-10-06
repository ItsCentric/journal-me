<script lang="ts">
	import type { PageData } from './$types';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import UserButton from '$lib/components/UserButton.svelte';

	export let data: PageData;
	const { user } = data;
</script>

<main class="flex flex-col h-full justify-center items-center">
	<div class="text-center mb-2">
		<h1 class="text-4xl font-bold">Welcome to SvelteKit</h1>
		<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
	</div>
	<div>
		<ThemeSwitcher />
		<UserButton {user} />
	</div>
</main>
