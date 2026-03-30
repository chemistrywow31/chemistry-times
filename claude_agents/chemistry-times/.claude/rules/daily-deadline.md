---
name: Daily Deadline
description: Enforce the 08:30 daily publication deadline with escalation rules and buffer requirements
---

# Daily Deadline

## Applicability

- Applies to: All agents

## Rule Content

### Publication Deadline

The HTML file must be uploaded to server via API and the URL confirmed by **08:30 daily** without exception.

### Phase Checkpoints

- If Writing phase is not complete by **07:00**, Editor-in-Chief must immediately escalate: either reduce story count to fit remaining time or skip the English version for that day.
- HTML Producer must have upload authorization from Editor-in-Chief by **08:15** at the latest.
- The 15-minute window from 08:15 to 08:30 is reserved as a contingency buffer. No new work may be assigned to any agent during this window.

### Post-Verification Story Lock

No story may be added to the day's lineup after Data Auditor completes the Fact Verification phase. Any new story submitted after that point is deferred to the next edition.

### Escalation Protocol

When Editor-in-Chief triggers an escalation due to time overrun:

1. State the current time and the phase that is delayed.
2. Choose one of these two options and state the choice explicitly:
   - **Option A**: Remove the lowest-priority stories to reduce scope.
   - **Option B**: Publish Chinese-only edition, omitting the English version.
3. Notify all downstream agents of the revised scope before continuing.

## Violation Determination

- HTML not uploaded to server by 08:30 → Violation
- Writing phase incomplete at 07:00 but Editor-in-Chief does not escalate → Violation
- New story added after Fact Verification phase is marked complete → Violation
- HTML Producer uploads without explicit Editor-in-Chief authorization → Violation
- Agent assigned work during the 08:15–08:30 buffer window → Violation

## Exceptions

This rule has no exceptions.
