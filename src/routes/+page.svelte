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
      description: "Made legal precedent searchable by pulling structured data from 50,000 housing cases and building a classifier to predict outcomes. Years of case law became navigable once the data was structured properly."
    },
    {
      title: "Ontario Building Code RAG",
      description: "A friend was spending 30 minutes manually searching building code documents for each renovation question. Built a RAG system to make it conversational—turned out query expansion handled it well without adding complexity."
    },
    {
      title: "Hack the Threat 2023 Winner",
      description: "Built a data anonymization tool implementing k-anonymity. Won Audience Choice. The design focused on making privacy configuration accessible to non-technical users without requiring code."
    }
  ];
</script>

<svelte:head>
  <title>Kai Maurin-Jones | Forever Builder</title>
  <meta name="description" content="Building things to see if they'll work. Data Scientist working in healthcare AI." />
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
        I didn't start in computer science. I started with audio engineering and languages. During undergrad, I found myself analyzing a thousand transcripts of multilingual data and realized this was the work I wanted to do.
      </p>
    </blockquote>
  </section>

  <!-- Additional Description -->
  <section class="mb-16">
    <p class="text-lg leading-relaxed text-taupe max-w-4xl">
      That research project turned into data science, then computational linguistics, then machine learning, and now generative AI. I didn't know what to call it at the time—just knew I wanted more of whatever it was. The path from audio production to AI wasn't linear, but looking back, it makes sense. Both are about patterns, both require you to hear what's actually there versus what you expect.
    </p>
    <p class="text-lg leading-relaxed text-taupe max-w-4xl mt-4">
      Right now I'm at Klick Health building AI solutions for healthcare—mostly working with GPT, LLaMa, and Claude to solve real-world problems in a regulated space. Before that I was a prompt engineer at Meta. I speak English, Portuguese, and French, which turns out to matter more than I expected when you're working with international teams and multilingual data. Most of my side projects are experiments to see if something works: can I make legal precedent actually searchable, can I help someone navigate building code faster, can I predict Bitcoin movements (jury's still out on that one).
    </p>
    <p class="text-lg leading-relaxed text-taupe max-w-4xl mt-4">
      I'm a big proponent of using the right tool for the job. Gen AI isn't always the answer—sometimes a BERT model or an XGBoost classifier is exactly what you need. I like finding that line between what's technically impressive and what actually solves the problem. Usually the best solution is simpler than you think.
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

  <!-- Skills Section -->
  <section class="mb-16">
    <h2 class="text-2xl lg:text-3xl font-bold text-primary mb-8">Technical Skills</h2>
    <div class="grid gap-6 md:grid-cols-2">
      <div class="bg-base border border-taupe/20 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-terracotta mb-3">ML & GenAI</h3>
        <p class="text-taupe">PyTorch, HuggingFace, LangChain, Large Language Models, Fine-tuning, Prompt Engineering</p>
      </div>
      <div class="bg-base border border-taupe/20 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-terracotta mb-3">MLOps & Deployment</h3>
        <p class="text-taupe">Cloud ML Architecture, Model Monitoring, CI/CD for ML, Scaling AI Solutions</p>
      </div>
      <div class="bg-base border border-taupe/20 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-terracotta mb-3">Data Engineering</h3>
        <p class="text-taupe">Python, Apache Spark, SQL, NoSQL, ETL Processes, Data Transformation</p>
      </div>
      <div class="bg-base border border-taupe/20 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-terracotta mb-3">Cloud & APIs</h3>
        <p class="text-taupe">AWS, Azure, GCP, OpenAI, Anthropic, HuggingFace</p>
      </div>
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
