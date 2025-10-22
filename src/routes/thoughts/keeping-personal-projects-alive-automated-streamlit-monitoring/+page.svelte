<script lang="ts">
	import ArticleLayout from '$lib/components/ArticleLayout.svelte';

	const metadata = {
		title: 'Keeping Personal Projects Alive: Automated Streamlit Monitoring with Playwright',
		date: 'October 18, 2025',
		categories: ['Python', 'Streamlit', 'Playwright', 'Automation', 'DevOps', 'Web Scraping'],
		mediumUrl: ''
	};
</script>

<ArticleLayout
	title={metadata.title}
	date={metadata.date}
	categories={metadata.categories}
>
	<!-- Hero Image -->
	<figure class="my-8">
		<img
			src="/images/thoughts/keeping-personal-projects-alive-automated-streamlit-monitoring/hero.webp"
			alt="Abstract visualization of automated monitoring system keeping Streamlit apps awake"
			class="w-[70%] md:w-[60%] lg:w-[50%] mx-auto"
		/>
		<figcaption class="text-center text-sm text-taupe mt-2">
			Image by author. Generated using FLUX-1.1-Pro.
		</figcaption>
	</figure>

	<h2>Introduction</h2>

	<p>
		When I was applying for data science roles before landing my current position, I faced a problem that probably sounds familiar to anyone who's built portfolio projects on free-tier cloud services: my demos kept falling asleep at the worst possible times. I had built several Streamlit apps showcasing various AI and data science projects—everything from NLP tools to interactive data visualizations—and deployed them all on Streamlit Community Cloud's free tier. Simple deployment, zero hosting costs, perfect for a job seeker's budget. But there was a catch I hadn't fully appreciated until it became a recurring source of anxiety.
	</p>

	<p>
		Streamlit's free tier automatically puts apps to sleep after periods of inactivity. Makes perfect sense from their infrastructure perspective, but from mine? I kept having this recurring nightmare: a hiring manager clicks the portfolio link in my resume, sees a "sleeping app" message, and immediately moves on to the next candidate. First impressions matter tremendously in job searches, and a dead demo link feels worse than no demo at all. I needed these apps awake and responsive, especially during business hours when recruiters were most likely to be reviewing applications.
	</p>

	<p>
		So I built a solution: a headless browser automation script that automatically detects when my Streamlit apps are asleep and wakes them up before anyone notices. It runs three times daily via cron, sends me email reports so I know it's working, and costs me exactly nothing to operate. It's been running in production for over a year now, monitoring seven apps, and I haven't had a single embarrassing "sorry, the app is sleeping" moment in an interview since.
	</p>

	<h2>How Streamlit Sleep Works</h2>

	<p>
		Before explaining my solution, it's worth understanding exactly how Streamlit's sleep mechanism works. When an app on the free tier sits idle for a while, Streamlit's infrastructure puts it into a hibernation state to conserve resources. When someone visits a sleeping app, instead of seeing your beautifully crafted data visualization or interactive tool, they see a simple wakeup button. Clicking it triggers a container restart, which loads the app—but this takes several seconds, and let's be honest, how many busy hiring managers are going to wait around for that?
	</p>

	<p>
		What I discovered during my initial investigation is that this wakeup button has a consistent HTML test ID: <code>wakeup-button-viewer</code>. This became my lightbulb moment. If I could programmatically detect this button's presence on a page, I'd know the app was asleep. And if I could click it automatically, I could wake the app up before any real humans visited. Simple concept, but the implementation had some interesting challenges I'll get into shortly.
	</p>

	<h2>The Solution: Automated Monitoring</h2>

	<p>
		Once I had identified the wakeup button as my detection mechanism, the rest of the architecture fell into place fairly naturally. The script I built follows a straightforward workflow: read a list of URLs from a configuration file, launch a headless browser, visit each URL, check for the wakeup button, click it if present, and send me an email summary when it's done. Nothing revolutionary, but effective.
	</p>

	<p>
		I keep the configuration deliberately simple. App URLs live in a plain text file called <code>app_urls.txt</code>, one per line. Email credentials (Gmail SMTP) go in a <code>.env</code> file. Both are gitignored for obvious reasons. The beauty of this setup is that I can add or remove apps from monitoring by editing a single text file—no code changes required.
	</p>

	<h3>Core Detection Logic</h3>

	<p>Here's the wakeup detection and clicking mechanism:</p>

	<pre><code class="language-python">{`async def check_and_wake_app(url: str, actually_click: bool = False):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        try:
            await page.goto(url, wait_until="networkidle", timeout=60000)
            await page.wait_for_timeout(3000)  # Extra buffer

            # Check for wakeup button
            wakeup_button = await page.query_selector('[data-testid="wakeup-button-viewer"]')

            if wakeup_button:
                if actually_click:
                    await wakeup_button.click()
                    await page.wait_for_timeout(5000)

                    # Verify wake by checking if button disappeared
                    still_asleep = await page.query_selector('[data-testid="wakeup-button-viewer"]')
                    status = "asleep" if still_asleep else "woken_up"
                else:
                    status = "asleep"
            else:
                # App is awake, verify with creator avatar
                avatar = await page.query_selector('[data-testid="appCreatorAvatar"]')
                status = "awake" if avatar else "unknown"

            return {"url": url, "status": status, "timestamp": datetime.now()}

        except Exception as e:
            return {"url": url, "status": "error", "error": str(e)}
        finally:
            await browser.close()
`}</code></pre>

	<p>
		The <code>actually_click</code> parameter is worth mentioning—it enables a test mode where the script will detect sleeping apps but won't actually click the wakeup button. This turned out to be essential for debugging, since I learned the hard way that waking up all seven apps repeatedly while testing gets old fast. Being able to validate the detection logic without causing side effects saved me a lot of unnecessary app restarts.
	</p>

	<h3>Email Reporting</h3>

	<p>
		After the script checks all apps, it sends me an email summary breaking down successes and failures. This was a deliberate design choice—I wanted passive monitoring that didn't require me to SSH into a server and grep through logs every morning. The email gives me confidence that the system is working, and I only need to investigate if something actually goes wrong. In over a year of operation, I've maybe checked the logs three times, all for active development rather than troubleshooting production issues.
	</p>

	<pre><code class="language-python">{`def send_email_report(results: list[dict], completion_time: datetime):
    from_email = os.getenv("GMAIL_USER")
    app_password = os.getenv("GMAIL_APP_PASSWORD")

    if not from_email or not app_password:
        print("Missing email credentials, skipping report")
        return

    # Format results into success/failure sections
    successes = [r for r in results if r["status"] != "error"]
    failures = [r for r in results if r["status"] == "error"]

    body = f"Monitoring completed at {completion_time.strftime('%Y-%m-%d %H:%M:%S %Z')}\\n\\n"
    body += f"Successes: {len(successes)}\\n"
    for result in successes:
        body += f"  - {result['url']}: {result['status']}\\n"

    if failures:
        body += f"\\nFailures: {len(failures)}\\n"
        for result in failures:
            body += f"  - {result['url']}: {result.get('error', 'Unknown')}\\n"

    # Send via Gmail SMTP
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(from_email, app_password)
        server.send_message(msg)
`}</code></pre>

	<p>
		I use Gmail App Passwords for authentication rather than my main Google password. This works perfectly with 2FA and has the added benefit of being easily revocable if something goes wrong. I appreciate Google making this pattern the default—it's made my automation much less nerve-wracking.
	</p>

	<h2>The Great Selenium-to-Playwright Migration</h2>

	<p>
		Here's where things got interesting. My initial implementation used Selenium for browser automation, which seemed like the obvious choice—it's widely used, well-documented, and I'd worked with it before. But I kept running into this infuriating issue where headless Selenium would inconsistently detect the wakeup button. Sometimes it worked perfectly. Sometimes it failed to find a button that was clearly visible when I manually inspected the page. I spent days debugging this, convinced I had a race condition or was missing some wait condition.
	</p>

	<p>
		Turns out, not all headless browser environments are created equal. Different automation libraries interact with the DOM in subtly different ways, and Selenium's headless mode has some quirks around detecting dynamically rendered elements. After reading through a depressing number of Stack Overflow threads and GitHub issues, I decided to try switching to Playwright, mostly out of desperation.
	</p>

	<p>
		The problem immediately vanished. Playwright's headless Chromium detected the button reliably every single time. I was equal parts relieved and frustrated—relieved that I'd found a solution, frustrated that I'd burned several days on what turned out to be a "use a different tool" problem. The lesson here: browser automation tools aren't interchangeable, and sometimes the path of least resistance is just trying a different library rather than fighting with the one you started with.
	</p>

	<h2>Production Deployment</h2>

	<p>
		Getting this running in production was refreshingly straightforward. I set up a cron job to run the script three times daily: 6am, 12pm, and 6pm EST. I chose these times deliberately—they cover the typical workday window when recruiters and hiring managers are most likely to be reviewing applications. Early morning catches any apps that went to sleep overnight, midday handles the lunch slump, and evening ensures everything's alive for west coast reviewers.
	</p>

	<pre><code class="language-bash"># Streamlit app monitoring (6am, 12pm, 6pm EST)
