#!/usr/bin/env node

/**
 * Sync Articles Script
 *
 * Converts markdown articles from .articles-drafts/ to Svelte components
 * in src/routes/thoughts/
 *
 * Usage: npm run sync-articles [slug]
 *   - Without slug: syncs all articles
 *   - With slug: syncs only that article
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import { generateTTS, needsRegeneration } from './lib/tts-generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DRAFTS_DIR = path.join(__dirname, '../.articles-drafts');
const ROUTES_DIR = path.join(__dirname, '../src/routes/thoughts');
const STATIC_AUDIO_DIR = path.join(__dirname, '../static/audio/thoughts');

// Configure marked options
marked.setOptions({
  breaks: false,
  gfm: true,
});

/**
 * Process external links to add target="_blank" and rel="noopener"
 */
function processLinks(html) {
  return html.replace(
    /<a href="(https?:\/\/[^"]+)">/g,
    '<a href="$1" target="_blank" rel="noopener">'
  );
}

/**
 * Convert markdown to HTML, preserving raw HTML blocks
 */
function convertMarkdownToHTML(markdown) {
  // Parse markdown to HTML
  let html = marked.parse(markdown);

  // Process external links
  html = processLinks(html);

  return html;
}

/**
 * Generate Svelte component from markdown content and frontmatter
 */
function generateSvelteComponent(frontmatter, htmlContent) {
  const { title, date, categories, mediumUrl = '' } = frontmatter;

  return `<script lang="ts">
\timport ArticleLayout from '$lib/components/ArticleLayout.svelte';

\tconst metadata = {
\t\ttitle: "${title}",
\t\tdate: "${date}",
\t\tcategories: ${JSON.stringify(categories)},
\t\tmediumUrl: "${mediumUrl}"
\t};
</script>

<ArticleLayout
\ttitle={metadata.title}
\tdate={metadata.date}
\tcategories={metadata.categories}
>
\t{@html \`${htmlContent.trim().replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`}
</ArticleLayout>
`;
}

/**
 * Generate TTS audio for an article
 */
async function generateArticleAudio(slug, markdownContent) {
  const draftAudioPath = path.join(DRAFTS_DIR, slug, 'audio.mp3');
  const staticAudioPath = path.join(STATIC_AUDIO_DIR, `${slug}.mp3`);
  const markdownPath = path.join(DRAFTS_DIR, slug, 'content.md');

  // Check if regeneration is needed
  if (!needsRegeneration(markdownPath, draftAudioPath)) {
    console.log(`   ⏭️  Audio up-to-date, skipping generation`);

    // Ensure static audio exists (copy if missing)
    if (!fs.existsSync(staticAudioPath)) {
      console.log(`   📦 Copying audio to static directory`);
      fs.copyFileSync(draftAudioPath, staticAudioPath);
    }

    return { success: true, skipped: true };
  }

  console.log(`   🎙️  Generating TTS audio...`);

  // Generate audio
  const result = await generateTTS(markdownContent, draftAudioPath);

  if (!result.success) {
    console.error(`   ❌ TTS generation failed: ${result.error}`);
    return { success: false, error: result.error };
  }

  // Ensure static audio directory exists
  if (!fs.existsSync(STATIC_AUDIO_DIR)) {
    fs.mkdirSync(STATIC_AUDIO_DIR, { recursive: true });
  }

  // Copy to static directory
  fs.copyFileSync(draftAudioPath, staticAudioPath);
  console.log(`   📦 Copied audio to static directory`);

  return { success: true, skipped: false, ...result };
}

/**
 * Sync a single article from draft to Svelte component
 */
async function syncArticle(slug) {
  const draftPath = path.join(DRAFTS_DIR, slug, 'content.md');
  const routePath = path.join(ROUTES_DIR, slug, '+page.svelte');

  // Check if draft exists
  if (!fs.existsSync(draftPath)) {
    console.error(`❌ Draft not found: ${draftPath}`);
    return false;
  }

  try {
    // Read markdown file
    const markdownContent = fs.readFileSync(draftPath, 'utf-8');

    // Parse frontmatter and content
    const { data: frontmatter, content } = matter(markdownContent);

    // Validate required frontmatter fields
    if (!frontmatter.title || !frontmatter.date || !frontmatter.categories) {
      console.error(`❌ Missing required frontmatter fields in ${slug}`);
      console.error('   Required: title, date, categories');
      return false;
    }

    // Convert markdown to HTML
    const htmlContent = convertMarkdownToHTML(content);

    // Generate Svelte component
    const svelteComponent = generateSvelteComponent(frontmatter, htmlContent);

    // Ensure route directory exists
    const routeDir = path.dirname(routePath);
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }

    // Write Svelte component
    fs.writeFileSync(routePath, svelteComponent, 'utf-8');

    console.log(`✅ Synced: ${slug}`);

    // Generate TTS audio
    const audioResult = await generateArticleAudio(slug, markdownContent);

    if (!audioResult.success) {
      console.warn(`   ⚠️  Audio generation failed but article synced successfully`);
    }

    return true;
  } catch (error) {
    console.error(`❌ Error syncing ${slug}:`, error.message);
    return false;
  }
}

/**
 * Sync all articles
 */
async function syncAllArticles() {
  if (!fs.existsSync(DRAFTS_DIR)) {
    console.error(`❌ Drafts directory not found: ${DRAFTS_DIR}`);
    process.exit(1);
  }

  const slugs = fs.readdirSync(DRAFTS_DIR).filter(item => {
    const itemPath = path.join(DRAFTS_DIR, item);
    return fs.statSync(itemPath).isDirectory();
  });

  if (slugs.length === 0) {
    console.log('ℹ️  No articles found to sync');
    return;
  }

  console.log(`📝 Found ${slugs.length} article(s) to sync\n`);

  let successCount = 0;
  let failCount = 0;

  for (const slug of slugs) {
    if (await syncArticle(slug)) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log(`\n✨ Sync complete: ${successCount} succeeded, ${failCount} failed`);
}

/**
 * Main entry point
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // Sync all articles
    await syncAllArticles();
  } else {
    // Sync specific article
    const slug = args[0];
    const success = await syncArticle(slug);
    process.exit(success ? 0 : 1);
  }
}

main();
