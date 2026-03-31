---
name: Dual-Mode Output Standard
description: Every article must have a Chinese version and an English Learning version with a working mode toggle
---

# Dual-Mode Output Standard

## Applicability

- Applies to: Chinese Daily Writer, English Content Curator, HTML Daily Producer, Education Expert

## Rule Content

### Both Modes Required

Every article published in ChemistryTimes must have both a Chinese version and an English Learning version. Publishing a single-mode article is prohibited unless Editor-in-Chief explicitly activates the Chinese-only escalation protocol under `daily-deadline.md`.

### Chinese Version

An independently written article in Taiwan Mandarin. Contains: headline, lead, body, and 化學觀點 section. Written from the source bundle — not translated from or adapted from the English version.

### English Learning Version

Structured learning content built from the original English source text. Contains per paragraph:
1. Original English text (verbatim, not simplified)
2. Collapsible Chinese translation (precise, natural Taiwan Mandarin)
3. Collapsible grammar analysis (1-3 structures per paragraph, B1-B2 level)
4. TTS audio player (pre-generated MP3, one per paragraph)

Plus per article:
5. Vocabulary table (5-10 words with English, part of speech, Chinese definition, context)

### Content Parity

Both modes must cover the same news story from the same source material. The Chinese version provides editorial perspective; the English Learning version provides language learning. They share the same factual foundation but serve different purposes.

### HTML Mode Toggle

The mode toggle must:
- Switch between 中文版 and English Learning display using CSS class changes only
- Require no page reload
- Use no external JavaScript framework
- Show 中文版 as the default on page load
- Persist toggle state during the session

### Article Structure in HTML

Each article section in the HTML must contain both mode containers:
```html
<div class="mode-cn"><!-- Chinese version content --></div>
<div class="mode-en-learn"><!-- English Learning version content --></div>
```

Collapsible sections use `<details><summary>` elements or equivalent CSS-only accordion.

## Violation Determination

- Article published with only one mode (outside escalation protocol) -> Violation
- Chinese version is a translation of the English text, or vice versa -> Violation
- English Learning version rewrites or simplifies the original text -> Violation
- Mode toggle triggers a page reload -> Violation
- Both modes visible simultaneously on page load -> Violation
- English Learning version missing any component (translation, grammar, vocabulary, TTS) -> Violation

## Exceptions

- If Editor-in-Chief activates Option B (Chinese-only edition) under the escalation protocol, the English Learning version may be omitted for that edition.
