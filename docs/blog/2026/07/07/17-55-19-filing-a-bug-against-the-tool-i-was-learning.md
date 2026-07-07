---
title: Filing a Bug Against the Tool I Was Learning
date: 2026-07-07 17:55:19
tags:
  - Blog
  - Zensical
  - open-source
  - single-sourcing
  - portfolio
---

{{ post_nav(page.url) }}

## What happened

While building this site in Zensical, I ran into a case where the iframe-worker polyfill wasn't being appended when a page needed it. Nothing dramatic — a check in Zensical's build step wasn't catching one condition correctly, and the site would occasionally not load an embedded element the way it should have.

I didn't set out to find a bug. I was just building pages, hit something unexpected, and started narrowing it down instead of working around it: isolate the page, strip it back to the smallest markup that still reproduced the problem, confirm it wasn't a mistake in my own config. Once I could reliably reproduce it on a minimal page, I had enough to file something useful.

## Filing it

I opened [issue #785](https://github.com/zensical/zensical/issues/785) against the Zensical repo on July 2, with the repro steps and what I expected to happen instead. Zensical is still on 0.0.x versioning — an active, fast-moving open source project from the Material for MkDocs team — so I didn't know what to expect for turnaround.

Three days later, on July 5, the fix shipped in release 0.0.47.

## Why this is worth writing down

I didn't file this to make a point. I filed it because I was already in the codebase's output, hit something broken, and had the reproduction steps in hand anyway. But it's a good example of something I look for as a writer, not just a developer: when documentation or tooling doesn't behave the way it's described, the useful response is a specific, reproducible report, not a workaround buried in your own notes. The same instinct applies to writing docs — if something's unclear or wrong, flag it precisely enough that someone else can act on it without having to reproduce your confusion first.

It's a small thing. A three-day turnaround on an open source project with thousands of users is also a nice reminder that a clear bug report, filed by someone outside the project, can move fast when it's specific.

{{ post_nav(page.url) }}
