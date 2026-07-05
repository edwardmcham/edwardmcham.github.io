---
title: Single-Sourcing Every Icon on the Site
date: 2026-07-05 01:37:59
tags:
  - Blog
  - Docs-as-Code
---

{{ post_nav(page.url) }}

An earlier post in this series covered single-sourcing contact info through a Python macro. The same discipline applied to something smaller but just as repetitive: every icon on the site.

## Before

Icons showed up in three different forms depending on where they lived: shortcode text (`:fontawesome-solid-envelope:`) for the footer and social row, and a raw SVG path pasted directly into JavaScript as a string for the external-link arrow icon that appears next to outbound links.

## The challenge

The external-link icon's SVG path was over 500 characters of raw path data sitting inline in `extra.js`. If that icon ever needed a style tweak or a replacement, the only way to change it was editing a giant unreadable string directly inside a JavaScript file — exactly the kind of duplication single-sourcing is supposed to prevent, just one level deeper than the contact-info case.

## The theory behind the fix

Zensical already bundles a full Lucide icon set internally — that's what powers the site's `icon: lucide/rocket` front matter and the palette toggle icons. Rather than write or fetch new icon data from scratch, the same real `.svg` files could be copied straight out of the installed Zensical package into the project's own `docs/assets/icons/` folder. From there, both Python (`main.py`) and JavaScript (`extra.js`) read the same physical files — one `fetch()` call in JS, one `open()` call in Python — instead of embedding icon data as a string in either language.

```
docs/assets/icons/*.svg   (single source, one file per icon)
        |                              |
        v                              v
main.py: open() + cache          extra.js: fetch() + cache
(nav tab icons, blog list icon)  (external-link arrow icon)
```

## Code changes, by file

**`docs/assets/icons/external-link.svg`** — the icon as its own file, copied from a verified Font Awesome path:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
  <path d="M288 32c-17.7 0-32 14.3-32 32s14.3 32 32 32h50.7L169.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L384 141.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V64c0-17.7-14.3-32-32-32H288zM80 64C35.8 64 0 99.8 0 144V400c0 44.2 35.8 80 80 80H336c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v80c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V144c0-8.8 7.2-16 16-16h80c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"/>
</svg>
```

**`docs/javascripts/extra.js`** — fetch and cache it once, reuse for every matching link:
```javascript
let _externalIconPromise = null;
function getExternalIcon() {
  if (!_externalIconPromise) {
    _externalIconPromise = fetch("/assets/icons/external-link.svg").then(function(r) {
      return r.text();
    });
  }
  return _externalIconPromise;
}
```

The same pattern already applied to the nav tab icons (`newspaper.svg`, `file-user.svg`, `layout-grid.svg`), copied directly from Zensical's own bundled Lucide set rather than sourced separately.

## After

Every icon on the site — social row, footer, nav tabs, external-link arrows — now traces back to exactly one `.svg` file each. Changing an icon's shape or swapping it out means editing one small file, not a string buried inside JavaScript or Python.

See it live: [edwardmcham.github.io](https://edwardmcham.github.io/)

{{ post_nav(page.url) }}
