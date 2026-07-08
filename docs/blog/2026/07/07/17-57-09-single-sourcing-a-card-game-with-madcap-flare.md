---
title: Single-Sourcing a Card Game With MadCap Flare
date: 2026-07-07 17:57:09
tags:
  - Blog
  - MadCap Flare
  - single-sourcing
  - portfolio
---

{{ post_nav(page.url) }}

## Where the idea came from

Ultimate Chess started at my neighbor's kitchen table. Their two sons, 15 and 12, and I wanted to make chess less predictable. We landed on resolving captures with a card battle instead of a straight piece-value swap: three cards face down, one face up, higher card wins. Add Jokers (a. k. a. *Snipers*) for bonus effects. Drop check and checkmate. The result plays fast and stays tense until the last king falls.

![Ultimate Chess board and cards](/assets/images/chess-king_51x55.png "EEK!!!") &nbsp;&nbsp; ![Sniper card](/assets/images/evil_joker_card_238x362.jpg "HA HA HA!!!")

I wrote the rules down so we wouldn't forget them. Then I saw a second use: original content, no employer IP, good size for a first Flare project.

## Why this project

I'd never used [MadCap Flare](https://www.madcapsoftware.com/products/flare/). I had a 30-day trial and a self-imposed deadline, so I needed real content to import, not a placeholder. The rulebook fit: enough sections for a TOC and cross-references, small enough to finish in a few evenings.

The project covered:

- Importing a Word draft as the source
- Organizing topics and building a table of contents
- Building [HTML5](https://edwardmcham.github.io/UltimateChess/Default.htm) and [PDF](https://edwardmcham.github.io/UltimateChess/UltimateChess-PDF.pdf) targets from one source
- Publishing the HTML5 output to [GitHub Pages](https://github.com/edwardmcham/UltimateChess)

One source, two outputs, no retyping. That's the single-sourcing pitch, and building it once made it concrete.

## A disclaimer on the output

The published HTML5 topics have random garbled characters. That's a limitation of Flare's 30-day trial, not a typo. I chose to publish as-is rather than wait for a license I don't currently have budget for. The DOCX version of the rulebook is clean if you want to read the actual writing.

## What's next

Two things I'd add with more time:

- A second audience view using conditional content
- MadCap Central for publishing instead of a manual Git push
 
For now, this got me through Flare's project structure and one real single-sourcing pass, start to finish.

{{ post_nav(page.url) }}
