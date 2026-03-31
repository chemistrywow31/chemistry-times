---
name: Daily Deadline
description: Enforce the daily publication deadline with escalation rules and buffer requirements
---

# Daily Deadline

## Applicability

- Applies to: All agents

## Rule Content

### Publication Deadline

The HTML file must be uploaded to server via API and the URL confirmed by the daily deadline without exception. Editor-in-Chief sets the target time at the start of each production day.

### Phase Checkpoints

- If Content Production phase (CN Writer + EN Curator) is not complete within the allocated time, Editor-in-Chief must immediately escalate: reduce story count or skip the English Learning version.
- HTML Producer must have upload authorization from Editor-in-Chief at least 15 minutes before the deadline.
- The final 15-minute window is reserved as a contingency buffer. No new work may be assigned during this window.

### Post-Verification Story Lock

No story may be added to the day's lineup after Data Auditor completes Fact Verification. New stories are deferred to the next edition.

### Escalation Protocol

When Editor-in-Chief triggers an escalation:
1. State the current time and the delayed phase.
2. Choose one option:
   - **Option A**: Remove lowest-priority stories to reduce scope.
   - **Option B**: Publish Chinese-only edition, omitting the English Learning version.
3. Notify all downstream agents of the revised scope.

## Violation Determination

- HTML not uploaded by deadline -> Violation
- Content Production incomplete at checkpoint but Editor-in-Chief does not escalate -> Violation
- New story added after Fact Verification is complete -> Violation
- HTML Producer uploads without explicit Editor-in-Chief authorization -> Violation
- Agent assigned work during the buffer window -> Violation

## Exceptions

- This rule has no exceptions.
