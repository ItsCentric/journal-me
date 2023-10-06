<script lang="ts" context="module">
	import type { AnyZodObject } from 'zod';
	type T = AnyZodObject;
</script>

<script lang="ts" generics="T extends AnyZodObject">
	import type { z } from 'zod';
	import type { ZodValidation, FormPathLeaves } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';

	export let form: SuperForm<ZodValidation<T>, unknown>;
	export let field: FormPathLeaves<z.infer<T>>;

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
	<input
		name={field}
		type="text"
		bind:value={$value}
		aria-invalid={$errors ? 'true' : undefined}
		class="input input-bordered aria-[invalid]:input-error peer"
		{...$$restProps}
	/>
	<small class="peer-aria-[invalid]:block hidden text-error font-semibold mt-1">{$errors}</small>
</main>
