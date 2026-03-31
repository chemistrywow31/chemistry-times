---
name: Daily Production Pipeline
description: End-to-end workflow specification for the dual-mode daily newspaper production cycle
---

# Daily Production Pipeline

## Description

This skill defines the complete production workflow for the ChemistryTimes daily dual-mode newspaper, including phase sequencing, handoff specifications, education pipeline streaming, timing targets, escalation protocols, and rollback procedures.

## Users

- Editor-in-Chief: primary user for orchestrating the full pipeline
- All agents: must understand phase boundaries and handoff formats relevant to their role

## Core Knowledge

### Phase Timeline

| Phase | Agent(s) | Activity |
|-------|----------|----------|
| 1 — Topic Setting | Editor-in-Chief | Set editorial lineup, assign priorities |
| 2 — Gathering | Digital Journalist | Collect raw materials per brief |
| 3 — Verification | Data Auditor | Fact-check, assign A/B/C scores |
| 4 — Analysis | 3 Analysts (parallel) | Domain commentary |
| 5 — Content Production | CN Writer + EN Curator (parallel) | CN articles + EN curation |
| 6 — Education Pipeline | Translator + Grammar + TTS (3-way parallel per article, streaming) | Per-article learning content |
| 7 — Education Review | Education Expert | Quality gate for learning content |
| 8 — HTML Production | HTML Daily Producer | Dual-mode HTML assembly + TTS upload |
| 9 — Code Review | Code Reviewer | HTML quality validation |
| 10 — Final Review + Publish | Editor-in-Chief + HTML Producer | Authorize and upload |

### Streaming Trigger (Phase 5 → 6)

Phase 6 does not wait for all Phase 5 work to complete. Instead:
- As each article's EN content is finalized by EN Curator, Editor-in-Chief immediately dispatches that article's education pipeline (Translator + Grammar Analyst + TTS) in 3-way parallel
- CN Writer runs independently throughout Phases 5-7
- This reduces total pipeline time by overlapping education work with remaining content production

### Handoff Specifications

**Phase 2 → 3: Raw Material Package**
```json
{
  "story_id": "...", "title": "...",
  "sources": [{"url": "...", "tier": "1|2|3", "summary": "..."}],
  "key_facts": ["..."], "key_quotes": [{"text": "...", "speaker": "..."}],
  "suggested_angle": "...", "image_url": "..."
}
```

**Phase 3 → 4: Verified Package**
Same as Phase 2 output plus: `credibility_score`, `verification_notes`, `flagged_items[]`

**Phase 4 → 5: Source Bundle**
```json
{
  "story_id": "...", "raw_material": {},
  "analyst_commentary": {"tech": "...", "business": "...", "world": "..."},
  "editorial_angle": "...", "image_url": "..."
}
```

**Phase 5 → 6: Curated EN Content (per article)**
```json
{
  "article_id": "...", "headline": "...", "source": "...",
  "paragraphs": ["P1 text", "P2 text", ...],
  "vocabulary_candidates": {"P1": [...], "P2": [...]}
}
```

**Phase 6 → 7: Education Content (per article)**
Translations, grammar analysis, vocabulary candidates, TTS file paths — all keyed by article_id and paragraph number.

**Phase 7 → 8: Approved Education Content**
Education Expert's PASS result plus finalized vocabulary tables.

### Escalation Protocol

| Trigger | Action |
|---------|--------|
| Phase 5 overruns allocated time | Reduce story count or skip English Learning version |
| Score C article in Phase 3 | Data Auditor notifies Editor-in-Chief; editor decides |
| Code review FAIL in Phase 9 | HTML Producer has 10 minutes to fix; if still FAIL, editor decides |
| Education review FAIL in Phase 7 | Return to responsible agent with specific feedback |
| TTS generation fails | Publish without audio for failed paragraphs; note in final review |

### Rollback Procedure

If publish fails after authorization:
1. HTML Producer captures error and timestamps
2. Editor-in-Chief notified within 2 minutes
3. Editor decides: retry, hold, or publish subset

## Application Guide

### Scenario A: Normal Production Day
Follow phase sequence. Streaming trigger activates per article. All parallel groups dispatch simultaneously. Editor-in-Chief monitors completion times.

### Scenario B: Breaking News After Phase 3
1. Editor-in-Chief pauses Phase 5 if not started
2. Digital Journalist gathers breaking package (20 min max)
3. Data Auditor fast-tracks verification
4. Editor-in-Chief writes brief editorial note
5. Writers incorporate as new section
6. Resume pipeline

### Scenario C: Chinese-Only Contingency
1. Reduce to minimum 3 stories
2. Skip English Learning version entirely
3. Compress analyst commentary
4. Skip education pipeline
5. Proceed directly to HTML (CN-only mode)

## Quality Checkpoints

- [ ] Phase 4 analysts triggered in parallel
- [ ] Phase 5 writers triggered in parallel
- [ ] Phase 6 education pipeline triggered per-article as EN content finalizes (streaming)
- [ ] All handoffs use specified format
- [ ] Escalation protocol applied when triggers hit
- [ ] Upload only after written authorization
