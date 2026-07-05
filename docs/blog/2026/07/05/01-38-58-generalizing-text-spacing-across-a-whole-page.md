---
title: Generalizing Text Spacing Across a Whole Page
date: 2026-07-05 01:38:58
tags:
  - Blog
---

{{ post_nav(page.url) }}

A small formatting request — add breathing room around the `|` separators between company, location, and dates on the resume page — turned into a useful lesson about when to stop special-casing and generalize instead.

## Before

The first fix targeted job entries specifically: each one renders as several `<em>` tags (company, location, dates) with bare `|` text sitting between them as sibling nodes. A script walked those specific `<em>` tags and wrapped the `|` in a styleable `<span>`.

## The challenge

The very next line needing the same spacing — the header subtitle ("Senior Technical Writer / Documentation Engineer | Vienna, VA") — used a completely different HTML shape: one continuous `<strong>` tag, no separate `<em>` siblings at all. That needed a second, separate function. Then the Education/Certifications section surfaced a third shape: some lines have a link before the pipe, some don't, some are plain text on both sides. Three special cases for one visual effect, with no guarantee a fourth wouldn't show up somewhere else on the page.

## The theory behind the fix

Instead of pattern-matching specific known HTML shapes, walk every text node in the page's content directly using a `TreeWalker`, and wrap any literal `|` character found — regardless of what surrounds it. One function replaces three, and it doesn't care whether future content has yet another new shape.

```
Old approach:                    New approach:
Shape A -> special function A    Walk every text node in the page
Shape B -> special function B    Find any "|" character
Shape C -> special function C    Wrap it in a <span>, skip already-wrapped ones
(Shape D would need function D)  (works on any future shape automatically)
```

## Code changes, by file

**`docs/javascripts/extra.js`** — one function replacing three:
```javascript
function initPipeSeparators() {
  var root = document.querySelector(".md-content__inner.md-typeset");
  if (!root) return;

  var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
  var nodes = [];
  while (walker.nextNode()) {
    var node = walker.currentNode;
    if (node.parentElement.closest(".job-meta-sep")) continue;
    if (node.nodeValue.indexOf("|") !== -1) nodes.push(node);
  }

  nodes.forEach(function(node) {
    var parts = node.nodeValue.split("|");
    if (parts.length < 2) return;

    var frag = document.createDocumentFragment();
    parts.forEach(function(part, i) {
      frag.appendChild(document.createTextNode(part));
      if (i < parts.length - 1) {
        var span = document.createElement("span");
        span.className = "job-meta-sep";
        span.textContent = "|";
        frag.appendChild(span);
      }
    });
    node.replaceWith(frag);
  });
}
```

No CSS changes were needed — the existing `.job-meta-sep` styling rule applied automatically to every newly-wrapped separator, since the class name stayed the same across the rewrite.

## After

Every `|` on the resume page — job entries, the header subtitle, and every line in Education/Certifications, including ones with no links at all — now gets consistent spacing from one function, with no dependency on knowing every HTML shape in advance.

See it live: [edwardmcham.github.io/resume/](https://edwardmcham.github.io/resume/)

{{ post_nav(page.url) }}
