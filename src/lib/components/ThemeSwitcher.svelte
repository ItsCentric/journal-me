<script>
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	import { Sun, Moon } from 'lucide-svelte';

	onMount(() => {
		themeChange(false);
	});
</script>

<main>
	<label class="swap swap-rotate">
		<input type="checkbox" data-toggle-theme="dracula,light" data-act-class="ACTIVECLASS" />
		<Sun size={32} class="swap-off" />
		<Moon size={32} class="swap-on" />
	</label>
</main>
