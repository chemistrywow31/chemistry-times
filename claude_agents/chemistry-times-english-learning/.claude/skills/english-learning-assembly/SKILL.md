---
name: English Learning Assembly
description: Methodology for structuring English learning content from news articles targeting CEFR B1-B2 learners
---

# English Learning Assembly

## Description

This skill provides the methodology for structuring authentic English news text into learning content. It defines paragraph segmentation rules, vocabulary extraction criteria, grammar highlight selection, difficulty calibration, and the learning unit structure.

## Users

- English Content Curator: uses segmentation and vocabulary extraction methodology
- Education Expert: uses quality calibration criteria for review

## Core Knowledge

### Learning Unit Structure

Each paragraph in the English Learning mode forms one learning unit:

```
┌─────────────────────────────┐
│ English Paragraph (original)│
├─────────────────────────────┤
│ ▶ 播放音檔 (TTS audio)     │
├─────────────────────────────┤
│ ▸ 中文翻譯 (collapsible)   │
│   {precise translation}     │
├─────────────────────────────┤
│ ▸ 文法重點 (collapsible)   │
│   {grammar analysis}        │
└─────────────────────────────┘

[After all paragraphs:]
┌─────────────────────────────┐
│ 📝 重點單字                  │
│ Word | POS | 中文 | Context │
└─────────────────────────────┘
```

### Paragraph Segmentation Rules

- Segment at natural paragraph boundaries from the original source
- Minimum segment: 1 sentence. Maximum segment: 1 original paragraph
- Do not merge paragraphs from the original
- Do not split mid-paragraph unless the paragraph exceeds 200 words (rare in news)
- Preserve paragraph order from the original

### Vocabulary Extraction Criteria

Select words that meet ALL of these:
1. **Frequency**: Not in the 3,000 most common English words (approximate B1 threshold)
2. **Context**: The word is important for understanding the paragraph's meaning
3. **Learnability**: The word has practical value beyond this single article

Prioritize (in order):
1. Domain-specific terms the reader will encounter again in similar news
2. Idiomatic expressions and phrasal verbs
3. Advanced connectors that improve reading fluency
4. Less common but useful adjectives and adverbs

### Grammar Highlight Selection

Select structures that meet ALL of these:
1. **Above B1**: The structure is not basic SVO, simple tenses, or basic articles
2. **Teachable**: The structure follows a pattern that can be generalized
3. **Visible**: The structure is clearly demonstrated in the specific sentence

### CEFR B1-B2 Difficulty Calibration

| Component | Too Easy (below B1) | Target (B1-B2) | Too Hard (above B2) |
|-----------|---------------------|-----------------|----------------------|
| Vocabulary | "important", "because" | "leverage", "volatile" | "antediluvian", "perspicacious" |
| Grammar | Simple past tense | Relative clauses, conditionals | Subjunctive in formal registers |
| Translation | Word-for-word literal | Natural equivalence | Literary/creative |

### Quality Signals

Good learning content:
- Vocabulary table has 0 words a B1 learner already knows
- Grammar explanations reference the exact sentence, not a textbook
- Translations read naturally in Chinese without back-reference to English
- Difficulty is consistent across articles

Bad learning content:
- Vocabulary includes "company", "market", "technology" (too basic)
- Grammar says "this is a passive voice" without context
- Translation is word-for-word and sounds like a machine
- One article targets C1 while another targets A2

## Application Guide

### Scenario A: Standard News Article Curation
1. Read the full article from the source
2. Select 4-8 paragraphs carrying the core story
3. For each paragraph, identify 3-5 vocabulary candidates
4. Deliver structured output to the education pipeline

### Scenario B: Education Quality Review
1. Check each translation against the original for completeness and naturalness
2. Verify grammar explanations reference specific sentences
3. Finalize vocabulary table: select 5-10 from candidates, fill all four columns
4. Assess cross-article consistency

### Scenario C: Difficult Source Material
Source article uses highly technical language (e.g., patent filing, academic paper summary). Curator selects paragraphs with the most accessible language. Education Expert may flag that vocabulary count exceeds target — reduce to the most practical 10 words.

## Quality Checkpoints

- [ ] Every learning unit has all components (text, translation slot, grammar slot, TTS slot)
- [ ] Vocabulary candidates exclude common B1 words
- [ ] Grammar selections are above B1 level
- [ ] Paragraph segmentation follows original boundaries
- [ ] Difficulty calibration is consistent across articles
