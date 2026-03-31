---
name: Fact-Checking Framework
description: Cross-verification and credibility scoring methodology for news items before publication
---

# Fact-Checking Framework

## Description

This skill provides a structured workflow for verifying factual claims, assigning credibility scores (A/B/C), and producing verification reports.

## Users

- Data Auditor: primary user for all fact-checking tasks

## Core Knowledge

### Credibility Scoring

| Score | Criteria |
|-------|----------|
| A | All key claims verified by 2+ sources. Numerical data confirmed. |
| B | Most claims verified. 1-2 minor single-sourced claims. No critical discrepancies. |
| C | Multiple unverified claims. Discrepancies found. Heavy single-source reliance. |
| Reject | Core claims unverifiable. Do not forward. |

### Numerical Data Verification

1. Locate primary source (SEC filing, press release, audited report)
2. Compare reported figure against primary source
3. Discrepancy >10%: flag `[Discrepancy]`, provide both figures
4. Discrepancy ≤10%: note difference, use primary source figure

### Verification Workflow

1. **Claim extraction** — List every factual claim as discrete items
2. **Source tracing** — Identify origin of each claim
3. **Cross-reference** — Find 1+ independent confirming source
4. **Score assignment** — Apply rubric
5. **Route** — Pass, flag, or reject

### Output Format

```
Article: {title}
Overall Score: A | B | C | Reject

Claims Verified:
- [PASS] "{claim}" — confirmed by {sources}

Claims Flagged:
- [Discrepancy] "{claim}" — source says X, primary says Y
- [Single-Source] "{claim}" — only verified by {source}

Flagged Items Summary: {count} flags. Recommend: Pass | Editor Review | Reject
```

## Application Guide

### Scenario A: Financial Claims
Verify against SEC filings or company IR. Apply 10% discrepancy rule.

### Scenario B: Event Claims
Check official press release, then 2+ Tier 2 sources. Confirm date, participants, scope.

### Scenario C: Quote Attribution
Verify speaker identity. Confirm quote in primary or Tier 2 source. Reject altered quotes.

## Quality Checkpoints

- [ ] Every key claim individually assessed
- [ ] Numerical data cross-referenced against primary source
- [ ] Circular citations detected and flagged
- [ ] Score matches rubric criteria
- [ ] Report includes specific source names and URLs
