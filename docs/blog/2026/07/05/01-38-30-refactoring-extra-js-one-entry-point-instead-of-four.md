---
title: 'Refactoring extra.js: One Entry Point Instead of Four'
date: 2026-07-05 01:38:30
tags:
  - Blog
---

{{ post_nav(page.url) }}

Tonight's site work kept adding small pieces of client-side behavior — external link handling, a lightbox modal, a dynamic copyright year, icon injection. Each one got its own `document$.subscribe()` call as it was added. By the fourth one, the file was harder to scan than it needed to be.

## Before

`extra.js` had four separate `document$.subscribe(function() {...})` blocks, each defining and running one piece of behavior inline, in the order they'd been added over the course of the evening.

## The challenge

Nothing was actually broken — each block worked correctly on its own. But with four separate subscription calls scattered through the file, there was no single place to see everything that runs on page load, and adding a fifth behavior later would mean deciding where in the file to put yet another block.

## The theory behind the fix

`document$` is an observable that fires once per page view. Calling `.subscribe()` multiple times just registers multiple callbacks for that same event — there's no extra network request or measurable performance cost either way. So consolidating to one subscription is a readability choice, not an optimization: name each behavior as its own function, then call all of them from a single shared subscription at the bottom of the file.

```
Before:                          After:
subscribe() { ... links ... }    function initExternalLinks() { ... }
subscribe() { ... lightbox ... } function initGLightbox() { ... }
subscribe() { ... year ... }     function updateCopyrightYear() { ... }
subscribe() { ... icons ... }    function initNavIcons() { ... }

                                  subscribe() {
                                    initExternalLinks();
                                    initGLightbox();
                                    updateCopyrightYear();
                                    initNavIcons();
                                  }
```

## Code changes, by file

**`docs/javascripts/extra.js`** — each behavior became a named function, called once from a shared subscription:
```javascript
function initExternalLinks() {
  // external link target="_blank" + icon logic
}

function initGLightbox() {
  // certification badge modal init
}

function updateCopyrightYear() {
  // footer year, with a null check for safety
}

function initNavIcons() {
  // fetches and inserts nav tab icons
}

document$.subscribe(function() {
  initExternalLinks();
  initGLightbox();
  updateCopyrightYear();
  initNavIcons();
});
```

## After

One place in the file now shows exactly what runs on every page load, in a guaranteed order — no change in actual behavior or performance, just a clearer file to come back to later.

See it live: [edwardmcham.github.io](https://edwardmcham.github.io/)

{{ post_nav(page.url) }}
