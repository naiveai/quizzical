<script lang="ts">
	let { questionText, correctAnswer, incorrectOptions } = $props();

	function shuffle(arr: any[]) {
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	}

	let options = shuffle([correctAnswer, ...incorrectOptions]);
</script>

<div class="mb-4 w-full rounded bg-white px-8 pt-6 pb-8 shadow-xl">
	<h2 class="mb-4 text-2xl font-bold">{questionText}</h2>
	<div class="mb-4 grid grid-cols-2 gap-4">
		{#each options as option}
			<button class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
				{option}
			</button>
		{/each}
	</div>
</div>
