<script lang="ts">
  import { onMount } from 'svelte';

  let mounted = $state(false);
  onMount(() => mounted = true);

  const currentWork = [
    "Developing scalable architectures for real-time data processing.",
    "Exploring advanced machine learning predictive modeling.",
    "Diving deep into secure software development lifecycle practices."
  ];
</script>

<svelte:head>
  <title>Kai Maurin-Jones</title>
  <meta name="description" content="I build pragmatic AI systems for regulated spaces—shipping fast without breaking rules." />
</svelte:head>

<div class="min-h-screen {mounted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700">
  <!-- Hero Section -->
  <section class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-16">
    <!-- Left Column - Text -->
    <div class="space-y-8">
      <div>
        <h1 class="text-4xl lg:text-5xl font-bold text-primary mb-6 leading-tight">
          Hello, I'm Kai.
        </h1>
        <p class="text-xl lg:text-2xl text-taupe leading-relaxed">
          I build pragmatic AI systems for regulated spaces—shipping fast without breaking rules.
        </p>
      </div>
    </div>

    <!-- Right Column - Image -->
    <div class="order-first lg:order-last flex justify-center lg:justify-end">
      <div class="w-72 h-72 lg:w-96 lg:h-96 rounded-full shadow-lg overflow-hidden">
        <img
          src="/images/cropped.png"
          alt="Kai speaking at an event"
          class="w-full h-full object-cover"
        />
      </div>
    </div>
  </section>

  <!-- Focus Section -->
  <section class="mb-16">
    <blockquote class="border-l-4 border-terracotta pl-6 lg:pl-8 py-4 bg-caramel/5">
      <p class="text-lg lg:text-xl leading-relaxed text-primary font-medium">
        My focus is on creating reliable, impactful software. I enjoy the challenge of taking complex ideas from
        concept to deployment, ensuring they are robust, scalable, and genuinely useful.
      </p>
    </blockquote>
  </section>

  <!-- Additional Description -->
  <section class="mb-16">
    <p class="text-lg leading-relaxed text-taupe max-w-4xl">
      My focus is on creating systems that solve real problems in regulated industries. I thrive at the intersection of
      cutting-edge AI and practical deployment constraints, building tools that teams actually want to use.
      When not coding, I'm tinkering with hardware projects and exploring the latest developments in machine learning infrastructure.
    </p>
  </section>

  <!-- Currently Section -->
  <section class="mb-16">
    <div class="bg-base border border-taupe/20 rounded-lg p-6 lg:p-8">
      <h2 class="text-xl font-semibold text-primary mb-6">Currently:</h2>
      <div class="space-y-4">
        <div class="text-lg font-medium text-terracotta">Cocoa</div>
        <ul class="space-y-3">
          {#each currentWork as item}
            <li class="flex items-start gap-3 text-taupe">
              <div class="w-2 h-2 rounded-full bg-terracotta mt-2.5 flex-shrink-0"></div>
              <span class="leading-relaxed">{item}</span>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </section>
</div>
