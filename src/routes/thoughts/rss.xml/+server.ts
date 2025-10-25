import type { RequestHandler } from './$types';
import articles from '$lib/data/articles.json';
import { existsSync, statSync } from 'fs';
import { join } from 'path';

const SITE_URL = 'https://kmaurinjones.dev';
const SITE_TITLE = 'Kai Maurin-Jones - Thoughts';
const SITE_DESCRIPTION = 'Articles and writings on AI, machine learning, data science, and the intersection of technology and real-world applications';
const SITE_AUTHOR = 'Kai Maurin-Jones';
const AUTHOR_EMAIL = 'hello@kmaurinjones.dev';
const PODCAST_COVER_ART = `${SITE_URL}/images/podcast-cover.jpg`; // You'll need to add this image
const PODCAST_CATEGORY = 'Technology';

function escapeXml(unsafe: string): string {
	return unsafe
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function formatRFC822Date(dateString: string): string {
	const date = new Date(dateString);
	return date.toUTCString();
}

export const GET: RequestHandler = async () => {
	// Sort articles by date (newest first)
	const sortedArticles = [...articles].sort((a, b) => {
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});

	const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
	xmlns:atom="http://www.w3.org/2005/Atom"
	xmlns:content="http://purl.org/rss/1.0/modules/content/"
	xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
	<channel>
		<title>${escapeXml(SITE_TITLE)}</title>
		<description>${escapeXml(SITE_DESCRIPTION)}</description>
		<link>${SITE_URL}/thoughts</link>
		<atom:link href="${SITE_URL}/thoughts/rss.xml" rel="self" type="application/rss+xml" />
		<language>en-us</language>
		<lastBuildDate>${formatRFC822Date(sortedArticles[0]?.date || new Date().toISOString())}</lastBuildDate>
		<managingEditor>${AUTHOR_EMAIL} (${SITE_AUTHOR})</managingEditor>
		<webMaster>${AUTHOR_EMAIL} (${SITE_AUTHOR})</webMaster>

		<!-- iTunes/Apple Podcasts tags -->
		<itunes:author>${escapeXml(SITE_AUTHOR)}</itunes:author>
		<itunes:summary>${escapeXml(SITE_DESCRIPTION)}</itunes:summary>
		<itunes:owner>
			<itunes:name>${escapeXml(SITE_AUTHOR)}</itunes:name>
			<itunes:email>${AUTHOR_EMAIL}</itunes:email>
		</itunes:owner>
		<itunes:explicit>no</itunes:explicit>
		<itunes:category text="${PODCAST_CATEGORY}" />
		<itunes:image href="${PODCAST_COVER_ART}" />
${sortedArticles.map(article => {
	const articleUrl = `${SITE_URL}/thoughts/${article.slug}`;
	const audioPath = join(process.cwd(), 'static', 'audio', 'thoughts', `${article.slug}.mp3`);
	const hasAudio = existsSync(audioPath);
	const audioUrl = hasAudio ? `${SITE_URL}/audio/thoughts/${article.slug}.mp3` : null;
	const audioLength = hasAudio ? statSync(audioPath).size : 0;

	return `		<item>
			<title>${escapeXml(article.title)}</title>
			<link>${articleUrl}</link>
			<guid isPermaLink="true">${articleUrl}</guid>
			<pubDate>${formatRFC822Date(article.date)}</pubDate>
			<description>${escapeXml(article.title)}</description>
${article.categories?.map(cat => `			<category>${escapeXml(cat)}</category>`).join('\n') || ''}
${audioUrl ? `			<enclosure url="${audioUrl}" type="audio/mpeg" length="${audioLength}" />
			<itunes:author>${escapeXml(SITE_AUTHOR)}</itunes:author>
			<itunes:summary>${escapeXml(article.title)}</itunes:summary>
			<itunes:explicit>no</itunes:explicit>` : ''}
		</item>`;
}).join('\n')}
	</channel>
</rss>`;

	return new Response(rss, {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
};
