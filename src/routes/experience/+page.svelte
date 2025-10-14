<script lang="ts">
  import { onMount } from 'svelte';

  let mounted = $state(false);
  onMount(() => mounted = true);
</script>

<svelte:head>
  <title>Experience | Kai Maurin-Jones</title>
  <meta name="description" content="Professional experience and career history" />
</svelte:head>

<div class="min-h-screen {mounted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700">
  <div class="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
    <h1 class="text-4xl lg:text-5xl font-bold text-primary mb-6">
      Experience
    </h1>
    <p class="text-2xl text-taupe">
      Coming soon
    </p>
  </div>
</div>
