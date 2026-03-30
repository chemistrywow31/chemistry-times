---
name: Temporal Awareness
description: Enforce date verification and information freshness classification for all research tasks
---

# Temporal Awareness

## Applicability

- Applies to: Digital Journalist, Data Auditor, Online English Education Analyst, Marketing Analyst, Tech Analyst, Chinese Daily Writer, English Daily Writer

## Rule Content

### Establish Date Baseline

You must execute `date '+%Y-%m-%d'` at the start of every task to obtain the current system date. Store this as your **date baseline** for all freshness calculations within that task. You must not rely on memory, conversation context, or assumptions to determine today's date.

### Tag Publication Date on Every Item

You must tag every piece of gathered information with its publication date. Extract the date from the article, post, or data source itself. If no publication date is discernible from the source, tag the item with `[日期不明 / Date Unknown]` and automatically downgrade its credibility tier by one level (e.g., Tier 1 → Tier 2, Tier 2 → Tier 3, Tier 3 → Reject).

### Freshness Classification

You must classify every item's freshness by comparing its publication date against the date baseline:

| Time Since Publication | Tag | Usage Rule |
|----------------------|-----|------------|
| 0–24 hours | `[即時 / Breaking]` | Full use as daily news |
| 2–7 days | `[近期 / Recent]` | Usable as news; must note actual date in article body |
| 8–30 days | `[非即時 / Not Breaking]` | Must not present as new development; must state actual date prominently; usable only as context or follow-up |
| 31+ days | `[歷史資料 / Archival]` | Must not use as standalone daily news topic; usable only as background reference or trend comparison |
| Unknown | `[日期不明 / Date Unknown]` | Must not use as standalone daily news topic; usable only with Tier 1/2 corroboration confirming recency |

### Downstream Handoff

You must include the freshness tag on every item passed to downstream agents. You must not pass any item to a downstream agent without a freshness tag attached.

### Writer Obligation

Chinese Daily Writer and English Daily Writer must reflect the freshness tag in article language:
- `[即時]` items: You may use "今日", "today", "just announced"
- `[近期]` items: You must include the actual date (e.g., "上週三(3/12)", "last Wednesday (Mar 12)")
- `[非即時]` items: You must open with temporal context (e.g., "回顧本月初...", "Earlier this month...")
- `[歷史資料]` items: You must frame as background (e.g., "去年...", "Back in 2025...")

### Prohibition

You must not describe any item older than 7 days using language that implies it is new (e.g., "近日", "recently", "just", "breaking").

## Violation Determination

- Agent starts research task without executing `date` command → Violation
- Item passed downstream without freshness tag → Violation
- Item with no discernible date not tagged `[日期不明]` → Violation
- `[非即時]` or `[歷史資料]` item presented as current news without date context → Violation
- Language implying recency used on item older than 7 days → Violation
- `[日期不明]` item used as standalone news topic without Tier 1/2 corroboration → Violation
