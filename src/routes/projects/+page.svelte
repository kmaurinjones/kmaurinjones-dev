<script lang="ts">
  import { onMount } from 'svelte';
  import projects from '$lib/data/projects.json';

  let mounted = $state(false);
  let searchQuery = $state('');
  let sortBy = $state<'date' | 'title-asc' | 'title-desc'>('date');

  onMount(() => mounted = true);

  // Function to calculate search relevance score
  function calculateRelevance(project: any, query: string): number {
    if (!query) return 0;

    const lowerQuery = query.toLowerCase();
    const titleMatch = project.title.toLowerCase().includes(lowerQuery);

    // Check categories for matches
    const categoryMatch = project.categories?.some((cat: string) =>
      cat.toLowerCase().includes(lowerQuery)
    ) || false;

    // Weight title matches highest, then categories
    let score = 0;
    if (titleMatch) score += 10;
    if (categoryMatch) score += 5;

    // Count occurrences in title
    const titleOccurrences = (project.title.toLowerCase().match(new RegExp(lowerQuery, 'g')) || []).length;
    score += titleOccurrences * 2;

    return score;
  }

  // Derived state for filtered and sorted projects
  let filteredProjects = $derived.by(() => {
    let filtered = [...projects];

    // Apply search sorting by relevance (no filtering - always return all projects)
    if (searchQuery.trim()) {
      filtered = filtered
        .map(project => ({
          project,
          relevance: calculateRelevance(project, searchQuery)
        }))
        .sort((a, b) => b.relevance - a.relevance)
        .map(item => item.project);
    } else {
      // Apply sorting only when no search query
      if (sortBy === 'date') {
        // Projects are already sorted by date in JSON, newest first
        filtered = [...projects];
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
  <title>Projects | Kai Maurin-Jones</title>
  <meta name="description" content="Portfolio of projects and live applications by Kai Maurin-Jones" />
</svelte:head>

<div class="min-h-screen {mounted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700">
  <!-- Page header -->
  <header class="mb-8">
    <h1 class="text-4xl lg:text-5xl font-bold text-primary mb-4">
      Projects
    </h1>
    <p class="text-xl text-taupe leading-relaxed max-w-3xl mb-8">
      Live applications and interactive projects.
    </p>

    <!-- Search and sort controls -->
    <div class="flex flex-col sm:flex-row gap-4 mt-8">
      <!-- Search bar -->
      <div class="flex-1">
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search projects..."
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
      Showing {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} sorted by relevance to "{searchQuery}"
    </div>
  {/if}

  <!-- Projects grid -->
  {#if filteredProjects.length > 0}
    <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {#each filteredProjects as project}
        <article class="bg-base border border-taupe/20 rounded-lg overflow-hidden hover:border-terracotta/40 transition-all hover:shadow-lg flex flex-col">
          <!-- Project image -->
          <div class="aspect-video w-full overflow-hidden bg-taupe/10">
            <img
              src={project.image}
              alt={project.title}
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Project content -->
          <div class="p-6 flex-1 flex flex-col">
            <h2 class="text-xl font-semibold text-primary mb-3">
              {project.title}
            </h2>

            <p class="text-taupe mb-4 leading-relaxed flex-1">
              {project.summary}
            </p>

            <!-- Category tags -->
            <div class="flex flex-wrap gap-2 mb-4">
              {#each project.categories.slice(0, 3) as category}
                <span class="text-xs px-2 py-1 bg-taupe/10 text-taupe rounded">
                  {category}
                </span>
              {/each}
            </div>

            <!-- Action buttons -->
            <div class="flex gap-3">
              <a
                href={project.articleUrl}
                class="flex-1 text-center px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-base transition-all duration-300"
              >
                Read Article
              </a>
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="flex-1 text-center px-4 py-2 bg-primary text-base rounded-lg hover:bg-terracotta transition-all duration-300"
              >
                Try It
              </a>
            </div>
          </div>
        </article>
      {/each}
    </div>
  {:else}
    <div class="text-center py-16">
      <p class="text-taupe text-lg">No projects yet. Check back soon!</p>
    </div>
  {/if}
</div>
