<script>
	export let title
	export let description
	export let image
</script>

<meta name="description" content={description} />
<meta name="author" content="Matt Jennings" />

<!-- Facebook Meta Tags -->
<meta property="og:url" content="https://fgh.mattjennings.io" />
<meta property="og:type" content="website" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={image} />

<!-- Twitter Meta Tags -->
<meta name="twitter:card" content="summary_large_image" />
<meta property="twitter:domain" content="fgh.mattjennings.io" />
<meta property="twitter:url" content="https://fgh.mattjennings.io" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={image} />
