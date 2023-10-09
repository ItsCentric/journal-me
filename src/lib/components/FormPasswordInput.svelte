<script lang="ts" context="module">
	import type { AnyZodObject } from 'zod';
	type T = AnyZodObject;
</script>

<script lang="ts" generics="T extends AnyZodObject">
	import { Eye } from 'lucide-svelte';

	import type { z } from 'zod';
	import type { ZodValidation, FormPathLeaves } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';

	export let form: SuperForm<ZodValidation<T>, unknown>;
	export let field: FormPathLeaves<z.infer<T>>;
	let showPassword = false;

	const { value, errors } = formFieldProxy(form, field);
</script>

<main class="form-control">
	<label for={field} class="label">
		<span class="label-text">
			<slot name="label" />
		</span>
		<span class="label-text-alt">
			<slot name="description" />
		</span>
	</label>
	<div class="relative">
		{#if showPassword}
			<input
				name={field}
				id="password"
				type="text"
				bind:value={$value}
				aria-invalid={$errors ? 'true' : undefined}
				spellcheck="false"
				class="input input-bordered aria-[invalid]:input-error peer w-full"
				{...$$restProps}
			/>
		{:else}
			<input
				name={field}
				id="password"
				type="password"
				bind:value={$value}
				aria-invalid={$errors ? 'true' : undefined}
				spellcheck="false"
				class="input input-bordered aria-[invalid]:input-error peer w-full"
				{...$$restProps}
			/>
		{/if}
		<button
			type="button"
			on:click={() => (showPassword = !showPassword)}
			aria-expanded={showPassword}
			aria-controls="password"
			class="absolute right-2 top-1/2 p-1 rounded-full -translate-y-1/2 inline hover:bg-neutral/10"
		>
			<Eye size={24} />
		</button>
	</div>
	{#if $errors}
		<small class="text-error font-semibold mt-1">{$errors}</small>
	{/if}
</main>
