<script lang="ts">
  import { onMount } from 'svelte';
  import articles from '$lib/data/articles.json';

  let mounted = $state(false);
  let searchQuery = $state('');
  let sortBy = $state<'date' | 'title-asc' | 'title-desc'>('date');

  onMount(() => mounted = true);

  // Function to calculate search relevance score
  function calculateRelevance(article: any, query: string): number {
    if (!query) return 0;

    const lowerQuery = query.toLowerCase();
    const titleMatch = article.title.toLowerCase().includes(lowerQuery);

    // Check categories for matches
    const categoryMatch = article.categories?.some((cat: string) =>
      cat.toLowerCase().includes(lowerQuery)
    ) || false;

    // Weight title matches highest, then categories
    let score = 0;
    if (titleMatch) score += 10;
    if (categoryMatch) score += 5;

    // Count occurrences in title
    const titleOccurrences = (article.title.toLowerCase().match(new RegExp(lowerQuery, 'g')) || []).length;
    score += titleOccurrences * 2;

    return score;
  }

  // Derived state for filtered and sorted articles
  let filteredArticles = $derived.by(() => {
    let filtered = [...articles];

    // Apply search sorting by relevance (no filtering - always return all articles)
    if (searchQuery.trim()) {
      filtered = filtered
        .map(article => ({
          article,
          relevance: calculateRelevance(article, searchQuery)
        }))
        .sort((a, b) => b.relevance - a.relevance)
        .map(item => item.article);
    } else {
      // Apply sorting only when no search query
      if (sortBy === 'date') {
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      } else if (sortBy === 'title-asc') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortBy === 'title-desc') {
        filtered.sort((a, b) => b.title.localeCompare(a.title));
      }
    }

    return filtered;
  });
</script>

<svelte:head>
  <title>Thoughts | Kai Maurin-Jones</title>
  <meta name="description" content="Articles and writings by Kai Maurin-Jones on AI, machine learning, and data science" />
</svelte:head>

<div class="min-h-screen {mounted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700">
  <!-- Page header -->
  <header class="mb-8">
    <h1 class="text-4xl lg:text-5xl font-bold text-primary mb-4">
      Thoughts
    </h1>
    <p class="text-xl text-taupe leading-relaxed max-w-3xl mb-8">
      Writings on AI, machine learning, data science, and the intersection of technology and real-world applications.
    </p>

    <!-- RSS Feed Link -->
    <div class="mb-6">
      <a
        href="/thoughts/rss.xml"
        class="inline-flex items-center gap-2 text-terracotta hover:text-primary transition-colors font-medium"
        target="_blank"
        rel="noopener"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 3a1 1 0 000 2c5.523 0 10 4.477 10 10a1 1 0 102 0C17 8.373 11.627 3 5 3z"></path>
          <path d="M4 9a1 1 0 011-1 7 7 0 017 7 1 1 0 11-2 0 5 5 0 00-5-5 1 1 0 01-1-1zM3 15a2 2 0 114 0 2 2 0 01-4 0z"></path>
        </svg>
        Subscribe via RSS
      </a>
    </div>

    <!-- Search and sort controls -->
    <div class="flex flex-col sm:flex-row gap-4 mt-8">
      <!-- Search bar -->
      <div class="flex-1">
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search articles..."
          class="w-full px-4 py-3 rounded-lg border border-taupe/30 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-colors bg-base text-primary"
        />
      </div>

      <!-- Sort dropdown -->
      <div class="sm:w-56">
        <select
          bind:value={sortBy}
          disabled={searchQuery.trim().length > 0}
          class="w-full px-4 py-3 pr-10 rounded-lg border border-taupe/30 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-colors bg-base text-primary disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-[length:1.5em] bg-[position:right_0.5rem_center] bg-no-repeat"
          style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23a08060%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e');"
        >
          <option value="date">Sort by Date</option>
          <option value="title-asc">Sort A-Z</option>
          <option value="title-desc">Sort Z-A</option>
        </select>
      </div>
    </div>
  </header>

  <!-- Search results info -->
  {#if searchQuery.trim()}
    <div class="mb-6 text-taupe">
      Showing {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'} sorted by relevance to "{searchQuery}"
    </div>
  {/if}

  <!-- Articles grid -->
  {#if filteredArticles.length > 0}
    <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {#each filteredArticles as article}
        <article class="bg-base border border-taupe/20 rounded-lg p-6 hover:border-terracotta/40 transition-all hover:shadow-lg">
          <a href="/thoughts/{article.slug}" class="block">
            <h2 class="text-xl font-semibold text-primary mb-3 hover:text-terracotta transition-colors">
              {article.title}
            </h2>
            <time class="text-sm text-taupe/80" datetime={article.date}>
              {article.date}
            </time>
          </a>
        </article>
      {/each}
    </div>
  {:else}
    <div class="text-center py-16">
      <p class="text-taupe text-lg">No articles yet. Check back soon!</p>
    </div>
  {/if}
</div>
