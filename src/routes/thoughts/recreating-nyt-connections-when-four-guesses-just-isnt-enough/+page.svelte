<script lang="ts">
	import ArticleLayout from '$lib/components/ArticleLayout.svelte';

	const metadata = {
		title: "Recreating NYT Connections: When Four Guesses Just Isn't Enough",
		date: "October 17, 2025",
		categories: ["Game Development","FastAPI","SQLite","Web Development","Python"],
		mediumUrl: ""
	};
</script>

<ArticleLayout
	title={metadata.title}
	date={metadata.date}
	categories={metadata.categories}
>
	{@html `<h2>Why Build a Connections Clone?</h2>
<pre><code>My partner and I love the ritual of solving *NYT Connections* before bed. The only thing that ever
broke the streak was the four-strike limit. Once you miss four guesses, the puzzle ends and you never
learn what the groups were. To keep playing we would reopen incognito windows, reload the puzzle, and
burn through another set of guesses. That friction was enough to convince me to build my own
unlimited-guess version.
</code></pre>
<h2>Project Goals</h2>
<pre><code>- Recreate the core gameplay with the official daily puzzle feed.

- Remove the four-mistake cap so experimentation stays fun.

- Make historical puzzles easy to browse for practice.

- Ship quickly with a lightweight, maintainable stack.
</code></pre>
<h2>Technical Stack at a Glance</h2>
<pre><code>I used a minimal setup: FastAPI for the backend, SQLite for caching, and vanilla JavaScript on the
front end. The server fetches puzzle JSON from the New York Times, stores it locally for quick repeat
loads, and serves a single static HTML file. No frameworks or build pipeline required.
</code></pre>
<h3>Key Backend Endpoint</h3>
<p>  \`@app.get(&quot;/api/puzzle/&#123;date&#125;&quot;)
async def get_puzzle(date: str):
    cached = get_puzzle_from_db(date)
    if cached:
        return JSONResponse(content=cached)</p>
<pre><code>async with httpx.AsyncClient() as client:
    base_url = &quot;https://www.nytimes.com/svc/connections/v2/&quot;
    response = await client.get(f&quot;&amp;#123;base_url&amp;#125;&amp;#123;date&amp;#125;.json&quot;)
    puzzle_data = response.json()

save_puzzle_to_db(date, puzzle_data)
return JSONResponse(content=puzzle_data)\`&lt;/pre&gt;
</code></pre>
  <p>
    SQLite keeps the hosting story simple—everything runs from a single file database—while FastAPI's
    async support makes fetching new puzzles fast.
  

  
<h2>Front-End Experience</h2>
<pre><code>The client lives in one HTML file with focused JavaScript modules. State is plain objects, and the
logic mirrors the official rules. Tailwind utility classes handle responsive layout without adding a
build step.
</code></pre>
  <figure class="my-8">
    <img src="/images/thoughts/connections-recreation/date-picker.webp"
       alt="Calendar date picker interface for selecting historical Connections puzzles"
       class="w-full mx-auto rounded-lg" />
    <figcaption class="text-center text-sm text-taupe mt-2">Historical puzzle browser with calendar picker</figcaption>
  </figure>

  
<h3>Unlimited Guesses by Design</h3>
<pre><code>Instead of tracking mistakes and forcing a failure screen, the app just increments an attempt counter.
You can still stop after four misses if you want the original tension, but the game never locks you
out of learning the categories.
</code></pre>
<h3>Historical Puzzle Browser</h3>
<pre><code>A simple calendar component requests any published puzzle from the backend, which made it easy to
revisit favourites and test strategies without waiting for the next day&#39;s release.
</code></pre>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
    <figure>
      <img src="/images/thoughts/connections-recreation/original-game-mobile.webp"
         alt="Original NYT Connections game on mobile showing four-strike limit"
         class="w-full rounded-lg" />
      <figcaption class="text-center text-sm text-taupe mt-2">Original game with four-strike limit</figcaption>
    </figure>
    <figure>
      <img src="/images/thoughts/connections-recreation/my-game-mobile.webp"
         alt="Custom Connections clone on mobile with unlimited guesses"
         class="w-full rounded-lg" />
      <figcaption class="text-center text-sm text-taupe mt-2">Unlimited-guess clone</figcaption>
    </figure>
  </div>

  
<h3>Setting Expectations</h3>
<pre><code>First-time visitors see a small disclaimer clarifying that the project is an educational recreation
with no NYT affiliation. The acknowledgement lives in \`localStorage\`, so it only pops up once per
browser session.
</code></pre>
  <figure class="my-8">
    <img src="/images/thoughts/connections-recreation/disclaimer-modal.webp"
       alt="Disclaimer modal informing users this is an unofficial educational project"
       class="w-full md:w-3/4 mx-auto rounded-lg" />
    <figcaption class="text-center text-sm text-taupe mt-2">First-time visitor disclaimer</figcaption>
  </figure>

  
<h2>Try It Yourself</h2>
<pre><code>The app is live at [connections.kmaurinjones.dev](https://connections.kmaurinjones.dev). The code
still lives in a private repo while I continue to tidy it up, but the playable version is available
if you want to give it a spin.
</code></pre>`}
</ArticleLayout>
