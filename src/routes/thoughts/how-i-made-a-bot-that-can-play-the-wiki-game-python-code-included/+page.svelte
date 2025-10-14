<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let mounted = $state(false);
  let redirecting = $state(false);

  const article = {
    title: "I Made a Bot that Can Play the Wiki Game (Python code included!)",
    date: "January 18, 2024",
    categories: ["data-science", "transformers", "wikipedia", "ai", "nlp"],
    mediumUrl: "https://medium.com/@kmaurinjones/how-i-made-a-bot-that-can-play-the-wiki-game-python-code-included-5d207254cf33?source=rss-f832d23db031------2"
  };

  onMount(() => {
    mounted = true;
  });

  function handleReadArticle() {
    redirecting = true;
    window.open(article.mediumUrl, '_blank');
  }
</script>

<svelte:head>
  <title>{article.title} | Kai Maurin-Jones</title>
  <meta name="description" content="{article.title} - Read on Kai Maurin-Jones' blog" />
</svelte:head>

<div class="min-h-screen {mounted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700">
  <article class="max-w-4xl mx-auto px-4 py-12 w-full">
    <!-- Back link -->
    <a href="/thoughts" class="inline-flex items-center text-taupe hover:text-terracotta transition-colors mb-8">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
      </svg>
      Back to Thoughts
    </a>

    <!-- Article header -->
    <header class="mb-12">
      <h1 class="text-3xl lg:text-4xl font-bold text-primary mb-4">
        {article.title}
      </h1>
      <div class="flex flex-wrap items-center gap-4 text-taupe mb-8">
        <time datetime="{article.date}">{article.date}</time>
        {#if article.categories.length > 0}
          <span class="text-taupe/40">•</span>
          <div class="flex flex-wrap gap-2">
            {#each article.categories as category}
              <span class="px-3 py-1 bg-caramel/10 text-taupe text-sm rounded-full">
                {category}
              </span>
            {/each}
          </div>
        {/if}
      </div>
    </header>

    <!-- Article preview card -->
    <div class="bg-base border-2 border-taupe/20 rounded-lg p-8 mb-8">
      <div class="flex items-start gap-4 mb-6">
        <svg class="w-12 h-12 text-taupe flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"></path>
        </svg>
        <div>
          <h2 class="text-xl font-semibold text-primary mb-2">This article is hosted on Medium</h2>
          <p class="text-taupe leading-relaxed">
            Click the button below to read the full article. If you're unable to access it due to Medium's paywall, the link provided uses a friend link that allows free access.
          </p>
        </div>
      </div>

      <button
        onclick={handleReadArticle}
        class="w-full bg-terracotta hover:bg-terracotta/90 text-base font-medium py-4 px-6 rounded-lg transition-colors inline-flex items-center justify-center gap-3 group"
      >
        <span>Read Full Article on Medium</span>
        <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
        </svg>
      </button>
    </div>

    <!-- Why Medium note -->
    <div class="text-center text-taupe/70 text-sm">
      <p>Articles are published on Medium to reach a wider audience and support the writing platform.</p>
    </div>
  </article>
</div>
