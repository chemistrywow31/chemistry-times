---
name: Content Farm Filter
description: Block content farm sources and enforce credibility tiering and corroboration requirements
---

# Content Farm Filter

## Applicability

- Applies to: Digital Journalist, Data Auditor

## Rule Content

### Domain Blacklist

Do not use content from: kknews.cc, each.com, cocomy.net, read01.com, twgreatdaily.com, zi.media, or any domain that aggregates content without original reporting.

### Content Farm Detection

Any source with 2+ of these traits is a content farm — reject it:
1. No byline or author attribution
2. Headline is pure clickbait with no factual anchor
3. Content recycled from another source without original reporting
4. Ad-to-content ratio exceeds 50%
5. Domain on the blacklist

### Source Credibility Tiers

| Tier | Definition | Usage Rule |
|------|-----------|------------|
| Tier 1 | Official announcements, press releases, government publications, peer-reviewed research | Full use |
| Tier 2 | Established news outlets with editorial staff | Full use |
| Tier 3 | Social media, forums, blogs, aggregators | Must corroborate with Tier 1 or Tier 2 |

### Source Attribution Fields

Every source entry must include: source name, full URL, author name (or "No byline"), publication date.

## Violation Determination

- Article includes content from a blacklisted domain -> Violation
- Source with 2+ content farm traits accepted -> Violation
- Tier 3 source used without Tier 1/2 corroboration -> Violation
- Source entry missing URL, name, or publication date -> Violation

## Exceptions

- This rule has no exceptions.
