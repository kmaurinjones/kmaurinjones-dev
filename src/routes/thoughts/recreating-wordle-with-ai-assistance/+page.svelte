<script lang="ts">
	import ArticleLayout from '$lib/components/ArticleLayout.svelte';

	const metadata = {
		title: "Recreating Wordle with AI Assistance: A One-Day Build",
		date: "October 17, 2025",
		categories: ["wordle","fastapi","web development","ai-assisted coding","game development"],
		mediumUrl: ""
	};
</script>

<ArticleLayout
	title={metadata.title}
	date={metadata.date}
	categories={metadata.categories}
>
	{@html `<figure class="my-8">
    <img src="/images/thoughts/wordle-recreation/hero.png" alt="Wordle Recreation game interface showing a completed puzzle" class="w-[70%] md:w-[60%] lg:w-[50%] mx-auto" />
    <figcaption class="text-center text-sm text-taupe mt-2">The completed Wordle recreation with historical puzzle access</figcaption>
  </figure>

  
<h2>The Problem</h2>
<p>  I play Wordle daily with family and friends. The free version has one major limitation: you can only play today&#39;s puzzle. If you miss a day or want to replay an old puzzle, you&#39;re out of luck unless you pay for NYT Games.</p>
<p>  I wanted to fix this for myself. I also wanted better UX — specifically, the ability to click any tile to edit it, rather than only being able to add/delete from the right.</p>
<p>  So I built my own version in one day using Claude Code.</p>
  <figure class="my-8">
    <img src="/images/thoughts/wordle-recreation/date-picker.png" alt="Date picker interface showing calendar for selecting historical Wordle puzzles" class="w-[70%] md:w-[60%] lg:w-[50%] mx-auto" />
    <figcaption class="text-center text-sm text-taupe mt-2">The date picker allows playing any puzzle from June 19, 2021 onwards</figcaption>
  </figure>

  
<h2>AI-Assisted Development</h2>
<p>  Claude Code wrote most of the code. I provided requirements, reviewed output, and tested. The entire project — backend, frontend, tile animations, mobile optimization, deployment — took one day (October 12, 2025).</p>
<p>  This rapid timeline comes with tradeoffs, which I&#39;ll discuss later.</p>
<h2>Technical Overview</h2>
<p>  The architecture is deliberately simple: a FastAPI backend serves a single-page application that handles all game logic in the browser. The backend&#39;s responsibilities are minimal:</p>
<pre><code>  - **Word Validation**: Maintains a list of 12,966 valid five-letter words and checks if guesses are in that list

  - **Solution Fetching**: Retrieves the official daily solution from the NYT Wordle API for any given date

  - **Guess Evaluation**: Implements the authentic Wordle algorithm to determine which letters are correct (green), present but misplaced (yellow), or absent (gray)
</code></pre>
<p>  The frontend handles everything else: rendering the tile grid, managing game state, animating tile flips, tracking statistics in localStorage, and providing the interactive keyboard.</p>
  <figure class="my-8">
    <img src="/images/thoughts/wordle-recreation/game-interface.png" alt="Wordle game interface mid-game showing the tile grid and on-screen keyboard" class="w-[70%] md:w-[60%] lg:w-[50%] mx-auto" />
    <figcaption class="text-center text-sm text-taupe mt-2">The game interface with authentic Wordle mechanics and visual design</figcaption>
  </figure>

<p>  <strong>Tech stack</strong>: FastAPI backend, vanilla JavaScript frontend (no build tools), 12,966-word validation list from official Wordle source.</p>
<h2>Implementation: Key Features</h2>
<h3>Historical Puzzle Access</h3>
<p>  Select any date from June 19, 2021 onwards. The backend fetches that day&#39;s solution from the NYT Wordle API and loads it.</p>
<h3>Tile Editing</h3>
<p>  Click any tile in your current guess to select it, then type to replace that letter. The selected tile shows a thicker border. Backspace is smart: deletes the selected tile if filled, otherwise moves to the previous tile.</p>
  <figure class="my-8">
    <img src="/images/thoughts/wordle-recreation/tile-editing.png" alt="Wordle tile grid showing the selected tile with thicker border for editing" class="w-[70%] md:w-[60%] lg:w-[50%] mx-auto" />
    <figcaption class="text-center text-sm text-taupe mt-2">Click any tile to select and edit directly</figcaption>
  </figure>

  
<h3>Authentic Mechanics</h3>
<p>  The guess evaluation uses Wordle&#39;s two-pass algorithm: mark correct positions (green), then mark present letters (yellow), handling duplicates properly.</p>
<h2>The Oversight Problem</h2>
<p>  While writing this article, I discovered Claude Code had added a &quot;fallback algorithm&quot; I never asked for. If the NYT API is down, it silently substitutes a different word from the local list.</p>
<p>  I don&#39;t want this. If the API is down, the game should say so explicitly, not pretend everything is fine with a fake solution.</p>
<p>  This is the risk of AI-assisted development: the AI makes assumptions and adds &quot;helpful&quot; features that may not match your intent. You still need to review everything it produces. Fast iteration is valuable, but oversight is non-negotiable.</p>
<h2>Deployment</h2>
<p>  The game is live at <a href="https://wordle.kmaurinjones.dev" target="_blank" rel="noopener">wordle.kmaurinjones.dev</a>. It includes a disclaimer stating this is an educational project with no commercial intent and no NYT affiliation.</p>
<p>  Mobile optimizations include viewport scaling, touch action handling, and responsive layout. These emerged during testing rather than initial requirements.</p>
<h2>Conclusion</h2>
<p>  Built in one day using AI assistance. Solves the historical puzzle access problem. Demonstrates both the speed and risks of AI-assisted development.</p>
<h2>Links</h2>
<pre><code>  - **Play the Game**: [wordle.kmaurinjones.dev](https://wordle.kmaurinjones.dev)

  - **LinkedIn**: [linkedin.com/in/kmaurinjones](https://www.linkedin.com/in/kmaurinjones/)

  - **Email**: [kmaurinjones@gmail.com](mailto:kmaurinjones@gmail.com)
</code></pre>`}
</ArticleLayout>
