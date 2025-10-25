<script lang="ts">
	import ArticleLayout from '$lib/components/ArticleLayout.svelte';

	const metadata = {
		title: "Building a Power-User Claude Code Setup",
		date: "October 23, 2025",
		categories: ["Claude Code","Developer Tools","Productivity","Automation","Configuration"],
		mediumUrl: ""
	};
</script>

<ArticleLayout
	title={metadata.title}
	date={metadata.date}
	categories={metadata.categories}
>
	{@html `<figure class="my-8">
  <img src="/images/thoughts/building-a-power-user-claude-code-setup/hero.png"
       alt="Modern illustration of a developer workspace showing automation and productivity with terminal windows, configuration files, and workflow diagrams"
       class="w-[70%] md:w-[60%] lg:w-[50%] mx-auto" />
  <figcaption class="text-center text-sm text-taupe mt-2">
    Image by author. Generated using FLUX-1.1-Pro-Ultra using <a href="https://github.com/kmaurinjones/flux-mcp" target="_blank" rel="noopener">flux-mcp</a>.
  </figcaption>
</figure>

<h2>Balancing Scale &amp; Quality</h2>
<p>I&#39;ve spent the better part of a year thinking about how I work with agentic coding systems like Claude Code, Cursor, and Codex. Claude Code happens to be my primary tool right now, but these principles tend to transfer to any major closed or open source agentic coding platform, as, due to competition alone, they tend to have similar features and functionality.</p>
<p>There&#39;s no question about the increase in volume of code that can be written with these tools. They can generate tokens at a rate faster than any human can possibly type. The challenge is to develop systems that balance speed and quality. The number of lines of code an operator can produce with these tools means nothing if the quality is poor.</p>
<p>When you work with agentic tools everyday, patterns emerge, largely due to the distribution of pretraining data, post-training, and reinforcement learning. In practice, this means that these systems will often perform better in whatever coding languages, versions, and standards are popular in the data on which they were trained. Currently (October, 2025), this means that languages like Python and JavaScript are among the best represented coding languages in most models&#39; training data, and the versions of these languages from the recent past are among the best represented versions.</p>
<p>This currently tends to work in our favour, but as time goes on and these languages are updated, there becomes a larger and larger gap between the models&#39; knowledge of the current version of the language, and the one most represented in its training data. This is purely a function of the underlying statistical generations mechanisms upon which these models are built. At inference time, the model&#39;s generation will reach for code that it has seen during training (i.e. an &#39;older&#39; version of the language) sooner than it will the current - a &#39;newer&#39; - version.</p>
<p>The solution isn&#39;t better prompts. It&#39;s <em>more intentional</em> prompts and context management, and the self-awareness to reflect on one&#39;s own preferences and habits, around which to build a system that works for these patterns. This article breaks down how I&#39;ve built a system that encodes my preferences, enforces conventions, and automates workflows across my projects—making the AI work the way I need it to, and not the other way around.</p>
<h2>Guidelines</h2>
<p>Every agentive tool has some sort of system instructions-type file. Claude Code has <code>CLAUDE.md</code>. The <code>CLAUDE.md</code> file is where you define instructions that Claude Code follows every time it starts a session. I actively maintain two levels:</p>
<p><strong>Global</strong> (<code>~/.claude/CLAUDE.md</code>): Universal rules that apply to every project I work on. This includes my coding philosophy (use <code>uv</code> for Python packages, avoiding excessive fallback logic like <code>.get()</code> and <code>try</code> catches, always run scripts in background), my default tech stack (Next.js 15, FastAPI, PostgreSQL), and tone preferences (anti-sycophancy, no filler phrases).</p>
<p><strong>Project-Specific</strong> (<code>.claude/CLAUDE.md</code> in each repo): Overrides and additions relevant to that codebase. For this portfolio site, I specify the SvelteKit architecture, Tailwind v4 theming, navigation structure, and my preferred git workflow (never push without approval). I also include article writing guidelines and changelog management rules.</p>
<p>I use global rules on my system to handle patterns that repeat across all my work. Project-specific rules handle the unique context of a specific codebase. This separation means I don&#39;t need to redefine &quot;always use <code>uv</code>&quot; in every project, but I can still customize behavior when needed.</p>
<h2>Slash Commands: Workflow Automation</h2>
<p>Slash commands are custom shortcuts that expand into full prompts. I use them to automate workflows I repeat frequently.</p>
<p><strong>Global Commands</strong> (8 total):</p>
<ul>
<li><code>/start-working-session</code>: Creates or updates a session log file in the project-local <code>sessions/YYYY-MM-DD.md</code>, reads the previous session&#39;s &quot;Next Session&quot; notes, and asks what I want to work on</li>
<li><code>/finish-working-session</code>: Summarizes work done, writes it to the session file, and suggests next steps. This and the <code>/start-working-session</code> are recent additions that I&#39;ve been enjoying, as this keeps a sort of &#39;brain dump&#39; running log of work done in a project as I work, rather than only being the polished version seen in the developer and public CHANGELOG.md files. </li>
<li><code>/run-until-it-works</code>: Runs a script in a loop, checking output for errors, fixing them, and retrying until it completes without warnings or errors. Prompt-driven rather than scripted, this command strongly instructs the agent to keep looping this process until the indicated operation(s) succeed(s).</li>
<li><code>/git-catch-up</code>: Reviews git history since my last commit, adds and commits new changes (with any constraints I can optionally specify at command runtime), and increments a project-specific version number. In the case of this website, this also increments the version number on the footer of the site. The version increment also serves as a simple way for me to ger reassurance that pushes have successfully redeployed in my CI/CD pipeline.</li>
</ul>
<p>These are vague enough to apply anywhere but specific enough to save time. I don&#39;t have to explain &quot;create a session log&quot; in every project—I just type <code>/start-working-session</code> and it handles the pattern.</p>
<p><strong>Project-Specific Commands</strong> (examples from this website):</p>
<ul>
<li><code>/new-article</code>: Full workflow for writing, formatting, and testing a new blog post (including this one!). This specifies style, tone, length, metadata, image attributions, and other preferences to ensure consistency across the content I publish on the site. This helps to develop personal branding and consistency across my content, to make it feel as familiar as possible for anyone reading it over time. This means I can spend more time reviewing and editing content rather than writing it from scratch, saving me lots of time.</li>
<li><code>/new-project-entry</code>: Creates project showcase cards with images, summaries, and links. This drafts the cards in the <code>/projects</code> site route, which - like the above - allows me to edit them, more than having to write them from scratch every time.</li>
<li><code>/browser-test-local</code>: Specific instructions about running dev locally, spinning up the Chrome DevTools MCP by Google, visiting the locally hosted site URL, testing to ensure proper loading, rendering, and functionality of all site content, and testing these in both desktop and mobile views in the Chromium browser. If any errors show up, they are then well-documented in the session log for easy reference and resolution after the test run (which of course I typically hand off to a coding agent as a task to be completed).</li>
</ul>
<h2>Hooks: Automatic Enforcement</h2>
<p>Hooks are event-triggered operations. They enforce conventions on AI-generated code without requiring constant vigilance or repeated instructions.</p>
<h3>Global Hooks</h3>
<p>As mentioned earlier, due to the statistical nature of LLMs to lean on pretraing data more than data given to them at inference, they have no capacity to know &#39;today&#39;s date&#39; unless explicitly given to them. This also means that if you ask an LLM what today&#39;s date is, they will often given you some date around their pretraining data cutoff. Currently (as of October, 2025), this is roughly mid-2024. This becomes problematic when getting an LLM to search for anything contemporary; from news and real-world events, to updated documentation for a popular library. To mitigate this, one of my favourite and simplest hooks is the following (found in my <code>~/.claude/settings.json</code> file so it is triggered in all of my Claude Code sessions at session start):</p>
<pre><code class="language-json">{
  &quot;hooks&quot;: {
    &quot;SessionStart&quot;: [
      {
        &quot;hooks&quot;: [
          {
            &quot;type&quot;: &quot;command&quot;,
            &quot;command&quot;: &quot;date &#39;+Today is %A, %B %e, %Y (%Z).&#39;&quot;
          },
        ]
      }
    ]
  }
}
</code></pre>
<p>This hook runs at the start of every session, and prints the current date and time to the console, so that even before my first message is sent to Claude Code, it has context of today&#39;s date. By having this information, Claude Code is able to explictly have awareness of relevant timeframes, and will use this information in any web searches, code generation, or other operations that require it.</p>
<h3>Project-Specific Hooks</h3>
<p>In the codebase for this website, I have a <code>writing_guidelines_enforcer.py</code> script, triggered as a Claude Code hook that is triggered when Claude Code is about to edit any file within one of a few directories that contain content for any of my articles, prompting and reminding it to again check the writing guidelines before proceeding:</p>
<pre><code class="language-python">is_article = (
    &quot;src/routes/thoughts&quot; in str(file_path) and
    file_path.name == &quot;+page.svelte&quot;
)

if is_article:
    print(&quot;You are editing an article. Follow .github/WRITING_GUIDELINES.md&quot;, file=sys.stderr)
    print(&quot;Check: voice, structure, audience, formatting, attribution&quot;, file=sys.stderr)
</code></pre>
<p>This doesn&#39;t guarantee anything one way or another, but in the same way that a person&#39;s own subjective opinion on an article might vary from day to day, the reminder for Claude Code to check the writing guidelines before proceeding is a simple way to mitigate the risk of it going off the rails and completely changing existing or new copy, at each moment when it makes an edit.</p>
<h2>Skills: Modular Capabilities</h2>
<p>Skills are reusable agents that activate based on triggers. I have 5 at the global level:</p>
<ul>
<li><strong>parallel-executor</strong>: Detects when multiple tasks can run concurrently and parallelizes them</li>
<li><strong>stack-scaffolder</strong>: Scaffolds new projects with my default tech stack</li>
<li><strong>linting-enforcer</strong>: Runs Ruff/ESLint after code changes</li>
<li><strong>docs-maintainer</strong>: Creates and maintains technical documentation</li>
<li><strong>standards-enforcer</strong>: Analyzes codebase patterns before making changes to ensure consistency</li>
</ul>
<p>These activate automatically (e.g., linting after edits) or on user request (e.g., &quot;scaffold a new project&quot;).</p>
<h2>Impact: Time Savings and Consistency</h2>
<p>The biggest win isn&#39;t raw time saved—it&#39;s not having to babysit the AI as much. I don&#39;t need to check every generated file for <code>.get()</code> calls or remind Claude to use <code>uv</code> for the tenth time. The system catches these patterns automatically.</p>
<p>Concrete example: writing this article. I ran <code>/new-article</code>, answered questions about content and metadata, and Claude handled directory creation, image generation, file formatting, browser testing, and articles.json updates. What used to take tens of minutes of manual setup now takes only a few minutes of answering prompts—and I can trust the output because my custom scaffolding enforces validation to a large degree before I even review the output.</p>
<p>The session logs have been invaluable for context switching. I can drop a project for weeks, run <code>/start-working-session</code>, and immediately know where I left off without re-explaining the entire project context, or even having to think back for myself to exactly what I was working on.</p>
<h2>Philosophy: Encode Preferences, Automate Repetition</h2>
<p>If I give the same instruction three times across different projects, it becomes a global rule. If I repeat a workflow twice in the same project, it becomes a slash command. If the AI makes the same mistake twice, it becomes a hook.</p>
<p>This setup evolved through trial and error. I didn&#39;t design it upfront—I built it iteratively as I identified patterns in how AI tools behave. The result is infrastructure that makes agentic coding tools work the way I need them to, not the other way around.</p>
<p>If you&#39;re building your own setup, start small. Notice patterns in your workflow that are conceptually templatable. Create global rules for things that are repeated across projects, and project-specific rules for things that are repeated within and unique to a particular project. Create slash commands for workflows you do often. Write hooks for things that you want to be triggered automatically and deterministically. The system will grow naturally from there.</p>
<h2>Learn More</h2>
<p>For detailed documentation on each feature mentioned in this article, check out the official Claude Code docs:</p>
<ul>
<li><strong>CLAUDE.md</strong>: <a href="https://docs.claude.com/en/docs/claude-code/overview" target="_blank" rel="noopener">Claude Code Overview</a> - Learn how to structure global and project-specific instructions</li>
<li><strong>Slash Commands</strong>: <a href="https://docs.claude.com/en/docs/claude-code/slash-commands" target="_blank" rel="noopener">Slash Commands Documentation</a> - Create custom commands with frontmatter, arguments, and permissions</li>
<li><strong>Hooks</strong>: <a href="https://docs.claude.com/en/docs/claude-code/hooks-guide" target="_blank" rel="noopener">Hooks Guide</a> - Automate workflows with PreToolUse, PostToolUse, SessionStart, and other lifecycle events</li>
<li><strong>Skills</strong>: <a href="https://docs.claude.com/en/docs/claude-code/skills" target="_blank" rel="noopener">Agent Skills</a> - Package expertise into modular, model-invoked capabilities</li>
<li><strong>Configuration</strong>: <a href="https://docs.claude.com/en/docs/claude-code/settings" target="_blank" rel="noopener">Settings Documentation</a> - Configure permissions, environment variables, and project settings</li>
</ul>
<h2>Links</h2>
<ul>
<li><strong>LinkedIn</strong>: <a href="https://www.linkedin.com/in/kmaurinjones/" target="_blank" rel="noopener">linkedin.com/in/kmaurinjones</a></li>
<li><strong>Email</strong>: <a href="mailto:kmaurinjones@gmail.com">kmaurinjones@gmail.com</a></li>
</ul>`}
</ArticleLayout>
