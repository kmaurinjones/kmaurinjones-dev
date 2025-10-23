<script lang="ts">
	import ArticleLayout from '$lib/components/ArticleLayout.svelte';

	const metadata = {
		title: "Building a Power-User Claude Code Setup",
		date: "October 23, 2025",
		categories: ["Claude Code", "Developer Tools", "Productivity", "Automation", "Configuration"],
		mediumUrl: ""
	};
</script>

<ArticleLayout
	title={metadata.title}
	date={metadata.date}
	categories={metadata.categories}
>
	<!-- Hero Image -->
	<figure class="my-8">
		<img src="/images/thoughts/building-a-power-user-claude-code-setup/hero.png"
			 alt="Modern illustration of a developer workspace showing automation and productivity with terminal windows, configuration files, and workflow diagrams"
			 class="w-[70%] md:w-[60%] lg:w-[50%] mx-auto" />
		<figcaption class="text-center text-sm text-taupe mt-2">
			Image by author. Generated using FLUX-1.1-Pro-Ultra.
		</figcaption>
	</figure>

	<h2>Introduction: From Trial and Error to Automation</h2>

	<p>I've spent the better part of a year fine-tuning how I work with Claude Code. Not because I enjoy tinkering with configs (though I won't deny that), but because I kept running into the same friction points. I'd catch myself repeating the same instructions across projects. I'd forget to check for fallback patterns in my code. I'd accidentally use <code>pip</code> instead of <code>uv</code> and have to rerun commands.</p>

	<p>The solution wasn't just writing better prompts—it was building a system that encodes my preferences, automates repeated workflows, and catches mistakes before they compound. This article breaks down how I've structured my Claude Code setup at both the global and project levels, covering CLAUDE.md instructions, slash commands, hooks, and skills.</p>

	<h2>The Foundation: CLAUDE.md</h2>

	<p>The <code>CLAUDE.md</code> file is where you define instructions that Claude Code follows every time it starts a session. I maintain two levels:</p>

	<p><strong>Global</strong> (<code>~/.claude/CLAUDE.md</code>): Universal rules that apply to every project I work on. This includes my coding philosophy (use <code>uv</code> for Python packages, never use fallbacks, always run scripts in background), my default tech stack (Next.js 15, FastAPI, PostgreSQL), and tone preferences (anti-sycophancy, no filler phrases).</p>

	<p><strong>Project-Specific</strong> (<code>.claude/CLAUDE.md</code> in each repo): Overrides and additions relevant to that codebase. For this portfolio site, I specify the SvelteKit architecture, Tailwind v4 theming, navigation structure, and git workflow (never push without approval). I also include article writing guidelines and changelog management rules.</p>

	<p>The key insight: global rules handle patterns that repeat across all my work. Project rules handle the unique context of that specific codebase. This separation means I don't redefine "always use <code>uv</code>" in every project, but I can still customize behavior when needed.</p>

	<h2>Slash Commands: Workflow Automation</h2>

	<p>Slash commands are custom shortcuts that expand into full prompts. I use them to automate workflows I repeat frequently.</p>

	<p><strong>Global Commands</strong> (8 total):</p>
	<ul>
		<li><code>/start-working-session</code>: Creates or updates a session log file in <code>sessions/YYYY-MM-DD.md</code>, reads the previous session's "Next Session" notes, and asks what I want to work on</li>
		<li><code>/finish-working-session</code>: Summarizes work done, writes it to the session file, and suggests next steps</li>
		<li><code>/run-until-it-works</code>: Runs a script in a loop, checking output for errors, fixing them, and retrying until it completes without warnings or errors</li>
		<li><code>/git-catch-up</code>: Reviews git history since my last session and summarizes what changed</li>
	</ul>

	<p>These are vague enough to apply anywhere but specific enough to save time. I don't have to explain "create a session log" in every project—I just type <code>/start-working-session</code> and it handles the pattern.</p>

	<p><strong>Project Commands</strong> (3 for this portfolio):</p>
	<ul>
		<li><code>/new-article</code>: Full workflow for writing, formatting, and testing a new blog post (including this one!)</li>
		<li><code>/new-project-entry</code>: Creates project showcase cards with images, summaries, and links</li>
		<li><code>/browser-test-local</code>: Automates Chrome DevTools testing of the local dev server</li>
	</ul>

	<p>Project commands are highly specific to this codebase. They know about my article structure, image attribution requirements, and testing needs.</p>

	<h2>Hooks: Automatic Enforcement</h2>

	<p>Hooks run automatically when specific events occur. They enforce preferences without me having to remember them.</p>

	<h3>Global Hooks</h3>

	<p>The <code>block_pip_python.py</code> hook prevents me from using <code>pip</code> or <code>python script.py</code>:</p>

	<pre><code class="language-python">PIP_PAT = r"^\s*(python\s+-m\s+)?pip(\d*(\.\d+)*)?\b"
