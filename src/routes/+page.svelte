<script lang="ts">
	import type { PageProps } from './$types';
	import Question from '$lib/components/Question.svelte';

	let { form }: PageProps = $props();
</script>

<form
	method="POST"
	action="?/generate"
	class="mt-20 flex w-full flex-col items-center justify-center px-4"
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
			<span class="icon-[material-symbols--send] text-2xl"></span>
		</button>
	</div>
</form>

{#if form?.quiz}
	<div class="fade-in m-auto mt-10 flex flex-col items-center justify-center md:w-1/2">
		{#each form.quiz as question}
			<Question {...question} />
		{/each}
	</div>
{/if}

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
