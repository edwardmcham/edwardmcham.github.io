# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

emcham.io — Edward McHam's resume/portfolio/blog site, built with [Zensical](https://zensical.org) (a Material-for-MkDocs-style static site generator) and deployed to GitHub Pages. Content is authored in Markdown; Python and Jinja2 provide content-reuse features Markdown lacks on its own. This repo is itself a portfolio item (a "docs-as-code" workflow example), so keep changes clean and well-explained.

## Commands

- **Build + run dev server (Windows):** `start-site.bat` (or the VS Code task "Start Zensical Site", which runs automatically on folder open). Activates `.venv`, runs `py -m zensical build --clean`, then `py -m zensical serve --open`.
- **Manual build:** `zensical build --clean` (output goes to `site/`, which is gitignored — never hand-edit it).
- **Manual serve:** `zensical serve --open`.
- **Scaffold a new blog post:** `.\New-BlogPost.ps1` — prompts for a title, creates `docs/blog/YYYY/MM/DD/HH-mm-ss-slug.md` with front matter (`title`, `date`, `tags`) and `{{ post_nav(page.url) }}` calls already placed, then opens it in VS Code. Always use this instead of hand-creating post files — the filename/front matter conventions matter (see Architecture below).
- No test suite or linter is configured in this repo.

## Architecture

### Build pipeline
`docs/` is the Markdown/asset source; `zensical build` renders it into `site/` (gitignored, not committed). `.github/workflows/docs.yml` runs `zensical build --clean` on every push to `main`/`master` and deploys `site/` to GitHub Pages via `actions/deploy-pages`.

### `zensical.toml` — single source of truth for config
Nav structure, theme, and Markdown extensions live here. Two things are deliberately single-sourced through this file and read from multiple places — don't duplicate them elsewhere:
- **`[project.extra.social]`** array: the list of contact/social links. Read by both `overrides/partials/social.html` (footer) and `main.py`'s `social_icons()` macro (inline row on home/resume pages).
- **`site_author_email`**: every `mailto:` link site-wide reads this one value instead of duplicating the address in the social array (the email entry's own `link` is intentionally blank).

`render_by_default = true` under `pymdownx.macros`/`zensical.extensions.macros` turns on Jinja2 `{{ }}` processing for every Markdown page, not just opted-in ones — this is what lets pages call the macros in `main.py` directly.

### `main.py` — Zensical Macros module
Zensical auto-discovers `define_env(env)` and calls it once per build; every function registered inside with `@env.macro` becomes callable from Markdown as `{{ function_name() }}`. Public macros:
- `social_icons()` — renders the social/contact icon row (reads `zensical.toml`, see above).
- `recent_posts(count=5)` — home page's "recent posts" widget.
- `post_nav(current_url)` — Newer/Older links on individual posts; called as `{{ post_nav(page.url) }}`.
- `all_posts_grouped()` — full blog index on `blog.md`, grouped by month into collapsible `<details>`.

All four post-listing macros share `_get_all_posts()`, which scans `docs/blog/**/*.md`, reads YAML front matter (`title`, `date` — **never file mtime**, since GitHub Actions checkouts reset file timestamps), and sorts newest-first. Because `list.sort` is stable, posts with an identical `date` fall back to filesystem/glob order (arbitrary) — the blog post filename's time prefix exists specifically to avoid same-day collisions and keep sort order meaningful. `.svg` icons from `docs/assets/icons/` are cached per-build in `_icon_cache` since multiple macros reuse the same icons.

### Blog post structure
Posts live at `docs/blog/YYYY/MM/DD/HH-mm-ss-slug.md`, always created via `New-BlogPost.ps1`. The time-prefixed filename lets multiple posts share a day while still sorting correctly by filename. Front matter needs `title` and `date` (`YYYY-MM-DD HH:MM:SS`); `post_nav(page.url)` is placed at both the top and bottom of the post body.

Never duplicate YAML front matter in a post file — each post needs exactly one front matter block (`---`-delimited) at the very top. A second block later in the file doesn't error; Zensical just renders wrong (e.g. the extra `---`s render as literal text or content silently drops), so check for this first if a post looks broken with no build error.

### Theme overrides (`overrides/partials/`, set via `custom_dir` in `zensical.toml`)
Only `social.html` and `copyright.html` are intentionally customized (each documents its own deviation from the Zensical default inline). `header.html` is present but is an unmodified, auto-generated Zensical file ("do not edit" banner) — don't treat it as a customization point.

### `docs/javascripts/extra.js`
All client-side behavior is defined as named functions, then run once from a single `document$.subscribe(...)` call at the bottom (this is Zensical/MkDocs's instant-navigation hook, so it must re-run on every page view). Notable behaviors: external/PDF link handling (adds `target="_blank"` + an external-link icon, skipped for social/footer links), GLightbox init, footer copyright year, resume page pipe-separator spacing, nav tab icons (fetched as SVG since Zensical doesn't process icon shortcodes in `zensical.toml`'s nav titles), and the blog page's Expand All/Collapse All controls.

### Content reuse patterns
- `pymdownx.snippets` (`base_path = ["includes"]`) enables `--8<-- "file"` includes — currently used by `index.md` to pull in `includes/hero.html`.
- Icons referenced by name (e.g. `newspaper`, `chevron-left`) resolve to `docs/assets/icons/<name>.svg`, read either server-side by `main.py`'s `_read_icon()` or client-side by `extra.js`'s `fetch()` calls.
