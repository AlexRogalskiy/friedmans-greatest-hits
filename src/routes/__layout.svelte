<script>
	import '../app.css'
</script>

<div class="h-screen flex flex-col">
	<main class="flex-1">
		<slot />
	</main>

	<footer class="pt-8 pb-4 text-xs text-center font-medium">
		<a
			href="https://mattjennings.io"
			rel="external"
			class="bg-slate-200 text-slate-800 px-3 py-1 rounded-full">Made by Matt Jennings</a
		>
	</footer>
</div>
