<script lang="ts">
	import { enhance } from '$app/forms';
	import Question from '$lib/components/Question.svelte';

	let { form } = $props();
	let questionsLoading = $state(false);
</script>

<form
	method="POST"
	action="?/generateQuiz"
	class="mt-20 flex w-full flex-col items-center justify-center px-4"
	use:enhance={() => {
		questionsLoading = true;

		return async ({ update }) => {
			questionsLoading = false;
			update();
		};
	}}
>
	<div class="flex w-full max-w-3xl overflow-hidden rounded-full bg-white shadow-lg">
		<input
			type="text"
			name="source"
			placeholder="Enter your source"
			class="w-full px-6 py-4 text-xl text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
		/>
		<button
			class="flex items-center justify-center bg-blue-600 px-6 text-white transition-all hover:bg-blue-700"
			aria-label="Submit"
		>
			{#if !questionsLoading}
				<span class="icon-[material-symbols--send] text-2xl"></span>
			{:else}
				<span class="icon-[simple-icons--openai] animate-spin text-2xl"></span>
			{/if}
		</button>
	</div>
</form>

{#if !form?.error}
	<div class="m-auto mt-10 flex flex-col items-center justify-center md:w-1/2">
		{#if questionsLoading}
			{#each Array(3) as _}
				<Question loading />
			{/each}
		{:else}
			{#each form?.quiz as question}
				<Question {...question} />
			{/each}
		{/if}
	</div>
{:else}
	<div class="mt-10 text-center text-red-600">
		<span class="icon-[material-symbols--error] text-4xl"></span>
		<p class="mt-2">{form.error}</p>
	</div>
{/if}
