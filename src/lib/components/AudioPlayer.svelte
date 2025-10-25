<script lang="ts">
  import { onMount } from 'svelte';

  let {
    audioSrc,
    title = 'Article Audio'
  }: {
    audioSrc: string;
    title?: string;
  } = $props();

  let audio: HTMLAudioElement | null = null;
  let isPlaying = $state(false);
  let currentTime = $state(0);
  let duration = $state(0);
  let isLoaded = $state(false);
  let playbackRate = $state(1.0);

  // Format time as MM:SS
  function formatTime(seconds: number): string {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // Toggle play/pause
  function togglePlay() {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  }

  // Seek to specific time
  function seek(event: Event) {
    if (!audio) return;
    const input = event.target as HTMLInputElement;
    audio.currentTime = parseFloat(input.value);
  }

  // Change playback speed
  function changeSpeed() {
    if (!audio) return;

    // Cycle through speeds: 1.0 -> 1.25 -> 1.5 -> 1.75 -> 2.0 -> 1.0
    const speeds = [1.0, 1.25, 1.5, 1.75, 2.0];
    const currentIndex = speeds.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % speeds.length;
    playbackRate = speeds[nextIndex];
    audio.playbackRate = playbackRate;
  }

  // Skip forward/backward
  function skip(seconds: number) {
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + seconds));
  }

  onMount(() => {
    if (!audio) return;

    // Set up event listeners
    audio.addEventListener('play', () => isPlaying = true);
    audio.addEventListener('pause', () => isPlaying = false);
    audio.addEventListener('timeupdate', () => currentTime = audio?.currentTime || 0);
    audio.addEventListener('loadedmetadata', () => {
      duration = audio?.duration || 0;
      isLoaded = true;
    });
    audio.addEventListener('ended', () => isPlaying = false);

    return () => {
      // Cleanup
      audio?.pause();
    };
  });
</script>

<div class="bg-gradient-to-r from-primary/5 to-caramel/10 rounded-lg p-6 border border-taupe/20 shadow-sm">
  <!-- Header -->
  <div class="flex items-center gap-3 mb-4">
    <div class="w-10 h-10 bg-terracotta/20 rounded-full flex items-center justify-center">
      <svg class="w-5 h-5 text-terracotta" fill="currentColor" viewBox="0 0 20 20">
        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
      </svg>
    </div>
    <div class="flex-1">
      <h3 class="text-sm font-semibold text-primary">Listen to this article</h3>
    </div>
  </div>

  <!-- Audio element (hidden) -->
  <audio bind:this={audio} src={audioSrc} preload="metadata"></audio>

  {#if isLoaded}
    <!-- Progress bar -->
    <div class="mb-4">
      <input
        type="range"
        min="0"
        max={duration}
        value={currentTime}
        oninput={seek}
        class="w-full h-2 bg-taupe/20 rounded-lg appearance-none cursor-pointer
               [&::-webkit-slider-thumb]:appearance-none
               [&::-webkit-slider-thumb]:w-4
               [&::-webkit-slider-thumb]:h-4
               [&::-webkit-slider-thumb]:rounded-full
               [&::-webkit-slider-thumb]:bg-terracotta
               [&::-webkit-slider-thumb]:cursor-pointer
               [&::-moz-range-thumb]:w-4
               [&::-moz-range-thumb]:h-4
               [&::-moz-range-thumb]:rounded-full
               [&::-moz-range-thumb]:bg-terracotta
               [&::-moz-range-thumb]:border-0
               [&::-moz-range-thumb]:cursor-pointer"
      />
      <div class="flex justify-between text-xs text-taupe mt-1">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex items-center justify-center gap-4">
      <!-- Skip backward 10s -->
      <button
        onclick={() => skip(-10)}
        class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-taupe/10 transition-colors"
        aria-label="Skip backward 10 seconds"
      >
        <svg class="w-5 h-5 text-taupe" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"/>
        </svg>
        <span class="sr-only">-10s</span>
      </button>

      <!-- Play/Pause button -->
      <button
        onclick={togglePlay}
        class="w-12 h-12 flex items-center justify-center rounded-full bg-terracotta hover:bg-terracotta/90 transition-colors shadow-md"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {#if isPlaying}
          <!-- Pause icon -->
          <svg class="w-6 h-6 text-base" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
        {:else}
          <!-- Play icon -->
          <svg class="w-6 h-6 text-base ml-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
          </svg>
        {/if}
      </button>

      <!-- Skip forward 10s -->
      <button
        onclick={() => skip(10)}
        class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-taupe/10 transition-colors"
        aria-label="Skip forward 10 seconds"
      >
        <svg class="w-5 h-5 text-taupe" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"/>
        </svg>
        <span class="sr-only">+10s</span>
      </button>

      <!-- Speed control -->
      <button
        onclick={changeSpeed}
        class="px-3 py-1.5 rounded-full bg-taupe/10 hover:bg-taupe/20 transition-colors text-sm font-medium text-taupe"
        aria-label="Change playback speed"
      >
        {playbackRate}x
      </button>
    </div>
  {:else}
    <!-- Loading state -->
    <div class="text-center py-4">
      <div class="inline-block w-8 h-8 border-3 border-terracotta/30 border-t-terracotta rounded-full animate-spin"></div>
      <p class="text-sm text-taupe mt-2">Loading audio...</p>
    </div>
  {/if}
</div>
