<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit'

	export const load: Load = async ({ fetch }) => {
		const podcasts = await fetch('/podcasts.json').then((res) => res.json())
		return {
			props: {
				podcasts
			}
		}
	}
</script>

<script>
	import Clipboard from 'svelte-clipboard'

	export let podcasts

	let copied = false

	$: copied === true && setTimeout(() => (copied = false), 2000)

	let selected = ['32-thoughts', 'jeff-marek-show']

	$: link =
		(import.meta.env.DEV
			? 'http://localhost:3000/feed.xml?'
			: 'https://fgh.mattjennings.io/feed.xml?') + selected.sort().join('&')
</script>

<svelte:head>
	<title>Friedman's Greatest Hits</title>
</svelte:head>

<div class="max-w-7xl mx-auto p-4 sm:px-6 lg:px-8">
	<div class="flex flex-col items-center justify-center">
		<div class="overflow-hidden rounded-md h-48 w-48 shadow-md">
			<img class="object-cover h-full w-full" src="/fgh.jpeg" alt="the friedman" />
		</div>
		<h1 class="mt-4 text-3xl font-semibold text-gray-800 text-center">Friedman's Greatest Hits</h1>
		<p class="mt-2 text-xl text-gray-800 text-center">All Friedman, all the time</p>
		<p class="my-8 text-lg text-gray-500 max-w-md text-center">
			A curated feed of podcast episodes that Elliotte regularly appears on. Choose which podcasts
			you like and then add the link below to your podcaster.
		</p>

		<!-- link input -->
		<div class="w-full">
			<div class="mt-1 flex rounded-md shadow-sm">
				<Clipboard let:copy text={link} on:copy={() => (copied = true)}>
					<div class="relative flex items-stretch flex-grow focus-within:z-10">
						<input
							aria-label="RSS feed URL"
							type="text"
							readonly
							value={link}
							class="focus:ring-blue-500 focus:border-blue-500 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 text-gray-700"
							on:click={(ev) => {
								ev.currentTarget.select()
							}}
						/>
					</div>
					<button
						type="button"
						class="-ml-px w-20 relative space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
						class:copied
						on:click={() => copy()}
					>
						<span>{copied ? 'Copied!' : 'Copy'}</span>
					</button>
				</Clipboard>
			</div>
		</div>

		<div class="w-full mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each podcasts as podcast}
				{@const isSelected = selected.includes(podcast.slug)}
				<button
					class="flex items-stretch overflow-hidden text-left border border-gray-300 rounded-md transition-colors duration-100"
					class:selected={isSelected}
					aria-selected={isSelected}
					on:click={() => {
						if (isSelected) {
							selected = selected.filter((s) => s !== podcast.slug)
						} else {
							selected = [...selected, podcast.slug]
						}
					}}
				>
					<div class="w-16 flex-shrink-0">
						<img src={podcast.img} alt={podcast.title} />
					</div>
					<div class="px-2 py-1">
						<h2 class="font-medium">
							{podcast.title}
						</h2>
						<p class="text-gray-500">
							{#if podcast.weeklyOccurrence <= 0.25}
								Monthly
							{:else if podcast.weeklyOccurrence <= 0.4}
								Biweekly
							{:else if podcast.weeklyOccurrence <= 2}
								Weekly
							{:else}
								Daily
							{/if}
						</p>
					</div>
				</button>
			{/each}
		</div>
	</div>
</div>

<style>
	button.selected {
		@apply bg-blue-50 border-blue-200;
	}

	button.copied {
		@apply bg-green-200 border-green-300 text-green-800;
	}
</style>
