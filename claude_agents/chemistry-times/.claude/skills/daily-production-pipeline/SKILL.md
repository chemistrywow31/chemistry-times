---
name: Daily Production Pipeline
description: End-to-end workflow specification for the daily newspaper production cycle
---

# Daily Production Pipeline

## Description

This skill defines the complete production workflow for the ChemistryTimes daily bilingual newspaper, including phase sequencing, handoff specifications, timing targets, escalation protocols, and rollback procedures.

## Users

This skill is used by the following agents:
- Editor-in-Chief: primary user for orchestrating the full pipeline and making escalation decisions
- All agents: must understand phase boundaries, input requirements, and handoff formats relevant to their role

## Core Knowledge

### Phase Timeline

Target publish time: **08:30 daily**

| Phase | Agent(s) | Target Completion | Activity |
|-------|----------|-------------------|----------|
| 1 — Gathering | Digital Journalist | 06:15 | Collect raw materials per editorial brief |
| 2 — Verification | Data Auditor | 06:45 | Fact-check all materials, assign A/B/C scores |
| 3 — Analysis | All three Analysts | 07:15 | Domain commentary (runs in parallel) |
| 4 — Writing | CN Writer + EN Writer | 07:55 | Article drafts (runs in parallel) |
| 5 — Production | HTML Daily Producer | 08:10 | Assemble single-page bilingual newspaper |
| 6 — Code Review | Code Reviewer | 08:20 | Validate HTML quality |
| 7 — Final Review | Editor-in-Chief | 08:25 | Authorize upload |
| 8 — Publish | HTML Daily Producer | 08:30 | Upload to server via `/chemistry-times/api/upload` |

Phases 3 and 4 run in parallel within their phases. All other phases are sequential.

### Handoff Specifications

Each phase transition requires a structured handoff. Agents must not begin work until the correct handoff format is received.

**Phase 1 to 2: Raw Material Package**
```json
{
  "story_id": "...",
  "title": "...",
  "sources": [{"url": "...", "tier": "1|2|3", "summary": "..."}],
  "key_facts": ["..."],
  "key_quotes": [{"text": "...", "speaker": "...", "source_url": "..."}],
  "suggested_angle": "..."
}
```

**Phase 2 to 3: Verified Package**

Same structure as Phase 1 output, with additions:
```json
{
  "credibility_score": "A|B|C",
  "verification_notes": "...",
  "flagged_items": [{"claim": "...", "issue": "...", "recommended_correction": "..."}]
}
```

**Phase 3 to 4: Source Bundle**

```json
{
  "story_id": "...",
  "raw_material": {},
  "analyst_commentary": {
    "education_market": "...",
    "marketing": "...",
    "tech": "..."
  },
  "editorial_angle": "...",
  "target_length_cn": "300-500 characters",
  "target_length_en": "150-250 words"
}
```

**Phase 4 to 5: Completed Articles**

Deliver as separate markdown files:
- `{story_id}_cn.md` — Traditional Chinese article
- `{story_id}_en.md` — English article
- `articles_manifest.json` — list of all story IDs and filenames

**Phase 5 to 6: HTML File**

Single `.html` file. File must be self-contained (no external dependencies that require authentication).

**Phase 6 to 7: Code Review Report**

```
Status: PASS | FAIL
Issues Found: {count}
Critical Issues: {list or "None"}
Non-Critical Issues: {list or "None"}
Recommendation: Proceed | Fix Required
```

**Phase 7 to 8: Upload Authorization**

Explicit written authorization from Editor-in-Chief:
```
Authorization: APPROVED
Issue Date: {YYYY-MM-DD}
Target Upload Path: {path}
```

### Story Selection Criteria

Every issue should cover as many of the five content sections as possible:
- AI 動態 — AI news, model releases, AI industry
- 技術發展 — Tech trends, open source, dev tools
- 遊戲產業 — Gaming industry, platforms, market
- 軟體職缺 — Software jobs, hiring trends
- 資金動向 — Funding, M&A, capital flows

### Escalation Protocol

Apply escalation rules when phases fall behind schedule:

| Trigger | Action |
|---------|--------|
| Phase 4 not complete by 07:00 | Editor-in-Chief decides: reduce story count (minimum 3 total) OR skip English version |
| Score C article in Phase 2 output | Data Auditor notifies Editor-in-Chief immediately; Editor decides include/exclude |
| Code review FAIL in Phase 6 | HTML Producer has 10 minutes to fix; if still FAIL, Editor decides skip or delay publish |
| Fewer than 6 gathered items in Phase 1 | Digital Journalist escalates to Editor-in-Chief before ending gathering phase |

### Rollback Procedure

If publish fails after authorization:
1. HTML Producer captures error message and timestamps
2. Editor-in-Chief is notified within 2 minutes
3. Editor decides: retry (if technical error), hold for next cycle, or publish subset

## Application Guide

### Scenario A: Normal Production Day

Follow phase sequence strictly. Each agent waits for the correct handoff format before starting. Editor-in-Chief monitors phase completion times against targets and sends reminders if any phase is running 15+ minutes late.

### Scenario B: Breaking News Addition After Phase 3

1. Editor-in-Chief pauses Phase 4 if not yet started
2. Digital Journalist gathers breaking news package (expedited: 20 minutes maximum)
3. Data Auditor fast-tracks verification (minimum 1 cross-reference source required)
4. Skip full analyst commentary; Editor-in-Chief writes brief editorial note directly
5. Writers incorporate into articles as a new section, not a replacement story
6. Resume normal pipeline from Phase 4

### Scenario C: Reduced-Scope Issue (Contingency)

When total available time is less than 2 hours:
1. Reduce to 3 stories minimum (1 education, 1 tech, 1 GitHub trending)
2. Skip EN version; publish CN-only with bilingual header note
3. Compress analyst commentary to one sentence per analyst
4. Skip code review; Editor-in-Chief does final HTML spot-check manually

## Quality Checkpoints

- [ ] Every phase handoff uses the specified format (no informal passing of information)
- [ ] Phase 3 analysts are triggered in parallel, not sequentially
- [ ] Phase 4 writers are triggered in parallel, not sequentially
- [ ] Escalation protocol is applied when time triggers are hit
- [ ] Final HTML is uploaded only after written authorization is received
- [ ] Story count meets minimum criteria before production begins

## Example

### Input
Editor-in-Chief sends editorial brief at 05:30 with 5 story topics

### Output (Timeline)
```
05:30 — Editor-in-Chief sends editorial brief to Digital Journalist
06:15 — Digital Journalist delivers 8 raw material packages (JSON format)
06:45 — Data Auditor delivers 8 verified packages (7 Score A, 1 Score B with 1 flag)
07:00 — Editor-in-Chief selects 6 stories, triggers 3 analysts in parallel
07:15 — All analysts deliver commentary bundles
07:20 — Editor-in-Chief composes source bundles, triggers CN and EN writers in parallel
07:55 — CN Writer delivers 6 articles in markdown; EN Writer delivers 6 articles
08:05 — HTML Daily Producer assembles single-page bilingual newspaper
08:10 — HTML file delivered to Code Reviewer
08:18 — Code Reviewer: PASS (2 non-critical warnings, no critical issues)
08:22 — Editor-in-Chief reviews, issues upload authorization
08:28 — HTML Daily Producer uploads to server
08:29 — Publish confirmed
```
