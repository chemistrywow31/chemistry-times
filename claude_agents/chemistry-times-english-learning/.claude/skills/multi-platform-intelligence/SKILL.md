---
name: Multi-Platform Intelligence
description: Systematic multi-platform news gathering with source prioritization and content farm filtering across tech and general media
---

# Multi-Platform Intelligence

## Description

This skill provides a structured methodology for gathering news and intelligence across tech and general news platforms, applying source credibility tiering, filtering content farms, and packaging results for downstream verification.

## Users

- Digital Journalist: primary user for daily news gathering
- Tech Analyst, Business Analyst, World News Analyst: secondary users for targeted research

## Core Knowledge

### Platform Registry

| Category | Platforms |
|----------|-----------|
| Tech News | TechCrunch, The Verge, Wired, iThome, Inside, TechOrange, Bnext |
| General News | BBC, CNN, Reuters, NYT, The Guardian, AP News, Al Jazeera English |
| Social | X/Twitter, Threads, LinkedIn |
| Forums | PTT (Gossiping, Tech_Job, Soft_Job), Reddit (r/MachineLearning, r/worldnews, r/technology), Dcard, Hacker News |
| Tech Platforms | GitHub Trending, Product Hunt, ArXiv, HuggingFace Daily Papers |
| Industry | Crunchbase, GamesIndustry.biz, IGN |

### Search Query Construction

- News sites: `"{company}" OR "{topic}" site:{domain} after:{YYYY-MM-DD}`
- Social/Forums: `"{keyword}" lang:zh OR lang:en` + platform filters
- ArXiv: category filter `cs.CL`, `cs.AI`, `cs.LG` + keywords
- GitHub: trending page (daily/weekly) + topic search

### Content Farm Detection

**Blacklist**: kknews.cc, each.com, cocomy.net, read01.com, twgreatdaily.com, zi.media

**Red flags** (2+ = content farm):
1. No author byline
2. No publication date
3. Excessive keyword density
4. Recycled content without attribution
5. Ad-to-content ratio > 50%

### Source Credibility Tiering

| Tier | Definition | Examples |
|------|-----------|---------|
| 1 | Primary sources | Company IR pages, government portals, peer-reviewed papers |
| 2 | Reputable media | TechCrunch, Reuters, BBC, The Guardian |
| 3 | Social/forum | X/Twitter, PTT, Reddit — requires corroboration |

### Output Format Per Item

```json
{
  "title": "...", "source": "...", "url": "...",
  "platform": "...", "credibility_tier": "1|2|3",
  "timestamp": "ISO 8601",
  "summary": "2-3 sentences: what, who affected, why it matters",
  "image_url": "..."
}
```

## Application Guide

### Scenario A: Named Company/Product
1. Search Tier 1 first (official site, IR, press releases)
2. Search Tier 2 outlets
3. Search Tier 3 for sentiment
4. Apply content farm checks
5. Assemble sorted by tier

### Scenario B: Daily Open Sweep
1. Scan X aggregator (x.deepsrt.com) first
2. Check beat sources per source-registry
3. Run open WebSearch for uncovered stories
4. Minimum 8 items across categories before filtering
5. Package for Data Auditor

### Scenario C: Breaking News Fast Track
1. Identify the primary source immediately
2. Check 2 Tier 2 sources for confirmation
3. Skip full platform sweep
4. Tag as `[URGENT]` and deliver to Editor-in-Chief directly

## Quality Checkpoints

- [ ] Every item has all required output fields
- [ ] No items from blacklisted domains
- [ ] Items with 2+ red flags excluded
- [ ] Tier 3 items flagged for cross-verification
- [ ] Items older than 48 hours marked `[STALE]`
