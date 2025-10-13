<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let mounted = $state(false);
  onMount(() => mounted = true);

  const currentWork = [
    "Architecting cloud-native GenAI healthcare applications using PyTorch, HuggingFace, and custom ML pipelines",
    "Leading development of healthcare-focused GenAI tools for clinical decision-making and patient outcomes",
    "Implementing scalable AI architectures for processing and analyzing healthcare data"
  ];

  const projects = [
    {
      title: "Housing Law Insights",
      description: "Architected an end-to-end Generative AI solution using fine-tuned LLaMa model to extract structured data from 50,000 legal cases. Used XGBoost model (achieving 0.9 F1 score on case outcome prediction) for historical case analysis. Deployed interactive dashboard to explore legal data patterns."
    },
    {
      title: "Ontario Building Code RAG",
      description: "Focused on meaningful user impact and elegant backend optimizations, this project was completed to help a friend navigate the 800k token Ontario Building Code more easily for house improvements. This app enables Natural Language 'searching' of the document's contents in a user-friendly manner. Inference optimizations implemented to decrease inference time, and cost, while maintaining search and response quality."
    },
    {
      title: "Hack the Threat 2023 Winner",
      description: "Winner of Audience Choice award. Developed a privacy-preserving data anonymization application implementing k-anonymity algorithm. Created user-friendly interface allowing non-technical users to configure anonymization settings without coding knowledge."
    }
  ];
</script>

<svelte:head>
  <title>Kai Maurin-Jones | Applied AI Developer</title>
  <meta name="description" content="Multilingual Data Scientist specializing in regulated industries, building robust AI architectures to solve complex business challenges." />
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
        Multilingual Data Scientist specializing in regulated industries, building robust AI architectures to solve complex business challenges. Experienced in implementing end-to-end Conversational AI solutions with a focus on production-ready systems that deliver specific and measurable outcomes.
      </p>
    </blockquote>
  </section>

  <!-- Additional Description -->
  <section class="mb-16">
    <p class="text-lg leading-relaxed text-taupe max-w-4xl">
      I thrive at the intersection of cutting-edge AI and practical deployment constraints, building tools that teams actually want to use.
      Skilled in translating technical Data Science and ML concepts for internal and external stakeholders and executives, creating impactful AI in ever-changing environments.
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
