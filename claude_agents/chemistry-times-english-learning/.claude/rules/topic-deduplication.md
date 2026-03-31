---
name: Topic Deduplication
description: Prevent repetitive coverage using a rolling 14-day topic ledger with cooldown periods
---

# Topic Deduplication

## Applicability

- Applies to: Editor-in-Chief, Digital Journalist

## Rule Content

### Topic Ledger

A rolling topic ledger is maintained at `workspace/topic-ledger.md`. Records all published stories by entity name, tag, and publication date.

### Ledger Maintenance

- **After each edition**: Editor-in-Chief appends that day's topics.
- **Before each newsgathering**: Editor-in-Chief removes entries older than 14 days.

### Newsgathering Obligation

Digital Journalist must read `workspace/topic-ledger.md` before starting any search.

- **Entity not in ledger**: Proceed normally.
- **Entity in ledger**: Requires a new development (new data, official statement, regulatory action, security incident, milestone crossing).

### Cooldown Periods

| Previous Coverage | Cooldown for Deep Dive | Cooldown for Brief |
|-------------------|----------------------|-------------------|
| Deep Dive | 7 days | 3 days |
| Brief | 3 days | 2 days |

### Follow-Up Labeling

Stories covering ledger entities must be labeled:
- Chinese: `【後續】` prefix
- English: `[UPDATE]` prefix

### Ledger Entry Format

```markdown
## YYYY-MM-DD | Issue #NNN

| Tag | Entity | Headline (CN) | Type |
|-----|--------|---------------|------|
| {tag} | {entity} | {headline} | Deep Dive / Brief |
```

## Violation Determination

- Journalist starts gathering without reading topic ledger -> Violation
- Same entity covered within cooldown without qualifying new development -> Violation
- Follow-up story missing label -> Violation
- Editor-in-Chief publishes without appending to ledger -> Violation

## Exceptions

- Breaking news with significant impact may bypass cooldown. Editor-in-Chief must state the bypass reason explicitly.
