<#
.SYNOPSIS
    Scaffolds a new blog post: prompts for a title, creates the dated
    folder (docs/blog/YYYY/MM/DD/), and writes a Markdown file with
    title + date front matter already filled in, then opens it in
    VS Code.

.NOTES
    Filenames use a time prefix (HH-mm-ss-slug.md) so more than one
    post can be created on the same day without colliding, while still
    sorting correctly by filename.

    Re-prompts for a different title if a post with the same title
    already exists in that day's folder. The same title on a
    DIFFERENT date is untouched and allowed.
#>

do {
    $Title = Read-Host "Blog post title"

    # Build today's date/time and the target folder path
    # (docs/blog/YYYY/MM/DD/) from the current moment.
    $now = Get-Date
    $folder = "docs\blog\$($now.ToString('yyyy'))\$($now.ToString('MM'))\$($now.ToString('dd'))"
    New-Item -ItemType Directory -Path $folder -Force | Out-Null

    # Build a URL-safe filename: lowercase, non-alphanumeric runs
    # replaced with a single hyphen, trimmed of leading/trailing
    # hyphens, then prefixed with the current time so same-day posts
    # never collide and still sort chronologically by filename.
    $slug = ($Title.ToLower() -replace '[^a-z0-9]+', '-').Trim('-')
    $slug = "$($now.ToString('HH-mm-ss'))-$slug"
    $filePath = "$folder\$slug.md"

    # If a post with this exact filename already exists today,
    # loop back and ask for a different title instead of overwriting it.
    if (Test-Path $filePath) {
        Write-Host "A post titled '$Title' already exists for today. Choose a different title." -ForegroundColor Yellow
        $Title = $null
    }
} while (-not $Title)

# Front matter block every post needs: title and date drive
# recent_posts() in main.py, which sorts and lists posts on the home
# page using these fields (never the file's modified timestamp).
$frontMatter = @"
---
title: $Title
date: $($now.ToString('yyyy-MM-dd HH:mm:ss'))
tags:
  - Blog
---

"@

Set-Content -Path $filePath -Value $frontMatter -Encoding UTF8
code $filePath
