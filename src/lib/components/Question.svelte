<script lang="ts">
	let {
		loading,
		disabled = false,
		key = '',
		questionText = '',
		correctAnswer = '',
		incorrectOptions = [],
		isCorrect = $bindable(),
		showCorrectAnswer = false
	} = $props();

	function shuffle(arr: any[]) {
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	}

	let options = shuffle([correctAnswer, ...incorrectOptions]);
	let selectedAnswer = $state('');

	$effect(() => {
		isCorrect = selectedAnswer === correctAnswer;
	});
</script>

{#if !loading}
	<div class="mb-4 w-full rounded bg-white px-8 pt-6 pb-8 shadow-xl">
		<h2 class="mb-4 text-2xl font-bold">{questionText}</h2>
		<div class="mb-4 grid grid-cols-2 gap-4">
			{#each options as option}
				<div class="flex items-start gap-3">
					<input
						type="radio"
						name="answer-{key}"
						value={option}
						id={option}
						{disabled}
						bind:group={selectedAnswer}
						class="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
					/>
					<label
						for={option}
						class="cursor-pointer pl-2 text-lg leading-snug text-gray-800 select-none"
					>
						{option}
						{#if showCorrectAnswer}
							<span
								class={[
									'text-xl inline-block align-middle leading-none',
									option === correctAnswer
										? 'icon-[material-symbols--check-circle] text-green-500'
										: option === selectedAnswer
											? 'icon-[material-symbols--cancel] text-red-500'
											: ''
								]}
							></span>
						{/if}
					</label>
				</div>
			{/each}
		</div>
	</div>
{:else}
	<div class="mt-10 w-full max-w-3xl animate-pulse rounded-lg bg-white p-6 shadow-lg">
		<div class="mb-4 h-10 w-full bg-gray-200"></div>
		<div class="mb-4 grid grid-cols-2 gap-4">
			{#each Array(4) as _}
				<div class="flex items-center space-x-2">
					<div class="h-6 w-6 bg-gray-200"></div>
					<div class="h-6 w-3/4 bg-gray-200"></div>
				</div>
			{/each}
		</div>
	</div>
{/if}