0 6,12,18 * * * cd /path/to/streamlit-app-monitor && uv run python streamlit_app_monitor.py >> cron.log 2>&1
</code></pre>

	<p>
		I use <code>uv</code> for Python package management, which has been a game-changer for this kind of scheduled task. It handles virtual environments automatically, so I don't need to manually activate venvs in my crontab—just <code>uv run</code> and it takes care of the rest. One less thing to worry about at 6am when the job kicks off.
	</p>

	<p>
		The whole system is intentionally stateless. No database, no persistent storage beyond the email reports and a simple log file. This might seem limiting, but it's actually liberating—there's nothing to maintain, no schema migrations, no state to corrupt. The email reports tell me everything I need to know, and if I really need historical data for some reason, I have a year's worth of emails I can search through. Simplicity wins.
	</p>

	<h2>Trade-offs and Limitations</h2>

	<p>
		I want to be upfront about what this solution is and isn't. This is a very specific tool solving a very specific problem: keeping free-tier Streamlit apps awake without paying for hosting infrastructure. If I were willing to shell out for an EC2 instance and set up proper self-hosting, none of this would be necessary. But then I'd be dealing with load balancing, domain management, SSL certificates, and monthly AWS bills. For a job seeker trying to showcase portfolio projects, that's overkill. This script gave me the benefits of always-on apps at exactly zero cost.
	</p>

	<p>That said, there are definitely limitations worth acknowledging:</p>

	<ul>
		<li>It only works with Streamlit Community Cloud's specific sleep behavior. If they change how the wakeup button works tomorrow, this breaks.</li>
		<li>It requires Gmail for email reporting. I could make it more generic, but Gmail SMTP is free and reliable, so I haven't bothered.</li>
		<li>The timezone is hardcoded to America/New_York. This is purely because I'm in Eastern Time—there's no technical reason it couldn't be configurable.</li>
		<li>There's no metrics tracking or analytics dashboard. The email logs give me everything I need for seven apps, but this wouldn't scale to, say, a hundred apps without some architectural changes.</li>
	</ul>

	<p>
		The beauty of this approach is its extensibility. If I ever wanted to add proper metrics tracking, I could easily swap out the email reporting for CloudWatch logs, a database, or any other monitoring system. The core logic would stay the same. But for my use case—a handful of portfolio apps that just need to stay awake—simple email reports are perfect.
	</p>

	<h2>Results</h2>

	<p>
		It's been running in production for over a year now, with only a handful of days of downtime during active development when I was making changes. Seven apps, consistently awake, zero embarrassing "sorry, the app is sleeping" moments during job interviews. The peace of mind alone has been worth the time investment.
	</p>

	<p>
		The script has become so reliable that I honestly forget it exists most of the time. Every morning I get an email confirming everything ran successfully, I glance at it to make sure there are no errors, and I move on with my day. I've only needed to dig into the actual logs maybe three times in the entire year, and those were all during active development rather than real production issues.
	</p>

	<p>
		Would I build this again if I had to start over? Absolutely. The whole thing took maybe a week of intermittent work to get from concept to production, including the time I wasted fighting with Selenium. For something that runs autonomously and gives me confidence that my portfolio is always presentable, that's an excellent return on investment.
	</p>

	<h2>Conclusion</h2>

	<p>
		Sometimes the best engineering solutions aren't the most sophisticated ones—they're the ones that solve the actual problem you have with the minimum amount of complexity. A headless browser, a cron job, and an email report solved my sleeping app anxiety without requiring me to learn Kubernetes or set up monitoring dashboards or pay for hosting infrastructure.
	</p>

	<p>
		If you're in a similar situation—showcasing projects on free-tier services and worried about uptime—I'd encourage you to consider a similar approach. The core concept works for any service that has a predictable "wake up" mechanism, and the implementation is straightforward enough that you could probably build your own version in an afternoon. Just remember to use Playwright instead of Selenium and save yourself a few days of debugging frustration.
	</p>

	<h2>Links</h2>

	<ul>
		<li>
			<strong>GitHub Repository</strong>:
			<a
				href="https://github.com/kmaurinjones/streamlit-app-monitor"
				target="_blank"
				rel="noopener">streamlit-app-monitor</a
			>
		</li>
		<li>
			<strong>LinkedIn</strong>:
			<a
				href="https://www.linkedin.com/in/kmaurinjones/"
				target="_blank"
				rel="noopener">linkedin.com/in/kmaurinjones</a
			>
		</li>
		<li><strong>Email</strong>: <a href="mailto:kmaurinjones@gmail.com">kmaurinjones@gmail.com</a></li>
	</ul>
</ArticleLayout>