PYTHON_PY_PAT = r"^\s*python\b.*\.py\b"

if tool == "Bash":
    if re.match(PIP_PAT, cmd):
        print("`pip` is disabled. Use `uv pip` or `uv add` instead.", file=sys.stderr)
        sys.exit(2)
    elif re.match(PYTHON_PY_PAT, cmd):
        print("`python` cannot be used. Use `uv run x.py` instead.", file=sys.stderr)
        sys.exit(2)</code></pre>

	<p>The <code>combined_check.py</code> hook scans code for fallback patterns (<code>.get()</code>, <code>or</code> defaults, etc.) and runs linters:</p>

	<pre><code class="language-python">patterns = [
    (r'\.get\([^,)]+,[^)]+\)', '.get() with default value'),
    (r'(=|return)\s+\w+\s+or\s+', 'x or y fallback pattern'),
    (r'\.fillna\(', 'pandas fillna()'),
]

for pattern, description in patterns:
    matches = list(re.finditer(pattern, content))
    if matches:
        # Warn about each instance with line numbers</code></pre>

	<p>I'm a data scientist—fallbacks hide missing data and cause silent failures. This hook catches them immediately.</p>

	<h3>Project Hooks</h3>

	<p>The <code>writing_guidelines_enforcer.py</code> hook detects when I'm editing an article and reminds me to follow the writing guidelines:</p>

	<pre><code class="language-python">is_article = (
    "src/routes/thoughts" in str(file_path) and
    file_path.name == "+page.svelte"
)

if is_article:
    print("You are editing an article. Follow .github/WRITING_GUIDELINES.md", file=sys.stderr)
    print("Check: voice, structure, audience, formatting, attribution", file=sys.stderr)</code></pre>

	<p>This ensures consistency across all published content.</p>

	<h2>Skills: Modular Capabilities</h2>

	<p>Skills are reusable agents that activate based on triggers. I have 5 at the global level:</p>

	<ul>
		<li><strong>parallel-executor</strong>: Detects when multiple tasks can run concurrently and parallelizes them</li>
		<li><strong>stack-scaffolder</strong>: Scaffolds new projects with my default tech stack</li>
		<li><strong>linting-enforcer</strong>: Runs Ruff/ESLint after code changes</li>
		<li><strong>docs-maintainer</strong>: Creates and maintains technical documentation</li>
		<li><strong>standards-enforcer</strong>: Analyzes codebase patterns before making changes to ensure consistency</li>
	</ul>

	<p>These activate automatically (e.g., linting after edits) or on user request (e.g., "scaffold a new project").</p>

	<h2>Impact: Time Savings and Consistency</h2>

	<p>The biggest win isn't raw time saved—it's mental overhead eliminated. I don't have to remember "always use <code>uv</code>" or "check for fallbacks" or "follow article guidelines." The system enforces it automatically.</p>

	<p>Concrete example: writing this article. I ran <code>/new-article</code>, answered questions about content and metadata, and Claude handled directory creation, image generation, file formatting, browser testing, and articles.json updates. What used to take 30 minutes of manual setup now takes 5 minutes of answering prompts.</p>

	<p>The session logs have been invaluable for context switching. I can drop a project for weeks, run <code>/start-working-session</code>, and immediately know where I left off.</p>

	<h2>Philosophy: Encode Preferences, Automate Repetition</h2>

	<p>If I find myself giving the same instruction three times across different projects, it becomes a global rule. If I repeat a workflow twice in the same project, it becomes a slash command. If I catch the same mistake twice, it becomes a hook.</p>

	<p>This setup evolved through trial and error. I didn't design it upfront—I built it iteratively as I identified pain points. The result is a system that feels like an extension of how I already work, just faster and more consistent.</p>

	<p>If you're building your own setup, start small. Add one global rule. Create one slash command for a workflow you repeat. Write one hook for a mistake you keep making. The system will grow naturally from there.</p>

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
	</ul>
</ArticleLayout>
