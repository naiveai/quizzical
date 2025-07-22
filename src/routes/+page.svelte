<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import Question from '$lib/components/Question.svelte';
	import ScoreReport from '$lib/components/ScoreReport.svelte';
	import { scrollTo, scrollRef } from 'svelte-scrolling';

	let { form } = $props();
	let source = $state('');
	let questionsLoading = $state(false);
	let quizSubmitted = $state(false);

	let markedCorrect: boolean[] = $state([]);

	const title = 'Quizzical';
	const description = 'Generate quizzes to test your knowledge on a source text with AI.';
</script>

<title>{title}</title>
<meta name="description" content={description} />

<h1
	class="mt-10 mb-4 text-center text-7xl font-bold text-blue-600 md:text-8xl lg:text-9xl"
	aria-label={title}
	style="font-family: 'Poppins', sans-serif;"
>
	{title}
</h1>
<p class="text-center text-2xl text-gray-700">{description}</p>
<p class="mx-auto mt-4 p-4 text-center text-sm text-gray-500 md:w-1/2">
	<b>DISCLAIMER:</b> Quizzical is primarily intended as a proof of concept. AI-generated quizzes are
	not guaranteed to be accurate or reliable. No claims are made about the quality or pedagogical value
	of the quizzes generated.
</p>

<form
	method="POST"
	action="?/generateQuiz"
	class="mt-5 flex w-full flex-col items-center justify-center px-4"
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
		placeholder="Enter the text you want to be quizzed on, the greater the length the better!"
		class="rounded-lg border border-gray-300 p-4 text-lg focus:border-blue-500 focus:outline-none md:w-1/2"
		rows="10"
		maxlength="10000"
		bind:value={source}
		required
	></textarea>

	<div class="mt-2 text-sm text-gray-500">
		<span class="char-count">{source.length}</span> / 10000 characters
	</div>

	<button
		class={[
			'mt-4 flex w-full items-center justify-center rounded-lg bg-blue-600 p-4 text-white shadow-xl transition-all hover:bg-blue-700 md:w-auto',
			questionsLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
		]}
		disabled={questionsLoading}
		use:scrollTo={{ ref: 'questions', passive: true }}
	>
		<span class={['icon-[simple-icons--openai] text-2xl', { 'animate-spin': questionsLoading }]}
		></span>
		<span class="ml-2 text-2xl">{!questionsLoading ? 'Generate Quiz' : 'Generating...'}</span>
	</button>
</form>

<section
	aria-label="Questions"
	class="m-10 m-auto flex flex-col items-center justify-center md:w-1/2"
	use:scrollRef={'questions'}
>
	{#if !form?.error}
		{#if questionsLoading}
			<div out:fade|global class="w-full">
				{#each Array(3) as _}
					<Question loading />
				{/each}
			</div>
		{:else if form?.quiz}
			<div in:fade|global class="w-full">
				{#each form?.quiz as question, index}
					<Question
						showCorrectAnswer={quizSubmitted}
						disabled={quizSubmitted}
						key={index}
						bind:isCorrect={markedCorrect[index]}
						{...question}
					/>
				{/each}
			</div>
			<div class="mt-6 flex w-full justify-center">
				<button
					class={[
						'mb-5 rounded-lg bg-green-600 px-6 py-3 text-white shadow-lg transition-all hover:bg-green-700',
						!quizSubmitted ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
					]}
					onclick={() => (quizSubmitted = true)}
					use:scrollTo={{ ref: 'scoreReport' }}
					disabled={quizSubmitted}
				>
					<span class="text-xl">Submit Quiz</span>
				</button>
			</div>
		{/if}
	{:else}
		<div class="mt-10 text-center text-red-600">
			<span class="icon-[material-symbols--error] text-4xl"></span>
			<p class="mt-2">{form.error}</p>
		</div>
	{/if}
</section>

<section aria-label="Score Report" class="mt-10" use:scrollRef={'scoreReport'}>
	{#if quizSubmitted}
		<ScoreReport numCorrect={markedCorrect.filter(Boolean).length} total={form?.quiz?.length} />
	{/if}
</section>
