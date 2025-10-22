<script lang="ts">
  import { onMount } from 'svelte';

  let mounted = $state(false);
  onMount(() => mounted = true);

  const changelog = [
    {
      version: '0.3.2',
      date: 'October 21, 2025',
      changes: [
        {
          category: 'Features',
          items: [
            'New Projects page showcasing live applications with search and sort',
            'Added NYT Connections Clone, Wordle Recreation, and Ontario Building Code RAG projects',
            'New article: "Recreating NYT Connections: When Four Guesses Just Isn\'t Enough"'
          ]
        }
      ]
    },
    {
      version: '0.3.1',
      date: 'October 21, 2025',
      changes: [
        {
          category: 'Performance',
          items: [
            'Converted article images to WebP format (93% average size reduction)',
            'Optimized page load times with modern image formats'
          ]
        },
        {
          category: 'Accessibility',
          items: [
            'Added descriptive aria-labels to contact page buttons',
            'Improved link affordance with visible underlines',
            'Enhanced external link security with rel="noopener noreferrer"'
          ]
        },
        {
          category: 'SEO',
          items: [
            'Added Open Graph meta tags for better social sharing',
            'Implemented Twitter Card support'
          ]
        }
      ]
    },
    {
      version: '0.3.0',
      date: 'October 17, 2025',
      changes: [
        {
          category: 'Content',
          items: [
            'New article: "Recreating NYT Connections: When Four Guesses Just Isn\'t Enough"',
            'New article: "Recreating Wordle with AI Assistance: A One-Day Build"'
          ]
        },
        {
          category: 'Mobile Experience',
          items: [
            'Fixed mobile layout issues where article content extended beyond viewport',
            'Improved responsive behavior across all article pages'
          ]
        }
      ]
    },
    {
      version: '0.2.0',
      date: 'October 13, 2025',
      changes: [
        {
          category: 'Features',
          items: [
            'New Thoughts section with article listing',
            'Search and sort functionality for articles',
            'Mobile responsive navigation with hamburger menu'
          ]
        },
        {
          category: 'Content',
          items: [
            'Refined home page About section',
            'Updated project descriptions for more authentic tone'
          ]
        }
      ]
    },
    {
      version: '0.1.0',
      date: 'October 13, 2025',
      changes: [
        {
          category: 'Features',
          items: [
            'Dynamic version display in footer'
          ]
        }
      ]
    },
    {
      version: '0.0.1',
      date: 'October 13, 2025',
      changes: [
        {
          category: 'Launch',
          items: [
            'Initial site launch with SvelteKit 2 and Tailwind CSS 4',
            'Custom design with cream, navy, and terracotta color scheme',
            'Home page with hero section and current work',
            'Navigation and footer components'
          ]
        }
      ]
    }
  ];
</script>

<svelte:head>
  <title>Changelog | Kai Maurin-Jones</title>
  <meta name="description" content="Version history and updates for kmaurinjones.dev" />
</svelte:head>

<div class="min-h-screen {mounted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 py-12">
    <h1 class="text-4xl lg:text-5xl font-bold text-primary mb-8">
      Changelog
    </h1>

    <p class="text-taupe mb-12 leading-relaxed">
      User-facing changes and improvements to this site.
    </p>

    <div class="space-y-12">
      {#each changelog as release}
        <article class="border-l-4 border-terracotta pl-6">
          <header class="mb-6">
            <h2 class="text-2xl font-bold text-primary mb-2">
              Version {release.version}
            </h2>
            <time datetime="{release.date}" class="text-taupe text-sm">
              {release.date}
            </time>
          </header>

          <div class="space-y-6">
            {#each release.changes as category}
              <section>
                <h3 class="text-lg font-semibold text-primary mb-3">
                  {category.category}
                </h3>
                <ul class="space-y-2">
                  {#each category.items as item}
                    <li class="text-taupe leading-relaxed flex items-start">
                      <span class="text-terracotta mr-2 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  {/each}
                </ul>
              </section>
            {/each}
          </div>
        </article>
      {/each}
    </div>
  </div>
</div>
