<script lang="ts">
  import { page } from '$app/stores';

  const version = $derived($page.data.siteConfig?.version || '0.0.1');
</script>

<footer class="border-t border-taupe/20 bg-base">
  <div class="max-w-6xl mx-auto px-6 py-8">
    <div class="flex flex-col gap-6">
      <!-- Note about subdomains -->
      <div class="text-sm text-taupe leading-relaxed max-w-4xl">
        <strong class="text-primary">Note:</strong> Personal projects at this site's subdomains are typically not actively maintained or monitored.
        If any are down or experiencing issues, please <a href="https://github.com/kmaurinjones/kmaurinjones-dev/issues/new/choose" class="text-terracotta hover:underline">open an issue</a> using the bug report template <a href="https://github.com/kmaurinjones/kmaurinjones-dev" class="text-terracotta hover:underline">in this repo</a>.
      </div>

      <!-- Footer links -->
      <div class="flex flex-col gap-4">
        <!-- Links - always on top -->
        <div class="flex gap-6 text-taupe justify-center sm:justify-end">
          <a href="https://linkedin.com/in/kmaurinjones" class="hover:text-terracotta transition-colors">
            LinkedIn
          </a>
          <a href="https://medium.com/@kmaurinjones" class="hover:text-terracotta transition-colors">
            Medium
          </a>
          <a href="/contact" class="hover:text-terracotta transition-colors">
            Contact
          </a>
        </div>
        <!-- Version - always on bottom -->
        <div class="text-taupe text-sm text-center sm:text-left">
          <span class="text-taupe/60">v{version}</span>
        </div>
      </div>
    </div>
  </div>
</footer>
