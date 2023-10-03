<script lang="ts">
	import { pb } from '$lib/pocketbase';

	export let dialogRef: HTMLDialogElement | undefined;
	let isSigningUp = true;

	function handleModalTypeChange(_event: Event) {
		isSigningUp = !isSigningUp;
	}
</script>

<dialog class="modal" bind:this={dialogRef}>
	<div class="modal-box">
		<div class="mb-8">
			<h2 class="text-4xl font-bold text-center">
				Welcome to <span class="text-primary">Journal Me</span>
			</h2>
			{#if isSigningUp}
				<h3 class="text-lg text-center text-neutral-content">
					Already have an account? <span
						class="link text-accent"
						role="button"
						tabindex={0}
						on:click={handleModalTypeChange}
						on:keypress={handleModalTypeChange}>Sign in</span
					>.
				</h3>
			{:else}
				<h3 class="text-lg text-center text-neutral-content">
					Don't have an account? <span
						class="link text-accent"
						role="button"
						tabindex={0}
						on:click={handleModalTypeChange}
						on:keypress={handleModalTypeChange}>Sign up</span
					>.
				</h3>
			{/if}
		</div>
		<form>
			<div class="form-control">
				<label for="emailorusernamefield" class="label">
					<span class="label-text">Email or Username</span>
				</label>
				<input
					id="emailorusernamefield"
					type="text"
					placeholder="johndoe@domain.com"
					class="input input-bordered"
				/>
			</div>
			<div class="form-control">
				<label for="passwordfield" class="label">
					<span class="label-text">Password</span>
				</label>
				<input
					id="passwordfield"
					type="password"
					placeholder="Password"
					class="input input-bordered"
				/>
			</div>
		</form>
		<div class="divider">OR</div>
		<div class="w-full flex justify-center">
			<button
				class="btn mx-auto"
				on:click={() => pb.collection('users').authWithOAuth2({ provider: 'google' })}
			>
				{#if isSigningUp}
					<p>Sign up with Google</p>
				{:else}
					<p>Sign in with Google</p>
				{/if}
			</button>
		</div>
		<div class="modal-action">
			{#if isSigningUp}
				<button class="btn btn-primary">Sign Up</button>
			{:else}
				<button class="btn btn-primary">Sign In</button>
			{/if}
		</div>
	</div>
</dialog>
