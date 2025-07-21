<script lang="ts">
	import { enhance } from '$app/forms';
	import Question from '$lib/components/Question.svelte';

	let { form } = $props();
	let questionsLoading = $state(false);
	let quizSubmitted = $state(false);

	let markedCorrect: boolean[] = $state([]);
	let numCorrect = $derived(markedCorrect.filter(Boolean).length);
	let percentCorrect = $derived(Math.round((numCorrect / (form?.quiz?.length || 1)) * 100));
</script>

<form
	method="POST"
	action="?/generateQuiz"
	class="mt-20 flex w-full flex-col items-center justify-center px-4"
	use:enhance={() => {
		quizSubmitted = false;
		questionsLoading = true;

		return async ({ update }) => {
			questionsLoading = false;
			markedCorrect = Array(form?.quiz.length).fill(false);
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
		<span class={['icon-[simple-icons--openai] text-2xl', { 'animate-spin': questionsLoading }]}
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
		{:else if form?.quiz}
			{#each form?.quiz as question, index}
				<Question
					showCorrectAnswer={quizSubmitted}
					disabled={quizSubmitted}
					key={index}
					bind:isCorrect={markedCorrect[index]}
					{...question}
				/>
			{/each}
			<div class="mt-6 flex w-full justify-center">
				<button
					class={[
						'mb-5 rounded-lg bg-green-600 px-6 py-3 text-white transition-all hover:bg-green-700',
						!quizSubmitted ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
					]}
					onclick={() => (quizSubmitted = true)}
					disabled={quizSubmitted}
				>
					<span class="text-xl">Submit Quiz</span>
				</button>
			</div>
		{/if}
	</div>
{:else}
	<div class="mt-10 text-center text-red-600">
		<span class="icon-[material-symbols--error] text-4xl"></span>
		<p class="mt-2">{form.error}</p>
	</div>
{/if}

{#if quizSubmitted}
	<div class="mt-10 flex flex-row items-center justify-center">
		<h2 class="mb-4 text-2xl font-bold">Your Score Is:</h2>
		<div class="relative m-10 h-40 w-40">
			<svg class="h-full w-full" viewBox="0 0 100 100">
				<!-- Background circle -->
				<circle
					class="stroke-current text-gray-200"
					stroke-width="10"
					cx="50"
					cy="50"
					r="40"
					fill="transparent"
				></circle>
				<!-- Progress circle -->
				<circle
					class={[
						'progress-ring__circle stroke-current',
						percentCorrect >= 80
							? 'text-green-500'
							: percentCorrect >= 50
								? 'text-yellow-500'
								: 'text-red-500'
					]}
					stroke-width="10"
					stroke-linecap="round"
					cx="50"
					cy="50"
					r="40"
					fill="transparent"
					stroke-dasharray="251.2"
					stroke-dashoffset="calc(251.2px - (251.2px * {percentCorrect}) / 100)"
				></circle>

				<text x="50" y="50" class="text-4xl" text-anchor="middle" dominant-baseline="middle">
					{percentCorrect}
				</text>
				<text
					x="50"
					y="70"
					class="text-sm opacity-25"
					text-anchor="middle"
					dominant-baseline="middle"
				>
					{numCorrect} / {form?.quiz?.length}
				</text>
			</svg>
		</div>
	</div>
{/if}

<style>
	.progress-ring__circle {
		transition: stroke-dashoffset 0.35s;
		transform: rotate(-90deg);
		transform-origin: 50% 50%;
	}
</style>
