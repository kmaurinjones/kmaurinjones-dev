# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

**IMPORTANT:** When adding a new version entry to this changelog, you must also update the version in `site-config.yaml` and `package.json`. The version number is automatically displayed throughout the site (footer, etc.) by reading from the config file. This ensures version alignment across the application.

**Development vs Public Changelog:**

This file is the **development changelog** and contains detailed technical changes for developers working on the codebase. Every time this changelog is updated, you must make an executive decision about whether the **public-facing changelog** (`/changelog` route) also merits an update.

Rules for updating the public changelog:
- Only update it for significant user-facing changes (new features, major improvements, important fixes)
- Err on the side of NOT updating the public changelog for minor updates or bug fixes
- Keep public changelog entries as brief as possible while still being informative
- Focus on what users will notice, not how it was implemented


## [0.3.2] - 2025-10-21

### Added
- Projects page at `/projects` route with search and sort functionality
- Project card system displaying title, image, summary, categories, and dual CTAs ("Read Article", "Try It")
- `src/lib/data/projects.json` for centralized project metadata
- Three project entries:
  - NYT Connections Clone with FastAPI, SQLite, calendar widget
  - Wordle Recreation with quality of life improvements
  - Ontario Building Code RAG with query expansion and citation features
- Projects link added to main navigation between About and Thoughts
- WebP conversions for all Connections article images (hero, date-picker, disclaimer-modal, mobile views)
- Card images for all three projects in `static/images/projects/`
- New article route: "Recreating NYT Connections: When Four Guesses Just Isn't Enough"
- Connections article added to articles.json
- Changelog page at `/changelog` route with public-facing version history

### Changed
- Footer note text updated from "typically not actively maintained or monitored" to "not actively maintained"
- Projects page description changed from card-focused to direct: "Live applications and interactive projects."
- Connections article: Removed "Lessons Learned" section per content refinement
- Wordle project summary: Removed "paywalls" mention to avoid legal concerns, focused on quality of life improvements

### Fixed
- CSS link underline styling now excludes footer links using `:not(footer a)` selector
- Footer syntax error with extra closing `</a>` tag resolved

### Removed
- Experience page (`/experience` route) - content consolidated elsewhere
- Technical page (`/technical` route) - no longer needed
- "Lessons Learned" section from Connections article
- Reflective closing paragraph from Connections article

## [0.3.1] - 2025-10-19

### Added
- Comprehensive Experience page with resume content
- Professional experience section with 5 past positions and detailed accomplishments
- Notable projects section highlighting key projects (Housing Law Insights, Ontario Building Code RAG)
- Education section listing Master's and Bachelor's degrees
- Technical skills section organized by category (ML & GenAI, MLOps & Deployment, Data Engineering, Cloud & APIs)
- Leadership & Community Engagement section showcasing leadership roles
- New `+layout.server.js` file to load version from package.json for dynamic display in footer

### Fixed
- Removed unsafe fallback value from Footer component (was using `|| '0.0.1'` default)
- Version now properly loaded from package.json via server-side layout function

### Changed
- Experience page updated from "Coming soon" placeholder to full resume content
- All dates removed from Awards & Recognition and Leadership sections for cleaner presentation
- Footer component refactored to use strict version loading without defaults

### Removed
- Awards & Recognition section (consolidated into leadership and professional accomplishments)
- Undergraduate Research Opportunity Grant award entry
- Unsafe fallback value in Footer component

## [0.3.0] - 2025-10-17

### Added
- Reusable `ArticleLayout` component for consistent article rendering across mobile and desktop
- New article: "Recreating NYT Connections: When Four Guesses Just Isn't Enough"
- New article: "Recreating Wordle with AI Assistance: A One-Day Build"
- Article implementation guide in writing guidelines with two pathways (Medium export vs manual)
- Hero images for Connections and Wordle articles
- Mobile-specific CSS constraint (`@media (max-width: 768px)`) to prevent article overflow
- Comprehensive documentation for article file structure and metadata synchronization

