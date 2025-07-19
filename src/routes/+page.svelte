<script>
	let questions = [
		{
			text: 'What is the capital of France?',
			options: ['Paris', 'London', 'Berlin', 'Madrid']
		},
		{
			text: 'What is the largest planet in our solar system?',
			options: ['Earth', 'Mars', 'Jupiter', 'Saturn']
		},
		{
			text: 'What is the boiling point of water?',
			options: ['100°C', '90°C', '80°C', '110°C']
		}
	];
</script>

<div class="mt-20 flex w-full flex-col items-center justify-center px-4">
	<div class="flex w-full max-w-3xl overflow-hidden rounded-full bg-white shadow-lg">
		<input
			type="text"
			placeholder="Enter your source URL"
			class="w-full px-6 py-4 text-xl text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
		/>
		<button
			class="flex items-center justify-center bg-blue-600 px-6 text-white transition-all hover:animate-pulse hover:bg-blue-700"
			onclick={() => {}}
			aria-label="Submit"
		>
			<span class="icon-[material-symbols--send] text-2xl"></span>
		</button>
	</div>
</div>

<div class="fade-in m-auto mt-10 flex flex-col items-center justify-center md:w-1/2">
	{#each questions as question}
		<div class="mb-4 w-full rounded bg-white px-8 pt-6 pb-8 shadow-xl">
			<h2 class="mb-4 text-2xl font-bold">{question.text}</h2>
			<div class="mb-4 grid grid-cols-2 gap-4">
				{#each question.options as option}
					<button class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
						{option}
					</button>
				{/each}
			</div>
		</div>
	{/each}
</div>

<style>
	.fade-in {
		animation: fadeIn 1.2s ease-in-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
