<script lang="ts">
	import type { Session } from '@supabase/supabase-js';

	export let session: Session | null;
	let dropdown: HTMLDetailsElement | undefined;

	window.addEventListener('click', (event) => {
		const node = event.target as Node;
		if (dropdown && !dropdown.contains(node)) dropdown.open = false;
	});
</script>

<main>
	{#if session}
		<details class="dropdown dropdown-end" bind:this={dropdown}>
			<summary class="btn btn-ghost btn-circle">
				<img src="https://i.pravatar.cc/64" alt="avatar" class="w-16 avatar rounded-full" />
			</summary>
			<ul class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
				<li>
					<a href="/" class="btn-disabled">
						<p class="opacity-40">Profile</p>
						<span class="badge badge-neutral">Soon</span>
					</a>
				</li>
				<li>
					<a href="/" class="btn-disabled">
						<p class="opacity-40">Settings</p>
						<span class="badge badge-neutral">Soon</span>
					</a>
				</li>
				<li>
					<form method="POST" action="/signOut"><button type="submit">Sign out</button></form>
				</li>
			</ul>
		</details>
	{:else}
		<a href="/signIn" class="btn">Sign In</a>
	{/if}
</main>
