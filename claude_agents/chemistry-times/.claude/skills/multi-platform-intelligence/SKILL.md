---
name: Multi-Platform Intelligence
description: Systematic multi-platform news gathering with source prioritization and content farm filtering
---

# Multi-Platform Intelligence

## Description

This skill provides a structured methodology for gathering news and intelligence across multiple platforms, applying source credibility tiering, filtering out content farms, and packaging results for downstream verification and analysis.

## Users

This skill is used by the following agents:
- Digital Journalist: primary user for daily news gathering across all platforms
- Analysts (Online English Education, Marketing, Tech): secondary users for targeted topic research

## Core Knowledge

### Platform Registry

| Category | Platforms |
|----------|-----------|
| News | TechCrunch, The Verge, Wired, 36Kr, Inside, iThome, TechOrange, Bnext, EdSurge |
| Social | Facebook Pages, X/Twitter, Threads |
| Forums | PTT (Gossiping, Tech_Job, Soft_Job), Reddit (r/education, r/languagelearning, r/artificial), Dcard |
| Tech | Hacker News, GitHub Trending, Product Hunt, ArXiv (AI papers) |
| Industry | ChemistryTimes competitor sites, online education review sites, Crunchbase |

### Search Query Construction

Combine keywords using these templates per platform:

- News sites: `"{company}" OR "{topic}" site:{domain} after:{YYYY-MM-DD}`
- Social/Forums: `"{keyword}" lang:zh OR lang:en` + platform-specific filters
- ArXiv: category filter `cs.CL`, `cs.AI`, `cs.LG` + keywords from editorial brief
- GitHub: use trending page directly (daily/weekly), supplement with topic search

### Content Farm Detection Heuristics

Apply the following checks to every source:

**Domain Blacklist** — Reject immediately if domain matches:
`kknews.cc`, `each.com`, `cocomy.net`, `read01.com`, `twgreatdaily.com`, `zi.media`

**Red Flags** — Score one point each:
1. No author byline
2. No publication date
3. Excessive keyword density (keyword appears >5x in 500 words with no variation)
4. Content recycled from other outlets without original reporting
5. Ad-to-content ratio exceeds 50%

**Rule**: 2+ red flags = content farm. Reject the source. Do not use even for secondary corroboration.

### Source Credibility Tiering

| Tier | Definition | Examples |
|------|------------|---------|
| Tier 1 | Primary sources: official announcements, press releases, SEC filings, peer-reviewed papers | Company IR pages, government portals, journals |
| Tier 2 | Reputable media: major news outlets, established tech blogs with editorial standards | TechCrunch, Reuters, The Verge, iThome |
| Tier 3 | Social/forum: requires cross-verification with Tier 1 or Tier 2 before use | X/Twitter, PTT, Dcard |

You must not publish claims based solely on Tier 3 sources without corroboration.

### Temporal Relevance

- Prioritize items published within the last 24 hours
- Flag items older than 48 hours with a `[STALE]` marker
- Items older than 7 days require editor approval to include

### Output Format Per Item

Each gathered item must include these fields:

```json
{
  "title": "...",
  "source": "...",
  "url": "...",
  "platform": "...",
  "credibility_tier": "1 | 2 | 3",
  "timestamp": "ISO 8601",
  "summary": "2-3 sentences: what happened, who is affected, why it matters"
}
```

## Application Guide

### Scenario A: Editorial Brief with Named Company or Product

1. Extract company name, product name, and topic keywords from brief
2. Search Tier 1 sources first (official site, IR page, press releases)
3. Search Tier 2 outlets using query templates
4. Search social/forum (Tier 3) for sentiment and secondary signals
5. Apply content farm checks to all results
6. Assemble output package with all passing items, sorted by credibility tier

### Scenario B: Open Topic Sweep (Daily Briefing)

1. Run platform sweep in this order: News → Tech → Social/Forum → Industry
2. Collect minimum 8 items across categories before filtering
3. Apply content farm and temporal relevance filters
4. Select top items covering: education market (3+), technology (3+), ChemistryTimes competitive signals (2+)
5. Package results for Data Auditor handoff

## Quality Checkpoints

- [ ] Every item has all 6 required output fields populated
- [ ] No items sourced from blacklisted domains
- [ ] Items with 2+ red flags are excluded
- [ ] Tier 3 items are flagged for cross-verification, not treated as standalone sources
- [ ] Items older than 48 hours are marked `[STALE]`
- [ ] Minimum item count per category is met before handoff

## Example

### Input
Editorial brief: "Investigate 51Talk's new AI tutor feature announced on X"

### Output
```json
[
  {
    "title": "51Talk Launches AI Tutor v2.0 — Official Announcement",
    "source": "51Talk Investor Relations",
    "url": "https://ir.51talk.com/...",
    "platform": "News (Tier 1)",
    "credibility_tier": "1",
    "timestamp": "2026-03-17T09:00:00Z",
    "summary": "51Talk officially announced AI Tutor v2.0 with real-time pronunciation correction. Launch date Q2 2026. Targets adult business English learners."
  },
  {
    "title": "51Talk AI Tutor hands-on first look",
    "source": "TechCrunch",
    "url": "https://techcrunch.com/...",
    "platform": "News (Tier 2)",
    "credibility_tier": "2",
    "timestamp": "2026-03-17T14:30:00Z",
    "summary": "TechCrunch reporter tested AI Tutor v2.0. Notes strong pronunciation feedback but limited conversation depth compared to human tutors."
  },
  {
    "title": "51Talk AI功能體驗 [STALE]",
    "source": "PTT Soft_Job",
    "url": "https://ptt.cc/...",
    "platform": "Forum (Tier 3)",
    "credibility_tier": "3",
    "timestamp": "2026-03-14T22:00:00Z",
    "summary": "User reports positive experience with AI pronunciation coach. Single user perspective, requires cross-verification. Marked STALE (>48h)."
  }
]
```
