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
	<textarea
		name="source"
		placeholder="Enter the source text here..."
		class="rounded-lg border border-gray-300 p-4 text-lg focus:border-blue-500 focus:outline-none md:w-1/2"
		rows="10"
		required
	></textarea>

	<button
		class={[
			'mt-4 flex w-full items-center justify-center rounded-lg bg-blue-600 p-4 text-white transition-all hover:bg-blue-700 md:w-auto',
			questionsLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
		]}
		disabled={questionsLoading}
		aria-label="Generate Quiz"
	>
		<span
			class={[
				'text-2xl',
				!questionsLoading
					? 'icon-[material-symbols--send]'
					: 'icon-[simple-icons--openai] animate-spin'
			]}
		></span>
		<span class="ml-2 text-2xl">{!questionsLoading ? 'Generate Quiz' : 'Generating...'}</span>
	</button>
</form>

{#if !form?.error}
	<div class="m-auto mt-10 flex flex-col items-center justify-center md:w-1/2">
		{#if questionsLoading}
			{#each Array(3) as _}
				<Question loading />
			{/each}
		{:else}
			{#each form?.quiz as question, index}
				<Question key={index} {...question} />
			{/each}
		{/if}
	</div>
{:else}
	<div class="mt-10 text-center text-red-600">
		<span class="icon-[material-symbols--error] text-4xl"></span>
		<p class="mt-2">{form.error}</p>
	</div>
{/if}
