<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let mounted = $state(false);
  onMount(() => mounted = true);

  const currentWork = [
    "Building AI solutions for healthcare that address real business challenges while navigating regulatory constraints",
    "Leading end-to-end development with state of the art closed source and open-source GenAI technologies—from stakeholder alignment to production deployment",
    "Developing internal tools and educating teams on how AI can accelerate existing workflows across technical and non-technical functions"
  ];

  const projects = [
    {
      title: "Housing Law Insights",
      description: "End-to-end Generative AI solution using fine-tuned LLaMa model to extract structured data from 50,000 legal cases. Used XGBoost model (achieving 0.9 F1 score on case outcome prediction) for historical case analysis. Deployed interactive dashboard to explore legal data patterns."
    },
    {
      title: "Ontario Building Code RAG",
      description: "Focused on meaningful user impact and elegant backend optimizations, this project was completed to help a friend navigate the 800k token Ontario Building Code more easily for house improvements. This app enables Natural Language 'searching' of the document's contents in a user-friendly manner. Inference optimizations implemented to decrease inference time, and cost, while maintaining search and response quality."
    },
    {
      title: "Hack the Threat 2023 Winner",
      description: "Developed a privacy-preserving data anonymization application implementing k-anonymity algorithm. Created user-friendly interface allowing non-technical users to configure anonymization settings without coding knowledge. Won Audience Choice award."
    }
  ];
</script>

<svelte:head>
  <title>Kai Maurin-Jones | Forever Builder</title>
  <meta name="description" content="Building things to see if they'll work. Data Scientist working in healthcare AI." />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://kmaurinjones.dev/" />
  <meta property="og:title" content="Kai Maurin-Jones | Forever Builder" />
  <meta property="og:description" content="Building things to see if they'll work. Data Scientist working in healthcare AI." />
  <meta property="og:image" content="https://kmaurinjones.dev/images/cropped.webp" />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://kmaurinjones.dev/" />
  <meta property="twitter:title" content="Kai Maurin-Jones | Forever Builder" />
  <meta property="twitter:description" content="Building things to see if they'll work. Data Scientist working in healthcare AI." />
  <meta property="twitter:image" content="https://kmaurinjones.dev/images/cropped.webp" />
</svelte:head>

<div class="min-h-screen {mounted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700">
  <!-- Hero Section -->
  <section class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-16">
    <!-- Left Column - Text -->
    <div class="space-y-8">
      <div>
        <h1 class="text-4xl lg:text-5xl font-bold text-primary mb-6 leading-tight">
          Hi! I'm Kai.
        </h1>
        <p class="text-xl lg:text-2xl text-taupe leading-relaxed">
          I build things and see if they'll work.
        </p>
      </div>
    </div>

    <!-- Right Column - Image -->
    <div class="order-first lg:order-last flex justify-center lg:justify-end">
      <div class="w-72 h-72 lg:w-96 lg:h-96 rounded-full shadow-lg overflow-hidden">
        <img
          src="/images/cropped.png"
          alt="Kai Maurin-Jones"
          class="w-full h-full object-cover"
        />
      </div>
    </div>
  </section>

  <!-- About Section -->
  <section class="mb-16">
    <blockquote class="border-l-4 border-terracotta pl-6 lg:pl-8 py-4 bg-caramel/5">
      <p class="text-lg lg:text-xl leading-relaxed text-primary font-medium">
        I don't come from a strict computer science background. I have always been a curious, scrappy creative who has bounced around between Audio Engineering, Applied Linguistics, Data Science, and Generative AI.
      </p>
    </blockquote>
  </section>

  <!-- Additional Description -->
  <section class="mb-16">
    <p class="text-lg leading-relaxed text-taupe max-w-4xl">
      In undergrad, I worked on a research project that leveraged 1000 multilingual transcripts from the Philippines, and this made me realize there was an intersection between languages and quantitive analysis. It was my first foray into data science, computational linguistics, and statistics (even though, looking back at it now, all I did really was manually computing summary statistics), and I've never looked back.
    </p>
    <p class="text-lg leading-relaxed text-taupe max-w-4xl mt-4">
      In my current role, I use state-of-the-art to solve complex problems in life sciences and pharmaceuticals spaces. I provide SME support on and lead the development of GenAI solutions for internal and external teams, and train our teams on how to use these tools effectively. 
    </p>
    <p class="text-lg leading-relaxed text-taupe max-w-4xl mt-4">
      With the current landscape of GenAI and technology as a whole, 'using the right tool for the job' has a different definition almost every week, and a part of my role is to always be able to answer this question. There's never a dull moment.
    </p>
  </section>

  <!-- Currently Section -->
  <section class="mb-16">
    <div class="bg-base border border-taupe/20 rounded-lg p-6 lg:p-8">
      <h2 class="text-xl font-semibold text-primary mb-6">Currently:</h2>
      <div class="space-y-4">
        <div class="text-lg font-medium text-terracotta">Applied AI Developer @ Klick Health</div>
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

  <!-- Projects Section -->
  <section class="mb-16">
    <h2 class="text-2xl lg:text-3xl font-bold text-primary mb-8">Notable Projects</h2>
    <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {#each projects as project}
        <div class="bg-base border border-taupe/20 rounded-lg p-6 hover:border-terracotta/40 transition-colors">
          <h3 class="text-xl font-semibold text-primary mb-3">{project.title}</h3>
          <p class="text-taupe leading-relaxed">{project.description}</p>
        </div>
      {/each}
    </div>
  </section>

  <!-- Education Section -->
  <section class="mb-16">
    <h2 class="text-2xl lg:text-3xl font-bold text-primary mb-8">Education</h2>
    <div class="space-y-4">
      <div class="border-l-4 border-terracotta pl-6 py-2">
        <h3 class="text-xl font-semibold text-primary">Master of Data Science - Computational Linguistics</h3>
        <p class="text-taupe">University of British Columbia</p>
      </div>
      <div class="border-l-4 border-terracotta pl-6 py-2">
        <h3 class="text-xl font-semibold text-primary">Language & Intercultural Relations, BA (Hons)</h3>
        <p class="text-taupe">Toronto Metropolitan University</p>
      </div>
      <div class="border-l-4 border-terracotta pl-6 py-2">
        <h3 class="text-xl font-semibold text-primary">Music Production & Technology, Advanced Diploma (Hons)</h3>
        <p class="text-taupe">Centennial College</p>
      </div>
    </div>
  </section>
</div>
