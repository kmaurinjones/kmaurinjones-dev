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
  <div class="max-w-4xl mx-auto px-4 py-16 space-y-16">
    <!-- Header -->
    <div class="space-y-4">
      <h1 class="text-4xl lg:text-5xl font-bold text-primary">
        Experience
      </h1>
      <p class="text-lg text-taupe max-w-2xl">
        Multilingual Data Scientist specializing in regulated industries, building robust AI architectures to solve complex business challenges. Experienced in implementing end-to-end AI solutions with a focus on production-ready systems that deliver specific and measurable outcomes.
      </p>
    </div>

    <!-- Professional Experience -->
    <section class="space-y-8">
      <h2 class="text-2xl font-bold text-primary">Professional Experience</h2>

      <div class="space-y-6">
        <!-- Klick Health -->
        <div class="border-l-4 border-caramel pl-6 py-2">
          <div class="flex flex-col lg:flex-row lg:items-baseline lg:justify-between gap-2 mb-2">
            <h3 class="text-xl font-semibold text-primary">Applied AI Developer</h3>
            <span class="text-sm text-taupe font-medium">February 2024 - Present</span>
          </div>
          <p class="text-terracotta font-medium mb-3">Klick Health</p>
          <ul class="space-y-2 text-base text-taupe">
            <li>• Architecting cloud-native GenAI healthcare applications using PyTorch, HuggingFace, and custom ML pipelines</li>
            <li>• Leading development of healthcare-focused GenAI tools for clinical decision-making and patient outcomes</li>
            <li>• Implementing scalable AI architectures for processing and analyzing healthcare data, reducing manual tasks</li>
            <li>• Collaborating with healthcare professionals to translate clinical requirements into practical AI solutions generating over $500k in revenue</li>
          </ul>
        </div>

        <!-- Meta -->
        <div class="border-l-4 border-caramel pl-6 py-2">
          <div class="flex flex-col lg:flex-row lg:items-baseline lg:justify-between gap-2 mb-2">
            <h3 class="text-xl font-semibold text-primary">Prompt Engineer</h3>
            <span class="text-sm text-taupe font-medium">September 2023 - February 2024</span>
          </div>
          <p class="text-terracotta font-medium mb-3">Meta</p>
          <ul class="space-y-2 text-base text-taupe">
            <li>• Developed qualitative and quantitative evaluation standards for LLaMa models</li>
            <li>• Engineered sophisticated prompts for Meta's Personas AI chatbots, ensuring human-like conversations while maintaining ethical guardrails</li>
            <li>• Rapidly prototyped new LLaMa models to test capabilities and identify potential gaps and areas for improvement</li>
          </ul>
        </div>

        <!-- Future of Law Lab (UofT) -->
        <div class="border-l-4 border-caramel pl-6 py-2">
          <div class="flex flex-col lg:flex-row lg:items-baseline lg:justify-between gap-2 mb-2">
            <h3 class="text-xl font-semibold text-primary">Data Scientist - NLP</h3>
            <span class="text-sm text-taupe font-medium">July 2023 - February 2024</span>
          </div>
          <p class="text-terracotta font-medium mb-3">Future of Law Lab (University of Toronto), Legal Hackers</p>
          <ul class="space-y-2 text-base text-taupe">
            <li>• Fine-tuned LLMs to extract structured information from over 50,000 legal documents in French and English</li>
            <li>• Collaborated with legal experts to develop AI applications that improved access to justice, establishing new methodologies for legal research</li>
          </ul>
        </div>

        <!-- Future of Law Lab (Capstone) -->
        <div class="border-l-4 border-caramel pl-6 py-2">
          <div class="flex flex-col lg:flex-row lg:items-baseline lg:justify-between gap-2 mb-2">
            <h3 class="text-xl font-semibold text-primary">Data Scientist - NLP</h3>
            <span class="text-sm text-taupe font-medium">May 2023 - June 2023</span>
          </div>
          <p class="text-terracotta font-medium mb-3">Future of Law Lab</p>
          <ul class="space-y-2 text-base text-taupe">
            <li>• Led capstone project for Master's program, developing an automated system to process 44,000+ unstructured legal documents</li>
            <li>• Combined rule-based methods with large language models to transform unstructured text into structured data for predictive modeling</li>
          </ul>
        </div>

        <!-- MeaningLab -->
        <div class="border-l-4 border-caramel pl-6 py-2">
          <div class="flex flex-col lg:flex-row lg:items-baseline lg:justify-between gap-2 mb-2">
            <h3 class="text-xl font-semibold text-primary">Lab Administrator & Research Assistant</h3>
            <span class="text-sm text-taupe font-medium">September 2021 - August 2022</span>
          </div>
          <p class="text-terracotta font-medium mb-3">MeaningLab Semiotics & Linguistics, Ryerson University</p>
          <ul class="space-y-2 text-base text-taupe">
            <li>• Constructed and maintained lexical databases for semantic corpus analysis in linguistics research</li>
            <li>• Developed data processing methodologies for academic publishing and linguistic analysis</li>
            <li>• Applied statistical methods to analyze language patterns and extract meaningful insights from text corpora</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Notable Projects -->
    <section class="space-y-8">
      <h2 class="text-2xl font-bold text-primary">Notable Projects</h2>

      <div class="space-y-6">
        <div class="bg-base border border-primary border-opacity-10 rounded-lg p-6">
          <h3 class="text-xl font-semibold text-primary mb-3">Housing Law Insights</h3>
          <p class="text-base text-taupe">
            Architected an end-to-end Generative AI solution using fine-tuned LLaMa model to extract structured data from 50,000 legal cases. Used XGBoost model (achieving 0.9 F1 score on case outcome prediction) for historical case analysis. Deployed interactive dashboard to explore legal data patterns.
          </p>
        </div>

        <div class="bg-base border border-primary border-opacity-10 rounded-lg p-6">
          <h3 class="text-xl font-semibold text-primary mb-3">Ontario Building Code RAG</h3>
          <p class="text-base text-taupe">
            Focused on meaningful user impact and elegant backend optimizations, this project was completed to help a friend navigate the 800k token Ontario Building Code more easily for house improvements. This app enables Natural Language 'searching' of the document's contents in a user-friendly manner. Inference optimizations implemented to decrease inference time and cost while maintaining search and response quality.
          </p>
        </div>
      </div>
    </section>

    <!-- Education -->
    <section class="space-y-8">
      <h2 class="text-2xl font-bold text-primary">Education</h2>

      <div class="space-y-4">
        <div class="border-l-4 border-terracotta pl-6 py-2">
          <h3 class="text-lg font-semibold text-primary">Master of Data Science - Computational Linguistics</h3>
          <p class="text-terracotta font-medium">University of British Columbia</p>
        </div>

        <div class="border-l-4 border-terracotta pl-6 py-2">
          <h3 class="text-lg font-semibold text-primary">Language & Intercultural Relations, BA (Hons)</h3>
          <p class="text-terracotta font-medium">Toronto Metropolitan University</p>
        </div>
      </div>
    </section>

    <!-- Technical Skills -->
    <section class="space-y-8">
      <h2 class="text-2xl font-bold text-primary">Technical Skills</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="font-semibold text-primary mb-3">ML & GenAI</h3>
          <p class="text-taupe">PyTorch, HuggingFace, LangChain, Large Language Models, Fine-tuning, Prompt Engineering</p>
        </div>

        <div>
          <h3 class="font-semibold text-primary mb-3">MLOps & Deployment</h3>
          <p class="text-taupe">Cloud ML Architecture, Model Monitoring, CI/CD for ML, Scaling AI Solutions</p>
        </div>

        <div>
          <h3 class="font-semibold text-primary mb-3">Data Engineering</h3>
          <p class="text-taupe">Python, Apache Spark, SQL, NoSQL, ETL Processes, Data Transformation</p>
        </div>

        <div>
          <h3 class="font-semibold text-primary mb-3">Cloud & APIs</h3>
          <p class="text-taupe">AWS, Azure, GCP, OpenAI, Anthropic, HuggingFace</p>
        </div>
      </div>
    </section>

    <!-- Leadership & Community -->
    <section class="space-y-8">
      <h2 class="text-2xl font-bold text-primary">Leadership & Community Engagement</h2>

      <div class="space-y-4">
        <div class="border-l-4 border-caramel pl-6 py-2">
          <h3 class="font-semibold text-primary">Student Block Representative</h3>
          <p class="text-taupe text-sm mb-2">Master of Data Sciences - Computational Linguistics, UBC</p>
          <ul class="space-y-2 text-taupe">
            <li>• Elected as primary liaison between students, program staff, and instructors for program improvement</li>
            <li>• Designed and conducted comprehensive course surveys, analyzing data using thematic and statistical methods</li>
            <li>• Presented actionable insights to program leadership, resulting in curriculum enhancements</li>
          </ul>
        </div>

        <div class="border-l-4 border-caramel pl-6 py-2">
          <h3 class="font-semibold text-primary">President, Language & Intercultural Relations Course Union</h3>
          <p class="text-taupe text-sm mb-2">Toronto Metropolitan University</p>
          <ul class="space-y-2 text-taupe">
            <li>• Led student organization as official spokesperson, managing cross-functional team of Vice Presidents</li>
            <li>• Developed and maintained relationships with university administration and external organizations</li>
            <li>• Recognized with the Dennis Mock Student Leadership Award for outstanding contributions</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Continuous Learning -->
    <section class="space-y-8 pb-8">
      <h2 class="text-2xl font-bold text-primary">Continuous Learning & Innovation</h2>

      <div class="space-y-4">
        <div class="bg-base border border-primary border-opacity-10 rounded-lg p-6">
          <h3 class="font-semibold text-primary mb-2">"Hack the Threat, 2023" - Audience Choice Winner</h3>
          <p class="text-taupe">Developed a privacy-preserving data anonymization application implementing k-anonymity algorithm. Created user-friendly interface allowing non-technical users to configure anonymization settings without coding knowledge.</p>
        </div>

        <div class="bg-base border border-primary border-opacity-10 rounded-lg p-6">
          <h3 class="font-semibold text-primary mb-2">Rapid AI Prototyping</h3>
          <p class="text-taupe">Continuously experimenting with emerging GenAI technologies, including building applications with the latest open-source and closed-source developers.</p>
        </div>

        <div class="bg-base border border-primary border-opacity-10 rounded-lg p-6">
          <h3 class="font-semibold text-primary mb-2">AI Ethics Education</h3>
          <p class="text-taupe">Actively engaged in ongoing education around responsible AI development, bias mitigation techniques, and ethical frameworks for AI deployment. Participate in industry discussions and communities focused on developing fair and transparent AI systems.</p>
        </div>
      </div>
    </section>
  </div>
</div>
