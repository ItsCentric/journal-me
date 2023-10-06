<script>
	import '../app.css';
	import { getFlash } from 'sveltekit-flash-message/client';
	import { page } from '$app/stores';
	import toast, { Toaster } from 'svelte-french-toast';

	const flash = getFlash(page);
	flash.subscribe(($flash) => {
		if (!$flash) return;

		if ($flash.type === 'success') {
			toast.success($flash.message);
		} else {
			toast.error($flash.message);
		}
		flash.set(undefined);
	});
</script>

<div class="h-full">
	<Toaster />
	<slot />
</div>
