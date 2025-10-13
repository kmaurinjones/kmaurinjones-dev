<script lang="ts">
	import '../app.css';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
</svelte:head>

<div class="min-h-screen bg-base text-primary font-sans flex flex-col">
	<Nav />
	<main class="flex-1 max-w-6xl mx-auto px-6 py-8 lg:py-16">
		{@render children?.()}
	</main>
	<Footer />
</div>
