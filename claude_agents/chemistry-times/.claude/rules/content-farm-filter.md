---
name: Content Farm Filter
description: Block content farm sources and enforce credibility tiering and corroboration requirements
---

# Content Farm Filter

## Applicability

- Applies to: Digital Journalist, Data Auditor

## Rule Content

### Domain Blacklist

You must not use content from the following domains as a source:
- kknews.cc
- each.com
- cocomy.net
- read01.com
- 每日头条 (meidiarilyheadline variants)
- Any domain that aggregates content without original reporting and no identifiable editorial team

If a URL resolves to a blacklisted domain after redirects, it is still blacklisted.

### Content Farm Detection Criteria

Any source exhibiting 2 or more of the following traits must be classified as a content farm and rejected:

1. No byline or author attribution on the article
2. Headline is pure clickbait with no factual anchor (e.g., "You won't believe what happened next")
3. Content is recycled from another source without original reporting or added value
4. Advertisement-to-content ratio exceeds 50% of page area
5. Domain appears on the blacklist above

### Source Credibility Tiers

Every source used in a story must be tagged with one of the following tiers:

- **Tier 1**: Official announcements, company press releases, government publications, peer-reviewed research
- **Tier 2**: Established news outlets with editorial staff (e.g., TechCrunch, Reuters, The Information, iThome)
- **Tier 3**: Social media posts, forums, personal blogs, secondary aggregators

A Tier 3 source may only be used if at least one Tier 1 or Tier 2 source corroborates the same fact.

### Source Attribution Fields

Every source entry in the source bundle must include:
- Source name
- Full URL
- Author name (or "No byline" if absent — which triggers content farm check)
- Publication date

## Violation Determination

- Any article includes content from a blacklisted domain → Violation
- Source with 2+ content farm traits is accepted and not rejected → Violation
- Tier 3 source used without Tier 1 or Tier 2 corroboration → Violation
- Source bundle entry missing URL, name, or publication date → Violation
- Source credibility tier tag absent from any source entry → Violation

## Exceptions

This rule has no exceptions.
