---
name: Worklog
description: Phase-level documentation structure and evidence chain requirements for all tasks
---

# Worklog

## Applicability

- Applies to: All agents

## Rule Content

### Every Task Must Have a Worklog

Every task executed by the team must maintain a worklog under `.worklog/`. The worklog records reference information, key findings, and decision rationale for each phase.

### Directory Structure

```
.worklog/{yyyymm}/{task-name}/phase-{n}-{label}/
  ├── references.md
  ├── findings.md
  └── decisions.md
```

### Required Files Per Phase

#### references.md
Record all information sources consulted: URLs, file paths, conversation segments, agent reports. Each reference must include source identifier, content description, and how it was used.

#### findings.md
Record key discoveries derived from references: facts established, patterns identified, constraints discovered, comparative analysis. Each finding must trace back to at least one entry in references.md.

#### decisions.md
Record every decision: the decision statement, rationale, alternatives rejected, supporting evidence (references to findings.md and references.md), and downstream impact.

### Evidence Chain Requirement

The three files form a chain: **references -> findings -> decisions**. Every decision must trace back through findings to references. A decision with no traceable evidence chain is a violation.

## Violation Determination

- Phase completes with no corresponding worklog directory -> Violation
- Phase worklog missing any of the three core files -> Violation
- decisions.md contains a decision with no traceable evidence -> Violation
- findings.md contains a finding with no source reference -> Violation

## Exceptions

- Phases that produce no decisions may have an empty decisions.md with a note: "No decisions made in this phase."
