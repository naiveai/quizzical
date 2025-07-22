<script>
	let { numCorrect, total } = $props();
	let percentCorrect = $derived(Math.round((numCorrect / total) * 100));
</script>

<div class="flex flex-row items-center justify-center">
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
				{numCorrect} / {total}
			</text>
		</svg>
	</div>
</div>

<style>
	.progress-ring__circle {
		transition: stroke-dashoffset 0.35s;
		transform: rotate(-90deg);
		transform-origin: 50% 50%;
	}
</style>
