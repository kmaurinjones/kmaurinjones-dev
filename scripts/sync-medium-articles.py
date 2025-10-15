#!/usr/bin/env python3
"""
Sync Medium articles from saved HTML files to SvelteKit thought pages.
Parses HTML files, extracts metadata and content, and generates Svelte pages.
"""

import json
import re
from pathlib import Path
from datetime import datetime
from bs4 import BeautifulSoup

# Configuration
COMPLETED_ARTICLES_DIR = Path(__file__).parent.parent / "completed-articles"
THOUGHTS_DIR = Path(__file__).parent.parent / "src" / "routes" / "thoughts"
OUTPUT_JSON = Path(__file__).parent.parent / "src" / "lib" / "data" / "articles.json"

def extract_slug_from_title(title):
    """Extract a URL-safe slug from article title"""
    # Remove special characters and convert to lowercase
    slug = re.sub(r'[^\w\s-]', '', title.lower())
    # Replace spaces with hyphens
    slug = re.sub(r'[-\s]+', '-', slug)
    # Remove leading/trailing hyphens
    slug = slug.strip('-')
    return slug

def parse_html_file(html_path):
    """Parse a saved Medium HTML file and extract article data"""
    print(f"Processing {html_path.name}...")

    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    soup = BeautifulSoup(html_content, 'lxml')
    article = {}

    # Extract title from <title> tag or h1
    title_tag = soup.find('title')
    if title_tag:
        # Medium titles are usually in format: "Title | by Author | Medium"
        title_text = title_tag.get_text()
        # Remove the " | by ... | Medium" suffix
        title = re.sub(r'\s*\|\s*by\s+.*?\s*\|\s*Medium\s*$', '', title_text)
        title = re.sub(r'\s*\|\s*Medium\s*$', '', title)
        # Remove "By Kai Maurin-Jones" at end of title (with optional period before it)
        title = re.sub(r'\.?\s*By\s+Kai\s+Maurin-Jones\s*$', '', title, flags=re.I)
        article['title'] = title.strip()

    # If no title from <title>, try h1
    if not article.get('title'):
        h1 = soup.find('h1')
        if h1:
            article['title'] = h1.get_text().strip()

    # Generate slug from title
    if article.get('title'):
        article['slug'] = extract_slug_from_title(article['title'])

    # Extract canonical URL (Medium article URL)
    canonical = soup.find('link', rel='canonical')
    if canonical and canonical.get('href'):
        article['url'] = canonical['href']
        article['mediumUrl'] = canonical['href']  # Use canonical URL as medium URL

    # Extract publication date
    # Try JSON-LD structured data first (most accurate)
    json_ld_script = soup.find('script', type='application/ld+json')
    if json_ld_script:
        try:
            json_data = json.loads(json_ld_script.string)
            if 'datePublished' in json_data:
                dt = datetime.fromisoformat(json_data['datePublished'].replace('Z', '+00:00'))
                article['formattedDate'] = dt.strftime('%B %d, %Y')
                article['pubDate'] = json_data['datePublished']
        except:
            pass

    # Fallback to meta tags if JSON-LD didn't work
    if not article.get('formattedDate'):
        date_meta = soup.find('meta', property='article:published_time')
        if date_meta and date_meta.get('content'):
            try:
                dt = datetime.fromisoformat(date_meta['content'].replace('Z', '+00:00'))
                article['formattedDate'] = dt.strftime('%B %d, %Y')
                article['pubDate'] = date_meta['content']
            except:
                pass

    # If no date from meta, try to find it in the page
    if not article.get('formattedDate'):
        # Look for time tags or date patterns
        time_tag = soup.find('time')
        if time_tag:
            datetime_attr = time_tag.get('datetime')
            if datetime_attr:
                try:
                    dt = datetime.fromisoformat(datetime_attr.replace('Z', '+00:00'))
                    article['formattedDate'] = dt.strftime('%B %d, %Y')
                except:
                    # Fallback to visible text
                    article['formattedDate'] = time_tag.get_text().strip()

    # Extract categories/tags
    # Look for meta keywords or article:tag
    categories = []
    tag_metas = soup.find_all('meta', property='article:tag')
    for tag in tag_metas:
        if tag.get('content'):
            categories.append(tag['content'])

    # If no meta tags, look for links in the article footer
    if not categories:
        # Try to find tag links (usually in footer)
        tag_links = soup.find_all('a', href=re.compile(r'/tag/'))
        for link in tag_links[:5]:  # Limit to first 5
            tag_text = link.get_text().strip()
            if tag_text and len(tag_text) < 50:  # Reasonable tag length
                categories.append(tag_text.lower())

    article['categories'] = categories

    # Extract article content
    # Find the main article element
    article_elem = soup.find('article')
    if article_elem:
        # Clone for processing
        content_soup = BeautifulSoup(str(article_elem), 'lxml')
        article_content = content_soup.find('article')

        if article_content:
            # Remove unwanted elements
            # 1. Remove toolbars/action buttons
            for elem in article_content.find_all('div', class_=lambda x: x and any(c in str(x) for c in ['toolbar', 'actions'])):
                elem.decompose()

            # 2. Remove speechify elements
            for elem in article_content.find_all(class_=lambda x: x and 'speechify' in str(x)):
                elem.decompose()

            # 3. Remove the title h1 (we display it separately)
            for h1 in article_content.find_all('h1'):
                h1.decompose()

            # 4. Remove author bylines
            for elem in article_content.find_all(string=re.compile(r'By Kai Maurin-Jones', re.I)):
                if elem.parent:
                    elem.parent.decompose()

            # 5. Remove "Press enter or click" buttons
            for button in article_content.find_all('button'):
                if 'press enter' in button.get_text().lower():
                    button.decompose()

            # 6. Remove member-only badges
            for elem in article_content.find_all(string=re.compile(r'Member-only story', re.I)):
                if elem.parent:
                    parent = elem.parent
                    # Go up to find the container div
                    while parent and parent.name != 'article':
                        if parent.name == 'div':
                            parent.decompose()
                            break
                        parent = parent.parent

            # 7. Remove paywall text
            for elem in article_content.find_all(string=re.compile(r'unable to read this article due to a paywall', re.I)):
                if elem.parent:
                    parent = elem.parent
                    # Go up to find the containing paragraph or div
                    while parent and parent.name != 'article':
                        if parent.name in ['p', 'div', 'a']:
                            parent.decompose()
                            break
                        parent = parent.parent

            article['contentHtml'] = str(article_content)

    return article

