<script lang="ts">
  import { onMount } from 'svelte';

  let mounted = $state(false);
  let inputText = $state('');
  let outputText = $state('');
  let copyButtonText = $state('Copy to Clipboard');

  onMount(() => mounted = true);

  function countSameCasePairs(text: string): number {
    let sameCasePairs = 0;
    let totalLetterPairs = 0;

    for (let i = 0; i < text.length - 1; i++) {
      const char1 = text[i];
      const char2 = text[i + 1];

      // Only count pairs where both are letters
      if (char1.match(/[a-zA-Z]/) && char2.match(/[a-zA-Z]/)) {
        totalLetterPairs++;
        const char1IsUpper = char1 === char1.toUpperCase();
        const char2IsUpper = char2 === char2.toUpperCase();

        if (char1IsUpper === char2IsUpper) {
          sameCasePairs++;
        }
      }
    }

    return totalLetterPairs > 0 ? sameCasePairs / totalLetterPairs : 0;
  }

  function randomizeCase() {
    // Strip trailing whitespace
    const cleanedInput = inputText.trimEnd();

    if (!cleanedInput.trim()) {
      outputText = '';
      return;
    }

    let attempts = 0;
    let result = '';
    const maxAttempts = 100;

    // Keep trying until we get a result with <= 50% same-case pairs
    while (attempts < maxAttempts) {
      result = cleanedInput
        .split('')
        .map(char => {
          if (char.match(/[a-zA-Z]/)) {
            return Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase();
          }
          return char;
        })
        .join('');

      const sameCaseRatio = countSameCasePairs(result);

      if (sameCaseRatio <= 0.5) {
        break;
      }

      attempts++;
    }

    outputText = result;
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      randomizeCase();
    }
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(outputText);
      copyButtonText = 'Copied!';
      setTimeout(() => {
        copyButtonText = 'Copy to Clipboard';
      }, 2000);
    } catch (err) {
      copyButtonText = 'Failed to copy';
      setTimeout(() => {
        copyButtonText = 'Copy to Clipboard';
      }, 2000);
    }
  }
</script>

<svelte:head>
  <title>Bonus | Kai Maurin-Jones</title>
  <meta name="description" content="Random case converter - a fun little tool" />
</svelte:head>

<div class="min-h-screen {mounted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700">
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- Input Section -->
    <div>
      <textarea
        id="input-text"
        bind:value={inputText}
        onkeypress={handleKeyPress}
        placeholder="Type something here..."
        rows="4"
        maxlength="10000"
        class="w-full px-4 py-3 rounded-lg border border-taupe/30 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-colors bg-base text-primary resize-none"
      ></textarea>
      <p class="text-sm text-taupe/70 mt-2">Press Enter or click the button below to randomize</p>
    </div>

    <!-- Convert Button -->
    <button
      onclick={randomizeCase}
      class="w-full px-6 py-3 bg-terracotta text-base font-medium rounded-lg hover:bg-terracotta/90 transition-colors shadow-md hover:shadow-lg"
    >
      Randomize Case
    </button>

    <!-- Output Section -->
    {#if outputText}
      <div class="space-y-4">
        <div>
          <label for="output-text" class="block text-lg font-medium text-primary mb-2">
            Randomized Text
          </label>
          <div class="relative">
            <textarea
              id="output-text"
              value={outputText}
              readonly
              rows="4"
              class="w-full px-4 py-3 rounded-lg border border-taupe/30 bg-caramel/5 text-primary resize-none"
            ></textarea>
          </div>
        </div>

        <!-- Copy Button -->
        <button
          onclick={copyToClipboard}
          class="w-full px-6 py-3 bg-primary text-base font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
        >
          {copyButtonText}
        </button>
      </div>
    {/if}
  </div>
</div>
