<script lang="ts">
	let { question, options } = $props();
</script>

<div class="mb-4 w-full rounded bg-white px-8 pt-6 pb-8 shadow-xl">
	<h2 class="mb-4 text-2xl font-bold">{question}</h2>
	<div class="mb-4 grid grid-cols-2 gap-4">
		{#each options as option}
			<button class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
				{option}
			</button>
		{/each}
	</div>
</div>