def create_svelte_page(article):
    """Create a Svelte page for an article"""
    slug = article.get('slug')
    if not slug:
        print(f"Skipping article without slug: {article.get('title')}")
        return

    # Create directory for the article
    article_dir = THOUGHTS_DIR / slug
    article_dir.mkdir(parents=True, exist_ok=True)

    # Build the Svelte content
    title_json = json.dumps(article.get('title', ''))
    date_json = json.dumps(article.get('formattedDate', ''))
    categories_json = json.dumps(article.get('categories', []))
    url_json = json.dumps(article.get('mediumUrl', article.get('url', '')))
    html_json = json.dumps(article.get('contentHtml', ''))

    svelte_template = """<script lang="ts">
  import { onMount } from 'svelte';

  let mounted = $state(false);
  onMount(() => mounted = true);

  const article = {
    title: TITLE_JSON,
    date: DATE_JSON,
    categories: CATEGORIES_JSON,
    mediumUrl: URL_JSON
  };
</script>

<svelte:head>
  <title>{article.title} | Kai Maurin-Jones</title>
  <meta name="description" content="{article.title} - Read on Kai Maurin-Jones' blog" />
</svelte:head>

<div class="min-h-screen {mounted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700">
  <article class="max-w-4xl mx-auto px-4 sm:px-6 w-full overflow-x-hidden">
    <!-- Back link -->
    <a href="/thoughts" class="inline-flex items-center text-taupe hover:text-terracotta transition-colors mb-8">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
      </svg>
      Back to Thoughts
    </a>

    <!-- Article header -->
    <header class="mb-12">
      <h1 class="text-3xl lg:text-4xl font-bold text-primary mb-4 break-words">
        {article.title}
      </h1>
      <div class="flex flex-wrap items-center gap-4 text-taupe">
        <time datetime="{article.date}">{article.date}</time>
        {#if article.categories.length > 0}
          <span class="text-taupe/40">•</span>
          <div class="flex flex-wrap gap-2">
            {#each article.categories as category}
              <span class="px-3 py-1 bg-caramel/10 text-taupe text-sm rounded-full">
                {category}
              </span>
            {/each}
          </div>
        {/if}
      </div>
    </header>

    <!-- Article content -->
    <div class="prose prose-lg max-w-none mb-12 overflow-x-hidden w-full
                [&_*]:max-w-full [&_*]:box-border
                [&_img]:max-w-full [&_img]:h-auto
                [&_picture]:max-w-full [&_picture]:block
                [&_figure]:max-w-full [&_figure]:mx-0
                [&_div]:max-w-full
                [&_section]:max-w-full
                [&_article]:max-w-full
                prose-headings:text-primary prose-headings:font-bold prose-headings:break-words
                prose-p:text-taupe prose-p:leading-relaxed prose-p:mb-4 prose-p:break-words
                prose-a:text-terracotta prose-a:no-underline prose-a:break-words hover:prose-a:underline
                prose-strong:text-primary prose-strong:font-semibold
                prose-em:text-taupe prose-em:italic
                prose-code:text-primary prose-code:bg-caramel/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:break-words
                prose-pre:bg-primary/5 prose-pre:border prose-pre:border-taupe/20 prose-pre:overflow-x-auto prose-pre:max-w-full
                prose-blockquote:border-l-4 prose-blockquote:border-terracotta prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:my-6
                prose-ul:text-taupe prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
                prose-ol:text-taupe prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
                prose-li:text-taupe prose-li:my-2 prose-li:break-words
                prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8 prose-img:max-w-full prose-img:h-auto
                prose-h1:mb-4 prose-h1:mt-8
                prose-h2:mb-4 prose-h2:mt-8
                prose-h3:mb-3 prose-h3:mt-6
                prose-h4:mb-2 prose-h4:mt-4
                ">
      {@html HTML_JSON}
    </div>
  </article>
</div>
"""

    svelte_content = (svelte_template
                     .replace('TITLE_JSON', title_json)
                     .replace('DATE_JSON', date_json)
                     .replace('CATEGORIES_JSON', categories_json)
                     .replace('URL_JSON', url_json)
                     .replace('HTML_JSON', html_json))

    page_file = article_dir / '+page.svelte'
    page_file.write_text(svelte_content, encoding='utf-8')
    print(f"Created: {page_file}")

