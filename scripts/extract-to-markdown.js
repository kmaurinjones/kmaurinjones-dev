import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROUTES_DIR = path.join(__dirname, '..', 'src', 'routes', 'thoughts');
const DRAFTS_DIR = path.join(__dirname, '..', '.articles-drafts');

// Get all article directories
const articleDirs = fs.readdirSync(ROUTES_DIR)
  .filter(name => !name.startsWith('+') && !name.startsWith('.'))
  .filter(name => fs.statSync(path.join(ROUTES_DIR, name)).isDirectory());

console.log(`Found ${articleDirs.length} articles to process\n`);

for (const slug of articleDirs) {
  const svelteFilePath = path.join(ROUTES_DIR, slug, '+page.svelte');
  const draftDir = path.join(DRAFTS_DIR, slug);
  const markdownPath = path.join(draftDir, 'content.md');

  // Skip if markdown already exists
  if (fs.existsSync(markdownPath)) {
    console.log(`⏭️  Skipping ${slug} (markdown already exists)`);
    continue;
  }

  console.log(`📝 Processing ${slug}...`);

  // Read Svelte file
  const svelteContent = fs.readFileSync(svelteFilePath, 'utf-8');

  // Extract metadata from script section OR inline props
  let title, date, categories, mediumUrl;

  const metadataMatch = svelteContent.match(/const metadata = \{([^}]+)\}/s);
  if (metadataMatch) {
    // Extract from metadata object
    const metadataStr = metadataMatch[1];
    title = metadataStr.match(/title:\s*['"]([^'"]+)['"]/)?.[1] || '';
    date = metadataStr.match(/date:\s*['"]([^'"]+)['"]/)?.[1] || '';
    const categoriesMatch = metadataStr.match(/categories:\s*\[([^\]]+)\]/)?.[1] || '';
    categories = categoriesMatch
      .split(',')
      .map(c => c.trim().replace(/['"]/g, ''))
      .filter(Boolean);
    mediumUrl = metadataStr.match(/mediumUrl:\s*['"](.*?)['"]/)?.[1] || '';
  } else {
    // Extract from inline ArticleLayout props
    const layoutMatch = svelteContent.match(/<ArticleLayout([^>]+)>/s);
    if (!layoutMatch) {
      console.log(`   ⚠️  No metadata found, skipping`);
      continue;
    }
    const propsStr = layoutMatch[1];
    title = propsStr.match(/title="([^"]+)"/)?.[1] || '';
    date = propsStr.match(/date="([^"]+)"/)?.[1] || '';
    const categoriesMatch = propsStr.match(/categories=\{([^\}]+)\}/)?.[1] || '';
    categories = categoriesMatch
      .replace(/[\[\]']/g, '')
      .split(',')
      .map(c => c.trim().replace(/"/g, ''))
      .filter(Boolean);
    mediumUrl = ''; // Not typically in inline props
  }

  // Extract content (everything after the ArticleLayout opening tag)
  const contentMatch = svelteContent.match(/<ArticleLayout[^>]*>([\s\S]*)<\/ArticleLayout>/);
  if (!contentMatch) {
    console.log(`   ⚠️  No content found, skipping`);
    continue;
  }

  let content = contentMatch[1].trim();

  // Convert Svelte HTML to Markdown
  content = convertSvelteToMarkdown(content);

  // Create frontmatter
  const frontmatter = `---
title: "${title}"
date: "${date}"
categories: [${categories.map(c => `"${c}"`).join(', ')}]
mediumUrl: "${mediumUrl}"
---

`;

  const markdown = frontmatter + content;

  // Create draft directory if it doesn't exist
  if (!fs.existsSync(draftDir)) {
    fs.mkdirSync(draftDir, { recursive: true });
  }

  // Write markdown file
  fs.writeFileSync(markdownPath, markdown, 'utf-8');
  console.log(`   ✅ Created markdown source`);
}

console.log('\n✨ Done!');

function convertSvelteToMarkdown(html) {
  let md = html;

  // Remove HTML comments
  md = md.replace(/<!--[\s\S]*?-->/g, '');

  // Convert headings
  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n# $1\n');
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n');
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n');
  md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n#### $1\n');

  // Convert paragraphs
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n');

  // Convert lists
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (match, content) => {
    return content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (m, item) => `- ${item.trim()}\n`);
  });
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (match, content) => {
    let counter = 1;
    return content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (m, item) => `${counter++}. ${item.trim()}\n`);
  });

  // Convert links
  md = md.replace(/<a\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)');

  // Convert strong/bold
  md = md.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**');

  // Convert em/italic
  md = md.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*');
  md = md.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*');

  // Convert code blocks
  md = md.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '```\n$1\n```\n');

  // Convert inline code
  md = md.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`');

  // Convert blockquotes
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (match, content) => {
    return content.split('\n').map(line => `> ${line}`).join('\n') + '\n';
  });

  // Keep figures as-is (they contain images and captions)
  // Don't convert them - leave the HTML

  // Clean up excessive newlines
  md = md.replace(/\n{3,}/g, '\n\n');

  // Trim whitespace
  md = md.trim();

  return md;
}