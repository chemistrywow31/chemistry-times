---
name: Fact-Checking Framework
description: Cross-verification and credibility scoring methodology for news items before publication
---

# Fact-Checking Framework

## Description

This skill provides a structured workflow for verifying factual claims in collected news materials, assigning credibility scores (A/B/C), and producing verification reports that downstream writers can act on with confidence.

## Users

This skill belongs exclusively to `agents/data/data-auditor.md`

## Core Knowledge

### Three-Source Rule

Every factual claim that will appear in a published article must be verified against 2+ independent sources. "Independent" means the sources did not derive their information from each other (circular citations fail this test).

### Credibility Scoring Rubric

| Score | Criteria |
|-------|----------|
| A | All key claims verified by 2+ sources. All numerical data confirmed. No discrepancies found. |
| B | Most claims verified. 1-2 minor claims are single-sourced. No critical discrepancies. Flagged items noted. |
| C | Multiple unverified claims present. Discrepancies found between sources. Heavy single-source reliance. Requires editor decision to proceed. |
| Reject | Core claims cannot be verified by any independent source. Do not forward to writers. |

Score A or B passes to Phase 3. Score C requires editor notification before proceeding. Reject is returned to Digital Journalist with explanation.

### Red Flag Checklist

Apply to every incoming article or raw material package:

- [ ] Single-source claim (only one source for a key fact)
- [ ] Unverifiable statistics (number appears with no traceable origin)
- [ ] Circular citations (Source A cites Source B, Source B cites Source A)
- [ ] Content farm origin (see Multi-Platform Intelligence skill for detection rules)
- [ ] Machine-translated artifacts (garbled syntax, incorrect technical terminology)
- [ ] Outdated data presented as current (data >6 months old without explicit date reference)

### Numerical Data Verification Rule

For any numerical claim (revenue, user count, growth rate, market share):

1. Locate the primary source (SEC filing, official press release, audited report)
2. Compare reported figure against primary source
3. If discrepancy is >10%: flag with `[Discrepancy]` tag, provide both figures
4. If discrepancy is ≤10%: note difference in report, use primary source figure in article

### Verification Workflow

Execute these steps in order for each article:

1. **Claim extraction** — List every factual claim (names, dates, numbers, events, quotes) as discrete items
2. **Source tracing** — For each claim, identify where it originated (trace back to primary source when possible)
3. **Cross-reference check** — Search for 1+ additional independent source confirming each key claim
4. **Score assignment** — Apply rubric to overall article based on verification results
5. **Pass/Flag/Reject** — Route article according to score

### Output Format: Verification Report

Produce one report per article:

```
Article: {title}
Overall Score: A | B | C | Reject

Claims Verified:
- [PASS] "{claim}" — confirmed by {Source 1}, {Source 2}

Claims Flagged:
- [Discrepancy] "{claim}" — source says X, primary source says Y. Use Y.
- [Single-Source] "{claim}" — only verified by {Source 1}. Proceed with caution.

Flagged Items Summary:
{count} flags total. Recommend: Pass | Editor Review | Reject

Notes:
{any additional context for writers}
```

## Application Guide

### Scenario A: Financial or Statistical Claims

1. Identify the filing or official report for the entity (SEC EDGAR, company IR page, government database)
2. Pull exact figure and date from primary document
3. Compare against what the article states
4. Apply the 10% discrepancy rule
5. If no primary source exists, mark as `[Unverifiable]` and score accordingly

### Scenario B: Event or Announcement Claims

1. Search for official press release or announcement from the organization
2. If not found, check 2+ Tier 2 sources (reputable media)
3. Confirm key details: date, participants, scope, outcome
4. Flag any details that appear only in Tier 3 sources

### Scenario C: Quote Attribution

1. Verify the speaker is identified by full name and title
2. Confirm the quote appears in at least one primary or Tier 2 source
3. If quote is paraphrased, verify the paraphrase does not change meaning
4. Reject altered quotes; flag paraphrases that shift meaning

## Quality Checkpoints

- [ ] Every key claim has been individually assessed (not batch-approved)
- [ ] All numerical data has been cross-referenced against a primary source
- [ ] Circular citation chains have been detected and flagged
- [ ] Score assigned matches the rubric criteria exactly
- [ ] Verification report includes specific source names and URLs, not vague references
- [ ] Score C or Reject articles have been escalated to Editor-in-Chief

## Example

### Input
Raw material claiming: "51Talk revenue grew 30% YoY to $500M in FY2025"

### Process
1. Claim extracted: "revenue $500M, growth 30% YoY, FY2025"
2. Source traced: article cites a blog post, no primary source linked
3. Cross-reference: SEC EDGAR filing found — FY2025 revenue $480M, YoY growth 25%
4. Reuters article found — reports $485M
5. Discrepancy: $500M vs $480M = 4.2% difference on absolute value, but 30% vs 25% growth = significant directional discrepancy

### Output
```
Article: 51Talk FY2025 Financial Results
Overall Score: B

Claims Verified:
- [PASS] "51Talk reported revenue growth in FY2025" — confirmed by SEC filing, Reuters

Claims Flagged:
- [Discrepancy] "revenue $500M, growth 30%" — article claims $500M/30%; SEC filing shows $480M/25%; Reuters shows $485M. Use SEC figure: $480M/25%.

Flagged Items Summary:
1 flag. Recommend: Pass with correction. Writers must use SEC figures.

Notes:
Article may be based on pre-audit estimates. SEC filing is authoritative. Do not use the $500M or 30% figures.
```