def create_articles_json(articles):
    """Create a JSON file with article metadata for the thoughts index page"""
    OUTPUT_JSON.parent.mkdir(parents=True, exist_ok=True)

    articles_data = []
    for article in articles:
        if article.get('slug'):
            articles_data.append({
                'slug': article['slug'],
                'title': article.get('title', ''),
                'date': article.get('formattedDate', ''),
                'categories': article.get('categories', []),
                'url': article.get('url', ''),
            })

    OUTPUT_JSON.write_text(json.dumps(articles_data, indent=2, ensure_ascii=False), encoding='utf-8')
    print(f"Created: {OUTPUT_JSON}")

def main():
    """Main function"""
    print("Processing Medium article HTML files...")

    # Find all HTML files in the completed-articles directory
    html_files = list(COMPLETED_ARTICLES_DIR.glob("*.html"))

    if not html_files:
        print(f"No HTML files found in {COMPLETED_ARTICLES_DIR}")
        return

    print(f"Found {len(html_files)} HTML files")

    articles = []
    for html_file in html_files:
        try:
            article = parse_html_file(html_file)
            if article.get('title') and article.get('slug'):
                articles.append(article)
            else:
                print(f"  ! Skipping {html_file.name} - missing title or slug")
        except Exception as e:
            print(f"  ! Error processing {html_file.name}: {e}")

    print(f"\nSuccessfully parsed {len(articles)} articles")

    if not articles:
        print("No articles to process")
        return

    print("\nCreating Svelte pages...")
    for article in articles:
        create_svelte_page(article)

    print("\nCreating articles metadata JSON...")
    create_articles_json(articles)

    print("\n✅ Sync complete!")

if __name__ == '__main__':
    main()