### Changed
- All existing article pages refactored to use new `ArticleLayout` component
- Medium sync script simplified to generate articles with metadata object pattern
- Writing guidelines updated with complete article implementation workflow
- Article metadata now uses consistent object structure across all articles
- Updated `.gitignore` to include drafts directory

### Fixed
- Mobile layout issues where article titles and category tags extended beyond viewport
- Article element width now properly constrained on mobile (max-width: 100vw)
- Consistent responsive behavior across all article pages

## [0.2.1] - 2025-10-14

### Fixed
- Fixed mobile overflow issues on individual article pages in /thoughts/ routes
- Regenerated all article pages with mobile-responsive template
- Removed duplicate article directories from previous sync runs

### Changed
- Updated article page template with aggressive max-width constraints for Medium HTML content
- Added break-words utility classes to prevent text overflow on mobile
- Updated About page content to be more direct and authentic
- Enhanced Notable Projects descriptions with more technical detail
- Removed obsolete master branch from remote repository
- Updated Vite config to allow ngrok-free.app hosts for development

## [0.2.0] - 2025-10-13

### Added
- Medium article sync system with Python script (`scripts/sync-medium-articles.py`)
- Python dependencies for article parsing (beautifulsoup4, lxml)
- Thoughts section with article listing and search/sort functionality
- Individual article pages with responsive typography and styling
- Articles metadata JSON (`src/lib/data/articles.json`)
- Mobile responsive navigation menu with hamburger icon
- Flowbite UI component library integration
- Tailwind Typography plugin for article content styling
- Contact, Experience, Projects, and Technical placeholder pages
- Python project configuration (pyproject.toml, uv.lock)

### Changed
- Home page About section refined to be more conversational and curiosity-driven
- Project descriptions rewritten for more natural, authentic tone
- Navigation layout uses CSS Grid for centered desktop alignment
- Footer layout improved with consistent version display and link positioning
- Page title updated to "Kai Maurin-Jones | Forever Builder"
- Search controls on Thoughts page now match article grid width
- Abstracted Klick Health descriptions to be more general
- Enhanced overflow handling for article content in app.css

### Fixed
- Removed family details from About blockquote for cleaner narrative
- Fixed arrogant-sounding phrasing in project descriptions
- Improved mobile responsiveness across all pages

## [0.1.0] - 2025-10-13

### Added
- YAML-based site configuration system (`site-config.yaml`) for centralized management of version, personal info, contact details, and current role
- Dynamic version display in footer (reads from config)
- Education section on home page (UBC MDS, TMU BA, Centennial College Advanced Diploma)
- Notable projects showcase section on home page
- Development setup instructions in README
- js-yaml dependency for YAML parsing
- Project-specific hook system to protect CHANGELOG.md and CLAUDE.md from deletion

### Changed
- Footer Contact link now uses relative path (`/contact`) instead of absolute URL for consistency with navigation
- Updated home page professional summary and current work descriptions
- Updated home page hero section with refined tagline
- Enhanced gitignore to exclude `.claude/` directory and documentation files

### Fixed
- Footer version number now dynamically reads from site config instead of being hardcoded

## [0.0.1] - 2025-10-13

### Added
- Initial portfolio site launch
- SvelteKit 2 with Svelte 5 framework
- Tailwind CSS 4 with custom theme (base, primary, caramel, taupe, terracotta colors)
- Custom typography with Inter, Crimson Pro, and JetBrains Mono fonts
- Navigation component with active route highlighting
- Footer component with subdomain maintenance notice
- Home page with hero section and current work
- Bug report issue template for subdomain issues
- Repository documentation (README.md, CLAUDE.md)
- Version number display in footer

### Technical
- TypeScript support throughout
- File-based routing with SvelteKit
- Custom PostCSS configuration with @tailwindcss/postcss
- Vite dev server on port 3000
- Auto-deployment adapter configuration
