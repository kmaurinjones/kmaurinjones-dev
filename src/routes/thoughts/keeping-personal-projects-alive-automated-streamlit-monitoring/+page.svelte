<script lang="ts">
	import ArticleLayout from '$lib/components/ArticleLayout.svelte';

	const metadata = {
		title: "Keeping Personal Projects Alive: Automated Streamlit Monitoring with Playwright",
		date: "October 18, 2025",
		categories: ["Python","Streamlit","Playwright","Automation","DevOps","Web Scraping"],
		mediumUrl: ""
	};
</script>

<ArticleLayout
	title={metadata.title}
	date={metadata.date}
	categories={metadata.categories}
>
	{@html `<figure class="my-8">
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
<pre><code>	When I was applying for data science roles before landing my current position, I faced a problem that probably sounds familiar to anyone who&#39;s built portfolio projects on free-tier cloud services: my demos kept falling asleep at the worst possible times. I had built several Streamlit apps showcasing various AI and data science projects—everything from NLP tools to interactive data visualizations—and deployed them all on Streamlit Community Cloud&#39;s free tier. Simple deployment, zero hosting costs, perfect for a job seeker&#39;s budget. But there was a catch I hadn&#39;t fully appreciated until it became a recurring source of anxiety.



	Streamlit&#39;s free tier automatically puts apps to sleep after periods of inactivity. Makes perfect sense from their infrastructure perspective, but from mine? I kept having this recurring nightmare: a hiring manager clicks the portfolio link in my resume, sees a &quot;sleeping app&quot; message, and immediately moves on to the next candidate. First impressions matter tremendously in job searches, and a dead demo link feels worse than no demo at all. I needed these apps awake and responsive, especially during business hours when recruiters were most likely to be reviewing applications.



	So I built a solution: a headless browser automation script that automatically detects when my Streamlit apps are asleep and wakes them up before anyone notices. It runs three times daily via cron, sends me email reports so I know it&#39;s working, and costs me exactly nothing to operate. It&#39;s been running in production for over a year now, monitoring seven apps, and I haven&#39;t had a single embarrassing &quot;sorry, the app is sleeping&quot; moment in an interview since.
</code></pre>
<h2>How Streamlit Sleep Works</h2>
<pre><code>	Before explaining my solution, it&#39;s worth understanding exactly how Streamlit&#39;s sleep mechanism works. When an app on the free tier sits idle for a while, Streamlit&#39;s infrastructure puts it into a hibernation state to conserve resources. When someone visits a sleeping app, instead of seeing your beautifully crafted data visualization or interactive tool, they see a simple wakeup button. Clicking it triggers a container restart, which loads the app—but this takes several seconds, and let&#39;s be honest, how many busy hiring managers are going to wait around for that?



	What I discovered during my initial investigation is that this wakeup button has a consistent HTML test ID: \`wakeup-button-viewer\`. This became my lightbulb moment. If I could programmatically detect this button&#39;s presence on a page, I&#39;d know the app was asleep. And if I could click it automatically, I could wake the app up before any real humans visited. Simple concept, but the implementation had some interesting challenges I&#39;ll get into shortly.
</code></pre>
<h2>The Solution: Automated Monitoring</h2>
<pre><code>	Once I had identified the wakeup button as my detection mechanism, the rest of the architecture fell into place fairly naturally. The script I built follows a straightforward workflow: read a list of URLs from a configuration file, launch a headless browser, visit each URL, check for the wakeup button, click it if present, and send me an email summary when it&#39;s done. Nothing revolutionary, but effective.



	I keep the configuration deliberately simple. App URLs live in a plain text file called \`app_urls.txt\`, one per line. Email credentials (Gmail SMTP) go in a \`.env\` file. Both are gitignored for obvious reasons. The beauty of this setup is that I can add or remove apps from monitoring by editing a single text file—no code changes required.
</code></pre>
<h3>Core Detection Logic</h3>
<pre><code>Here&#39;s the wakeup detection and clicking mechanism:

\`{\`async def check_and_wake_app(url: str, actually_click: bool = False):
async with async_playwright() as p:
    browser = await p.chromium.launch(headless=True)
    page = await browser.new_page()

    try:
        await page.goto(url, wait_until=&quot;networkidle&quot;, timeout=60000)
        await page.wait_for_timeout(3000)  # Extra buffer

        # Check for wakeup button
        wakeup_button = await page.query_selector(&#39;[data-testid=&quot;wakeup-button-viewer&quot;]&#39;)

        if wakeup_button:
            if actually_click:
                await wakeup_button.click()
                await page.wait_for_timeout(5000)

                # Verify wake by checking if button disappeared
                still_asleep = await page.query_selector(&#39;[data-testid=&quot;wakeup-button-viewer&quot;]&#39;)
                status = &quot;asleep&quot; if still_asleep else &quot;woken_up&quot;
            else:
                status = &quot;asleep&quot;
        else:
            # App is awake, verify with creator avatar
            avatar = await page.query_selector(&#39;[data-testid=&quot;appCreatorAvatar&quot;]&#39;)
            status = &quot;awake&quot; if avatar else &quot;unknown&quot;

        return {&quot;url&quot;: url, &quot;status&quot;: status, &quot;timestamp&quot;: datetime.now()}

    except Exception as e:
        return {&quot;url&quot;: url, &quot;status&quot;: &quot;error&quot;, &quot;error&quot;: str(e)}
    finally:
        await browser.close()
</code></pre>
<p><code>}</code></pre></p>
<pre><code>&lt;p&gt;
	The \`actually_click\` parameter is worth mentioning—it enables a test mode where the script will detect sleeping apps but won&#39;t actually click the wakeup button. This turned out to be essential for debugging, since I learned the hard way that waking up all seven apps repeatedly while testing gets old fast. Being able to validate the detection logic without causing side effects saved me a lot of unnecessary app restarts.
</code></pre>
<h3>Email Reporting</h3>
<pre><code>	After the script checks all apps, it sends me an email summary breaking down successes and failures. This was a deliberate design choice—I wanted passive monitoring that didn&#39;t require me to SSH into a server and grep through logs every morning. The email gives me confidence that the system is working, and I only need to investigate if something actually goes wrong. In over a year of operation, I&#39;ve maybe checked the logs three times, all for active development rather than troubleshooting production issues.


\`{\`def send_email_report(results: list[dict], completion_time: datetime):
from_email = os.getenv(&quot;GMAIL_USER&quot;)
app_password = os.getenv(&quot;GMAIL_APP_PASSWORD&quot;)

if not from_email or not app_password:
    print(&quot;Missing email credentials, skipping report&quot;)
    return

# Format results into success/failure sections
successes = [r for r in results if r[&quot;status&quot;] != &quot;error&quot;]
failures = [r for r in results if r[&quot;status&quot;] == &quot;error&quot;]

body = f&quot;Monitoring completed at {completion_time.strftime(&#39;%Y-%m-%d %H:%M:%S %Z&#39;)}\\n\\n&quot;
body += f&quot;Successes: {len(successes)}\\n&quot;
for result in successes:
    body += f&quot;  - {result[&#39;url&#39;]}: {result[&#39;status&#39;]}\\n&quot;

if failures:
    body += f&quot;\\nFailures: {len(failures)}\\n&quot;
    for result in failures:
        body += f&quot;  - {result[&#39;url&#39;]}: {result.get(&#39;error&#39;, &#39;Unknown&#39;)}\\n&quot;

# Send via Gmail SMTP
with smtplib.SMTP(&quot;smtp.gmail.com&quot;, 587) as server:
    server.starttls()
    server.login(from_email, app_password)
    server.send_message(msg)
</code></pre>
<p><code>}</code></pre></p>
<pre><code>&lt;p&gt;
	I use Gmail App Passwords for authentication rather than my main Google password. This works perfectly with 2FA and has the added benefit of being easily revocable if something goes wrong. I appreciate Google making this pattern the default—it&#39;s made my automation much less nerve-wracking.
</code></pre>
<h2>The Great Selenium-to-Playwright Migration</h2>
<pre><code>	Here&#39;s where things got interesting. My initial implementation used Selenium for browser automation, which seemed like the obvious choice—it&#39;s widely used, well-documented, and I&#39;d worked with it before. But I kept running into this infuriating issue where headless Selenium would inconsistently detect the wakeup button. Sometimes it worked perfectly. Sometimes it failed to find a button that was clearly visible when I manually inspected the page. I spent days debugging this, convinced I had a race condition or was missing some wait condition.



	Turns out, not all headless browser environments are created equal. Different automation libraries interact with the DOM in subtly different ways, and Selenium&#39;s headless mode has some quirks around detecting dynamically rendered elements. After reading through a depressing number of Stack Overflow threads and GitHub issues, I decided to try switching to Playwright, mostly out of desperation.



	The problem immediately vanished. Playwright&#39;s headless Chromium detected the button reliably every single time. I was equal parts relieved and frustrated—relieved that I&#39;d found a solution, frustrated that I&#39;d burned several days on what turned out to be a &quot;use a different tool&quot; problem. The lesson here: browser automation tools aren&#39;t interchangeable, and sometimes the path of least resistance is just trying a different library rather than fighting with the one you started with.
</code></pre>
<h2>Production Deployment</h2>
<pre><code>	Getting this running in production was refreshingly straightforward. I set up a cron job to run the script three times daily: 6am, 12pm, and 6pm EST. I chose these times deliberately—they cover the typical workday window when recruiters and hiring managers are most likely to be reviewing applications. Early morning catches any apps that went to sleep overnight, midday handles the lunch slump, and evening ensures everything&#39;s alive for west coast reviewers.


\`# Streamlit app monitoring (6am, 12pm, 6pm EST)
</code></pre>
<p>0 6,12,18 * * * cd /path/to/streamlit-app-monitor &amp;&amp; uv run python streamlit_app_monitor.py &gt;&gt; cron.log 2&gt;&amp;1
\`</pre></p>
<pre><code>&lt;p&gt;
	I use \`uv\` for Python package management, which has been a game-changer for this kind of scheduled task. It handles virtual environments automatically, so I don&#39;t need to manually activate venvs in my crontab—just \`uv run\` and it takes care of the rest. One less thing to worry about at 6am when the job kicks off.



	The whole system is intentionally stateless. No database, no persistent storage beyond the email reports and a simple log file. This might seem limiting, but it&#39;s actually liberating—there&#39;s nothing to maintain, no schema migrations, no state to corrupt. The email reports tell me everything I need to know, and if I really need historical data for some reason, I have a year&#39;s worth of emails I can search through. Simplicity wins.
</code></pre>
<h2>Trade-offs and Limitations</h2>
<pre><code>	I want to be upfront about what this solution is and isn&#39;t. This is a very specific tool solving a very specific problem: keeping free-tier Streamlit apps awake without paying for hosting infrastructure. If I were willing to shell out for an EC2 instance and set up proper self-hosting, none of this would be necessary. But then I&#39;d be dealing with load balancing, domain management, SSL certificates, and monthly AWS bills. For a job seeker trying to showcase portfolio projects, that&#39;s overkill. This script gave me the benefits of always-on apps at exactly zero cost.


That said, there are definitely limitations worth acknowledging:


	- It only works with Streamlit Community Cloud&#39;s specific sleep behavior. If they change how the wakeup button works tomorrow, this breaks.

	- It requires Gmail for email reporting. I could make it more generic, but Gmail SMTP is free and reliable, so I haven&#39;t bothered.

	- The timezone is hardcoded to America/New_York. This is purely because I&#39;m in Eastern Time—there&#39;s no technical reason it couldn&#39;t be configurable.

	- There&#39;s no metrics tracking or analytics dashboard. The email logs give me everything I need for seven apps, but this wouldn&#39;t scale to, say, a hundred apps without some architectural changes.




	The beauty of this approach is its extensibility. If I ever wanted to add proper metrics tracking, I could easily swap out the email reporting for CloudWatch logs, a database, or any other monitoring system. The core logic would stay the same. But for my use case—a handful of portfolio apps that just need to stay awake—simple email reports are perfect.
</code></pre>
<h2>Results</h2>
<pre><code>	It&#39;s been running in production for over a year now, with only a handful of days of downtime during active development when I was making changes. Seven apps, consistently awake, zero embarrassing &quot;sorry, the app is sleeping&quot; moments during job interviews. The peace of mind alone has been worth the time investment.



	The script has become so reliable that I honestly forget it exists most of the time. Every morning I get an email confirming everything ran successfully, I glance at it to make sure there are no errors, and I move on with my day. I&#39;ve only needed to dig into the actual logs maybe three times in the entire year, and those were all during active development rather than real production issues.



	Would I build this again if I had to start over? Absolutely. The whole thing took maybe a week of intermittent work to get from concept to production, including the time I wasted fighting with Selenium. For something that runs autonomously and gives me confidence that my portfolio is always presentable, that&#39;s an excellent return on investment.
</code></pre>
<h2>Conclusion</h2>
<pre><code>	Sometimes the best engineering solutions aren&#39;t the most sophisticated ones—they&#39;re the ones that solve the actual problem you have with the minimum amount of complexity. A headless browser, a cron job, and an email report solved my sleeping app anxiety without requiring me to learn Kubernetes or set up monitoring dashboards or pay for hosting infrastructure.



	If you&#39;re in a similar situation—showcasing projects on free-tier services and worried about uptime—I&#39;d encourage you to consider a similar approach. The core concept works for any service that has a predictable &quot;wake up&quot; mechanism, and the implementation is straightforward enough that you could probably build your own version in an afternoon. Just remember to use Playwright instead of Selenium and save yourself a few days of debugging frustration.
</code></pre>
<h2>Links</h2>
<pre><code>	- **GitHub Repository**:
		[streamlit-app-monitor&lt;/a
		&gt;

	- **LinkedIn**:
		&lt;a
			href=&quot;https://www.linkedin.com/in/kmaurinjones/&quot;
			target=&quot;_blank&quot;
			rel=&quot;noopener&quot;&gt;linkedin.com/in/kmaurinjones&lt;/a
		&gt;

	- **Email**: &lt;a href=&quot;mailto:kmaurinjones@gmail.com&quot;&gt;kmaurinjones@gmail.com](https://github.com/kmaurinjones/streamlit-app-monitor)
</code></pre>`}
</ArticleLayout>
