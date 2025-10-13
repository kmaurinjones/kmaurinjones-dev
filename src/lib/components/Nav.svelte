<script lang="ts">
  import { page } from '$app/stores';

  const links = [
    { href: '/', label: 'About' },
    { href: '/technical', label: 'Technical' },
    { href: '/experience', label: 'Experience' },
    { href: '/projects', label: 'Projects' },
    { href: '/thoughts', label: 'Thoughts' },
    { href: '/contact', label: 'Contact' },
  ];
</script>

<nav class="border-b border-taupe/20 bg-base/95 backdrop-blur sticky top-0 z-50">
  <div class="max-w-6xl mx-auto px-6 py-6">
    <div class="flex items-center gap-8 lg:gap-12">
      <!-- Logo -->
      <a href="/" class="flex-shrink-0">
        <img src="/kmj-icon.svg" alt="KMJ" class="h-10 w-10" />
      </a>

      <!-- Navigation Links -->
      <ul class="flex gap-8 lg:gap-12">
        {#each links as link}
          <li>
            <a
              href={link.href}
              class="text-lg font-medium hover:text-terracotta transition-colors relative pb-1
                     {$page.url.pathname === link.href ? 'text-terracotta' : 'text-primary'}"
            >
              {link.label}
              {#if $page.url.pathname === link.href}
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-terracotta"></div>
              {/if}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</nav>
