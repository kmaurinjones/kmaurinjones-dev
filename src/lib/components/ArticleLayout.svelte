<script lang="ts">
  import { onMount } from 'svelte';

  let {
    title,
    date,
    categories = [],
    children
  }: {
    title: string;
    date: string;
    categories?: string[];
    children: any;
  } = $props();

  let mounted = $state(false);
  onMount(() => mounted = true);
</script>

<svelte:head>
  <title>{title} | Kai Maurin-Jones</title>
  <meta name="description" content="{title} - Read on Kai Maurin-Jones' blog" />
</svelte:head>

<div class="min-h-screen {mounted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700">
  <article class="max-w-4xl mx-auto px-4 sm:px-6 w-full">
    <!-- Back link -->
    <a href="/thoughts" class="inline-flex items-center text-taupe hover:text-terracotta transition-colors mb-8">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
      </svg>
      Back to Thoughts
    </a>

    <!-- Article header -->
    <header class="mb-12">
      <h1 class="text-3xl lg:text-4xl font-bold text-primary mb-4 break-words">
        {title}
      </h1>
      <div class="flex flex-wrap items-center gap-4 text-taupe">
        <time datetime="{date}">{date}</time>
        {#if categories.length > 0}
          <span class="text-taupe/40">•</span>
          <div class="flex flex-wrap gap-2">
            {#each categories as category}
              <span class="px-3 py-1 bg-caramel/10 text-taupe text-sm rounded-full">
                {category}
              </span>
            {/each}
          </div>
        {/if}
      </div>
    </header>

    <!-- Article content -->
    <div class="prose prose-lg max-w-none mb-12 w-full
                [&_*]:max-w-full [&_*]:box-border
                [&_img]:max-w-full [&_img]:h-auto
                [&_picture]:max-w-full [&_picture]:block
                [&_figure]:max-w-full [&_figure]:mx-0
                [&_div]:max-w-full
                [&_section]:max-w-full
                [&_article]:max-w-full
                prose-headings:text-primary prose-headings:font-bold prose-headings:break-words
                prose-p:text-taupe prose-p:leading-relaxed prose-p:mb-4 prose-p:break-words
                prose-a:text-terracotta prose-a:no-underline prose-a:break-words hover:prose-a:underline
                prose-strong:text-primary prose-strong:font-semibold
                prose-em:text-taupe prose-em:italic
                prose-code:text-primary prose-code:bg-caramel/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:break-words
                prose-pre:bg-primary/5 prose-pre:border prose-pre:border-taupe/20 prose-pre:overflow-x-auto prose-pre:max-w-full
                prose-blockquote:border-l-4 prose-blockquote:border-terracotta prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:my-6
                prose-ul:text-taupe prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
                prose-ol:text-taupe prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
                prose-li:text-taupe prose-li:my-2 prose-li:break-words
                prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8 prose-img:max-w-full prose-img:h-auto
                prose-h1:mb-4 prose-h1:mt-8
                prose-h2:mb-4 prose-h2:mt-8
                prose-h3:mb-3 prose-h3:mt-6
                prose-h4:mb-2 prose-h4:mt-4
                ">
      {@render children()}
    </div>
  </article>
</div>
