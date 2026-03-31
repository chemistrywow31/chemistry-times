---
name: Temporal Awareness
description: Enforce date verification and information freshness classification for all research tasks
---

# Temporal Awareness

## Applicability

- Applies to: Digital Journalist, Data Auditor, Tech Analyst, Business Analyst, World News Analyst, Chinese Daily Writer, English Content Curator

## Rule Content

### Establish Date Baseline

Execute `date '+%Y-%m-%d'` at the start of every task to obtain the current system date. Store this as your date baseline. Do not rely on memory or assumptions for today's date.

### Tag Publication Date

Tag every piece of gathered information with its publication date. If no date is discernible, tag with `[日期不明 / Date Unknown]` and downgrade credibility tier by one level.

### Freshness Classification

| Time Since Publication | Tag | Usage Rule |
|----------------------|-----|------------|
| 0-24 hours | `[即時 / Breaking]` | Full use as daily news |
| 2-7 days | `[近期 / Recent]` | Usable; must note actual date in article |
| 8-30 days | `[非即時 / Not Breaking]` | Must not present as new; state actual date prominently |
| 31+ days | `[歷史資料 / Archival]` | Background reference only |
| Unknown | `[日期不明 / Date Unknown]` | Requires Tier 1/2 corroboration |

### Writer Obligation

- `[即時]`: May use "今日", "today"
- `[近期]`: Must include actual date
- `[非即時]`: Must open with temporal context
- `[歷史資料]`: Must frame as background

### Prohibition

Do not describe items older than 7 days using language that implies recency ("近日", "recently", "just", "breaking").

## Violation Determination

- Agent starts task without executing `date` command -> Violation
- Item passed downstream without freshness tag -> Violation
- Item older than 7 days described with recency language -> Violation

## Exceptions

- This rule has no exceptions.
