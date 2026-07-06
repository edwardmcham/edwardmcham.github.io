# Purpose

Migrating resume and portfolio from WordPress to [Zensical][1].

## Challenges of WordPress Portfolio

- Workflow for making simple content updates is too slow and complex.
- Visual results not reliable.
- Bluehost costs too much for web hosting.
- For a simple online resume and list of projects and achievements, WordPress feels disproportionate and increasingly outdated.
- Most recent page load speed: **1.32s** [^1]

## Why [Zensical][1]?

- Enables content authoring in Markdown. Simple.
- Zensical-based theme (formerly MkDocs / Material theme) ensures consistent look and feel.
- GitHub Pages `=>` free hosting.
- Modern "docs-as-code" workflow, which effectively makes this very repo a portfolio item.
- Most recent page load speed: **0.45s** [^1]

[^1]: Based on Chrome DevTools, Performance tab.

### Additional Features

- Filterable keyword search
- Mobile-friendly
- Light / dark / auto mode
- Snippets, custom `main.py`, and HTML overrides => content reuse, which Markdown by itself doesn't provide
- Custom PowerShell script `=>` quick blog post creation based on my own custom MD template, complete w/YAML front matter `=>` blog post tagging / search filtering
- Custom batch script `=>` starts up new VSCode terminal, builds and opens new Zensical localhost `=>` quick / easy QA

[1]: https://zensical.org
