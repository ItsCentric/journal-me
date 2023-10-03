<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import SignInModal from './SignInModal.svelte';

	$: isSignedIn = pb.authStore.isValid;
	let dialogRef: HTMLDialogElement | undefined;
</script>

<main>
	<SignInModal bind:dialogRef />
	{#if isSignedIn}
		<button class="btn" on:click={() => pb.authStore.clear()}>Sign Out</button>
	{:else}
		<button class="btn" on:click={() => dialogRef?.showModal()}>Sign Up</button>
	{/if}
</main>
