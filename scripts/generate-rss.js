#!/usr/bin/env node

import { existsSync, statSync } from 'fs';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..');
const ARTICLES_PATH = path.join(PROJECT_ROOT, 'src', 'lib', 'data', 'articles.json');
const STATIC_AUDIO_DIR = path.join(PROJECT_ROOT, 'static', 'audio', 'thoughts');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'static', 'thoughts');
const OUTPUT_PATH = path.join(OUTPUT_DIR, 'rss.xml');

const SITE_URL = 'https://kmaurinjones.dev';
const SITE_TITLE = 'Kai Maurin-Jones - Thoughts';
const SITE_DESCRIPTION =
	'Articles and writings on AI, machine learning, data science, and the intersection of technology and real-world applications';
const SITE_AUTHOR = 'Kai Maurin-Jones';
const AUTHOR_EMAIL = 'hello@kmaurinjones.dev';
const PODCAST_COVER_ART = `${SITE_URL}/images/podcast-cover.jpg`;
const PODCAST_CATEGORY = 'Technology';

function escapeXml(value) {
	if (typeof value !== 'string') {
		throw new Error('escapeXml received a non-string value');
	}

	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function parseUtcDate(dateString) {
	if (typeof dateString !== 'string') {
		throw new Error('Date must be provided as a string');
	}

	const parsed = new Date(`${dateString} UTC`);

	if (Number.isNaN(parsed.getTime())) {
		throw new Error(`Invalid date string: ${dateString}`);
	}

	return parsed;
}

function formatRFC822Date(dateString) {
	const parsed = parseUtcDate(dateString);
	return parsed.toUTCString();
}

async function loadArticles() {
	const raw = await readFile(ARTICLES_PATH, 'utf-8');
	const articles = JSON.parse(raw);

	if (!Array.isArray(articles)) {
		throw new Error('articles.json must contain an array');
	}

	articles.forEach(article => {
		if (typeof article !== 'object' || article === null) {
			throw new Error('Each article entry must be an object');
		}

		if (!article.slug) {
			throw new Error('Article entry missing slug');
		}

		if (!article.title) {
			throw new Error(`Article ${article.slug} is missing title`);
		}

		if (!article.date) {
			throw new Error(`Article ${article.slug} is missing date`);
		}

		if (!Array.isArray(article.categories)) {
			throw new Error(`Article ${article.slug} must include a categories array`);
		}
	});

	const sorted = [...articles].sort((a, b) => {
		const left = parseUtcDate(a.date);
		const right = parseUtcDate(b.date);
		return right.getTime() - left.getTime();
	});

	if (sorted.length === 0) {
		throw new Error('No articles found in articles.json');
	}

	return sorted;
}

function buildItem(article) {
	const articleUrl = `${SITE_URL}/thoughts/${article.slug}`;
	const audioFilename = `${article.slug}.mp3`;
	const audioPath = path.join(STATIC_AUDIO_DIR, audioFilename);
	const categoriesXml = article.categories
		.map(category => `			<category>${escapeXml(category)}</category>`)
		.join('\n');

	if (categoriesXml.includes('<category></category>')) {
		throw new Error(`Empty category value found for ${article.slug}`);
	}

	const parts = [];
	parts.push('		<item>');
	parts.push(`			<title>${escapeXml(article.title)}</title>`);
	parts.push(`			<link>${articleUrl}</link>`);
	parts.push(`			<guid isPermaLink="true">${articleUrl}</guid>`);
	parts.push(`			<pubDate>${formatRFC822Date(article.date)}</pubDate>`);
	parts.push(`			<description>${escapeXml(article.title)}</description>`);

	if (categoriesXml.length > 0) {
		parts.push(categoriesXml);
	}

	if (existsSync(audioPath)) {
		const stats = statSync(audioPath);

		parts.push(
			`			<enclosure url="${SITE_URL}/audio/thoughts/${audioFilename}" type="audio/mpeg" length="${stats.size}" />`
		);
		parts.push(`			<itunes:author>${escapeXml(SITE_AUTHOR)}</itunes:author>`);
		parts.push(`			<itunes:summary>${escapeXml(article.title)}</itunes:summary>`);
		parts.push('			<itunes:explicit>no</itunes:explicit>');
	}

	parts.push('		</item>');

	return parts.join('\n');
}

function buildRssDocument(articles) {
	const lastBuildDate = formatRFC822Date(articles[0].date);
	const itemsXml = articles.map(buildItem).join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>
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
		<lastBuildDate>${lastBuildDate}</lastBuildDate>
		<managingEditor>${AUTHOR_EMAIL} (${SITE_AUTHOR})</managingEditor>
		<webMaster>${AUTHOR_EMAIL} (${SITE_AUTHOR})</webMaster>
		<itunes:author>${escapeXml(SITE_AUTHOR)}</itunes:author>
		<itunes:summary>${escapeXml(SITE_DESCRIPTION)}</itunes:summary>
		<itunes:owner>
			<itunes:name>${escapeXml(SITE_AUTHOR)}</itunes:name>
			<itunes:email>${AUTHOR_EMAIL}</itunes:email>
		</itunes:owner>
		<itunes:explicit>no</itunes:explicit>
		<itunes:category text="${escapeXml(PODCAST_CATEGORY)}" />
		<itunes:image href="${PODCAST_COVER_ART}" />
${itemsXml}
	</channel>
</rss>
`;
}

async function main() {
	const articles = await loadArticles();
	const rssContent = buildRssDocument(articles);

	await mkdir(OUTPUT_DIR, { recursive: true });
	await writeFile(OUTPUT_PATH, rssContent, 'utf-8');

	console.log(`Generated RSS feed with ${articles.length} items at ${OUTPUT_PATH}`);
}

main().catch(error => {
	console.error(error.message);
	process.exit(1);
});
