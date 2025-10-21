<script lang="ts">
  import { page } from '$app/stores';

  const links = [
    { href: '/', label: 'About' },
    { href: '/thoughts', label: 'Thoughts' },
    { href: '/contact', label: 'Contact' },
  ];

  let mobileMenuOpen = $state(false);

  function toggleMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  function closeMenu() {
    mobileMenuOpen = false;
  }
</script>

<nav class="border-b border-taupe/20 bg-base/95 backdrop-blur sticky top-0 z-50">
  <div class="max-w-6xl mx-auto px-6 py-6">
    <div class="flex items-center justify-between md:grid md:grid-cols-3">
      <!-- Logo -->
      <a href="/" class="inline-block leading-[0] transition-opacity hover:opacity-70 md:justify-self-start md:self-center">
        <img src="/kmj-icon.svg" alt="KMJ" width="32" height="32" class="block" />
      </a>

      <!-- Desktop Navigation Links -->
      <ul class="hidden md:flex gap-8 lg:gap-12 justify-center">
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

      <!-- Mobile Menu Button -->
      <button
        onclick={toggleMenu}
        class="md:hidden text-primary hover:text-terracotta transition-colors p-2"
        aria-label="Toggle menu"
      >
        {#if mobileMenuOpen}
          <!-- Close Icon -->
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        {:else}
          <!-- Hamburger Icon -->
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        {/if}
      </button>
    </div>

    <!-- Mobile Menu -->
    {#if mobileMenuOpen}
      <div class="md:hidden mt-4 pb-4 border-t border-taupe/20 pt-4">
        <ul class="flex flex-col gap-4">
          {#each links as link}
            <li>
              <a
                href={link.href}
                onclick={closeMenu}
                class="block text-lg font-medium hover:text-terracotta transition-colors py-2
                       {$page.url.pathname === link.href ? 'text-terracotta' : 'text-primary'}"
              >
                {link.label}
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
</nav>
