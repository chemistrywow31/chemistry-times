---
name: Topic Deduplication
description: Prevent repetitive coverage across daily editions using a rolling topic ledger
---

# Topic Deduplication

## Applicability

- Applies to: Editor-in-Chief, Digital Journalist

## Rule Content

### Topic Ledger

A rolling topic ledger is maintained at `workspace/topic-ledger.md`. This file records all published stories by entity name, tag, and publication date.

### Ledger Maintenance

- **After each edition**: Editor-in-Chief must append that day's published topics to the ledger immediately after final approval.
- **Before each newsgathering phase**: Editor-in-Chief must remove all entries older than 14 days from the ledger. This keeps the ledger concise and aligned with the temporal-awareness freshness window.

### Newsgathering Obligation

Digital Journalist must read `workspace/topic-ledger.md` before starting any search. For every item gathered, check the entity column in the ledger:

- **Entity not in ledger**: Proceed normally. No restriction.
- **Entity in ledger**: The item requires a **new development** to be eligible. A new development is defined as at least one of:
  - New quantitative data (financial results, benchmark scores, user numbers)
  - Official response or statement from a named party
  - Regulatory or legal action
  - Security incident or service disruption
  - Milestone crossing (e.g., GitHub stars surpassing a new order of magnitude)

### Cooldown Periods

Even with a new development, the same entity must respect a minimum cooldown before being featured again at the same tier:

| Previous Coverage | Cooldown for Deep Dive | Cooldown for Brief |
|-------------------|----------------------|-------------------|
| Deep Dive | 7 days | 3 days |
| Brief | 3 days | 2 days |

Example: If "DeepSeek V4" ran as a Brief on 03-18, it may appear as a Brief again on 03-20 only if a new development exists. It may appear as a Deep Dive on 03-21.

### Follow-Up Labeling

Any story covering an entity that appeared in the ledger within the past 14 days must be labeled as a follow-up:

- Chinese: add `【後續】` prefix to the headline
- English: add `[UPDATE]` prefix to the headline

This signals to readers that prior coverage exists.

### Ledger Entry Format

Each day's entry must use this table format:

```markdown
## YYYY-MM-DD ｜ Issue #NNN

| Tag | Entity | Headline (CN) | Type |
|-----|--------|---------------|------|
| 競業 | {company/product} | {headline} | Deep Dive / Brief |
```

The **Entity** column is the deduplication key. Use the most specific identifier: company name, repo `owner/name`, model name, or regulation short name.

## Violation Determination

- Digital Journalist starts newsgathering without reading the topic ledger → Violation
- Same entity covered at the same tier within cooldown period without a qualifying new development → Violation
- Follow-up story missing the `【後續】` or `[UPDATE]` label → Violation
- Editor-in-Chief publishes an edition without appending to the ledger → Violation
- Ledger contains entries older than 14 days at the start of a newsgathering phase → Violation

## Exceptions

- If a story qualifies as `[即時 / Breaking]` with significant impact (e.g., major security breach, regulatory ban, company shutdown), cooldown may be bypassed. Editor-in-Chief must state the bypass reason explicitly.
