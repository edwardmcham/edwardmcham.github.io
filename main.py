"""
main.py — Zensical Macros module.

Zensical's Macros extension lets any Markdown page call a Python
function by name using {{ function_name() }}. Whatever the function
returns is inserted directly into the page at that spot.

Zensical finds and calls define_env(env) automatically on every build —
nothing here is called manually. Every function a page is allowed to
use must be registered inside it with the @env.macro decorator.
"""

import os
import re
import glob
from datetime import datetime
import yaml


def define_env(env):
    """Required entry point Zensical looks for by name."""

    docs_dir = env.conf.get("docs_dir", "docs")

    @env.macro
    def social_icons():
        """
        Build the row of contact/social icons shown at the top of the
        home and resume pages, from the same [[project.extra.social]]
        list in zensical.toml that the site footer already reads.

        Email is a special case: its link is rebuilt from
        site_author_email instead of the array's own `link` field, so
        the address only ever needs to change in one place. See
        overrides/partials/social.html for the matching footer logic.
        """
        extra = env.conf.get("extra", {})
        social = extra.get("social", [])
        email = extra.get("site_author_email", "")

        parts = []
        for entry in social:
            icon = entry["icon"].replace("/", "-")

            if "envelope" in entry["icon"]:
                link = "mailto:" + email
            else:
                link = entry["link"]

            parts.append('[:{}:]({} "{}")'.format(icon, link, entry["name"]))

        return '<span class="social-icons">\n' + "\n".join(parts) + "\n</span>"

    # -----------------------------------------------------------------
    # Icon file cache — used by recent_posts(), post_nav(), and
    # all_posts_grouped() below. Each .svg file only gets read from
    # disk once, no matter how many times that icon appears.
    # -----------------------------------------------------------------
    _icon_cache = {}

    def _read_icon(name):
        """Read one .svg file from docs/assets/icons/ once, cache it."""
        if name not in _icon_cache:
            path = os.path.join(docs_dir, "assets", "icons", name + ".svg")
            with open(path, encoding="utf-8") as f:
                _icon_cache[name] = f.read()
        return _icon_cache[name]

    def _read_frontmatter(path):
        """
        Read a Markdown file and split its front matter (the
        --- ... --- block at the top) from the rest of the content.
        Returns a dictionary of the front matter fields, and the
        remaining body text.
        """
        text = open(path, encoding="utf-8").read()
        if text.startswith("---"):
            parts = text.split("---", 2)
            if len(parts) >= 3:
                meta = yaml.safe_load(parts[1]) or {}
                return meta, parts[2]
        return {}, text

    def _strip_markdown(text):
        """Roughly strip Markdown formatting for a plain-text excerpt."""
        text = re.sub(r'\{\{.*?\}\}', '', text)  # strip Jinja macro calls, e.g. {{ post_nav(page.url) }}
        text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)
        text = re.sub(r'[*_`#>]', '', text)
        return re.sub(r'\s+', ' ', text).strip()

    def _get_all_posts():
        """
        Scan docs/blog for every post with front matter title/date,
        sorted newest-first. Shared by recent_posts(), post_nav(), and
        all_posts_grouped() so the scanning logic exists in exactly
        one place.
        """
        blog_dir = os.path.join(docs_dir, "blog")
        files = glob.glob(os.path.join(blog_dir, "**", "*.md"), recursive=True)

        posts = []
        for f in files:
            meta, body = _read_frontmatter(f)
            if not meta.get("date"):
                continue

            date_value = meta["date"]
            post_date = date_value if isinstance(date_value, datetime) else datetime.fromisoformat(str(date_value))
            excerpt = _strip_markdown(body)[:140].rstrip() + "…"
            rel = os.path.relpath(f, docs_dir).replace("\\", "/")

            posts.append({"title": meta.get("title", "Untitled"), "date": post_date, "rel": rel, "excerpt": excerpt})

        posts.sort(key=lambda p: p["date"], reverse=True)
        return posts

    def _post_url(rel):
        """
        Convert a docs-relative .md path into an absolute site URL,
        e.g. "blog/2026/07/05/slug.md" -> "/blog/2026/07/05/slug/".
        Absolute (leading "/") so it resolves correctly regardless of
        how deep the CURRENT page sits.
        """
        path = rel[:-3] if rel.endswith(".md") else rel
        return "/" + path.rstrip("/") + "/"

    @env.macro
    def recent_posts(count=5):
        """
        Return an HTML list of the most recent `count` posts, each
        with an icon, title, date/time, and excerpt. Ends with a
        right-aligned "More »" link to blog.md, using the same
        newspaper icon as the Blog nav tab. Home page always sits at
        the site root, so plain relative hrefs are safe here.

        Uses front matter `date`, never file mtime — GitHub Actions
        resets every file's timestamp on each checkout.
        """
        posts = _get_all_posts()
        icon_svg = _read_icon("newspaper")

        items = []
        for p in posts[:count]:
            date_str = p["date"].strftime("%d-%b-%Y | %H:%M:%S").upper()

            items.append(
                '<li><div class="post-header"><span class="post-icon">{icon}</span>'
                '<a href="{url}" class="post-title">{title}</a></div>'
                '<span class="post-date">{date}</span>'
                '<p class="post-excerpt">{excerpt}</p></li>'.format(
                    icon=icon_svg, url=p["rel"], title=p["title"], date=date_str, excerpt=p["excerpt"]
                )
            )

        list_html = '<ul class="recent-posts">\n' + "\n".join(items) + "\n</ul>"

        more_link = (
            '<p class="recent-posts-more">'
            '<a href="blog.md"><span class="post-icon-inline">{icon}</span>More »</a>'
            '</p>'
        ).format(icon=icon_svg)

        return list_html + "\n" + more_link

    @env.macro
    def post_nav(current_url):
        """
        Show "Newer" / "Older" links at the bottom (and top) of a post,
        based on the same sorted list recent_posts() uses.

        current_url is the calling page's own page.url — a built-in
        value Zensical provides automatically for every page, so no
        post ever needs to manually type its own file path. Call this
        as {{ post_nav(page.url) }} in every post.
        """
        def _norm(u):
            return u.strip("/")

        posts = _get_all_posts()
        idx = next(
            (i for i, p in enumerate(posts) if _norm(_post_url(p["rel"])) == _norm(current_url)),
            None
        )
        if idx is None:
            return ""

        newer = posts[idx - 1] if idx > 0 else None
        older = posts[idx + 1] if idx < len(posts) - 1 else None

        arrow_left = _read_icon("chevron-left")
        arrow_right = _read_icon("chevron-right")

        parts = ['<nav class="post-nav">']
        if newer:
            parts.append(
                '<a class="post-nav-newer" href="{url}">'
                '<span class="post-nav-icon">{icon}</span>{title}</a>'.format(
                    url=_post_url(newer["rel"]), icon=arrow_left, title=newer["title"]
                )
            )
        if older:
            parts.append(
                '<a class="post-nav-older" href="{url}">'
                '{title}<span class="post-nav-icon">{icon}</span></a>'.format(
                    url=_post_url(older["rel"]), title=older["title"], icon=arrow_right
                )
            )
        parts.append('</nav>')
        return "\n".join(parts)

    @env.macro
    def all_posts_grouped():
        """
        Return every post, grouped by "Month Year" (most recent group
        first), each group as a collapsible <details> block, expanded
        by default. Includes Expand All / Collapse All buttons at the
        top; extra.js wires up their click behavior.

        Uses _post_url() (absolute paths) rather than recent_posts()'s
        relative paths, since this macro is called from blog.md, which
        sits one level deep (/blog/) rather than at the site root.
        """
        posts = _get_all_posts()
        icon_svg = _read_icon("newspaper")
        expand_icon = _read_icon("chevrons-down")
        collapse_icon = _read_icon("chevrons-up")

        groups = []
        current_label = None
        for p in posts:
            label = p["date"].strftime("%B %Y")
            if label != current_label:
                groups.append((label, []))
                current_label = label
            groups[-1][1].append(p)

        parts = [
            '<div class="blog-controls">'
            '<button type="button" class="blog-expand-all" title="Expand all">'
            '<span class="btn-icon">{expand}</span><span class="btn-label">Expand all</span></button>'
            '<button type="button" class="blog-collapse-all" title="Collapse all">'
            '<span class="btn-icon">{collapse}</span><span class="btn-label">Collapse all</span></button>'
            '</div>'.format(expand=expand_icon, collapse=collapse_icon)
        ]

        for label, group_posts in groups:
            items = []
            for p in group_posts:
                date_str = p["date"].strftime("%d-%b-%Y | %H:%M:%S").upper()
                items.append(
                    '<li><div class="post-header"><span class="post-icon">{icon}</span>'
                    '<a href="{url}" class="post-title">{title}</a></div>'
                    '<span class="post-date">{date}</span>'
                    '<p class="post-excerpt">{excerpt}</p></li>'.format(
                        icon=icon_svg, url=_post_url(p["rel"]), title=p["title"],
                        date=date_str, excerpt=p["excerpt"]
                    )
                )
            parts.append(
                '<details class="month-group" open><summary>{label}</summary>'
                '<ul class="recent-posts">\n{items}\n</ul></details>'.format(
                    label=label, items="\n".join(items)
                )
            )

        return "\n".join(parts)