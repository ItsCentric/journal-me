<script lang="ts">
	import '../app.css';
	import { getFlash } from 'sveltekit-flash-message/client';
	import { page } from '$app/stores';
	import toast, { Toaster } from 'svelte-french-toast';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import UserButton from '$lib/components/UserButton.svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';

	export let data: PageData;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);
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

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe;
	});
</script>

<div class="h-full flex flex-col">
	<Toaster />
	<nav class="navbar border-b-neutral border-b">
		<div class="flex-1">
			<a href="/" class="text-xl">Journal Me</a>
		</div>
		<div class="flex gap-2 items-center">
			<ThemeSwitcher />
			<UserButton {session} />
		</div>
	</nav>
	<slot class="flex-1" />
</div>
