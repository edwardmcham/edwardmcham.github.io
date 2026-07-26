---
title: Ultimate Chess Is Live — Go Play It!
date: 2026-07-26 02:26:52
description: "The card-battle chess variant we invented at a kitchen table is now a real, playable game with an AI opponent. Here's the story, and how to play."
tags:
  - blog
  - game-dev
  - MadCap Flare
  - chess
  - AI
  - Claude
---

{{ post_nav(page.url) }}

# ![banner](https://github.com/edwardmcham/UltimateChess/raw/main/help/Content/img/ultimate_chess_banner.png) Ultimate Chess Is Live!!!

[:material-play-circle:](https://edwardmcham.github.io/UltimateChess/ "Play it now »")
 
## Where it started
 
I came up with the game idea and tried it with my neighbor's sons. We wanted to see what it would be like if chess pieces could "fight back" when faced with capture. I then wrote the rules so we wouldn't lose them.

I recently began bulking up on my tech writing tool set, including [Zensical](https://zensical.org/) and [MadCap Flare](https://www.madcapsoftware.com/products/flare/). Initially, I used Flare to write the HTML5 and PDF rule book.

And then, one morning, I had another epiphany: *Ask Claude AI to read the Ultimate Chess rule book and actually build the game.*

:material-cards-playing-club: :material-cards-playing-diamond: :material-chess-king: :material-chess-queen: :material-chess-bishop: **And it did.** :material-chess-rook: :material-chess-knight: :material-chess-pawn: :material-cards-playing-heart: :material-cards-playing-spade:
 
## What it turned into
 
A single house rule doesn't stay a house rule for long once you start building it for real. Ultimate Chess is now a full browser game — no install, no account.
 
- **Card-battle captures.** Every capture draws a card from each side's deck. Higher card wins; the loser's piece is removed. No exceptions, no "well actually."
- **Check without checkmate.** A king in danger is genuinely in danger — but the only way to actually win is a **King Battle**: a best-of-three fight for the throne.
- **Snipers and Armageddon.** Draw a Sniper and you auto-win the exchange and take a bonus piece. Draw two in the same battle, and it's Armageddon — both pieces die, then each side loses up to three more.
- **An actual AI opponent.** Five personalities — *Aggressive, Cautious, Reckless, Positional, Random* — running real game-tree search, with thinking time you control from instant to three minutes.
## How to play
 
Open the [game](https://edwardmcham.github.io/UltimateChess/), pick **Human (pass & play)** or **Computer**, draw for color, and go. Legal moves highlight when you tap a piece; captures trigger the card battle overlay automatically. The full rule book — King Battles, Sniper mechanics, Armageddon, all of it — lives in the [Player's Guide](https://edwardmcham.github.io/UltimateChess/help/Content/Ultimate%20Chess%20%E2%80%94%20Players%20Guide.htm), built with MadCap Flare and covered in more detail in [the last post](/blog/2026/07/07/17-57-09-ultimate-chess-single-sourcing-a-card-game-with-madcap-flare/) about single-sourcing it.
 
## Why I built it this way
 
No framework, no build pipeline for the game itself — just JavaScript, HTML, and CSS. The AI opponent was the harder problem: `expectiminimax` search, iterative deepening, and a weighted-random layer for instant-mode moves so it doesn't play *too* predictably at the fastest setting. All of it is covered by a `Node.js/jsdom` test harness, with Monte Carlo simulation to sanity-check the AI's move-selection probabilities instead of just eyeballing it.
 
It's free, it's non-commercial, and it's exactly the game those two kids and I argued into existence at their kitchen table. Go play it.

{{ post_nav(page.url) }}
