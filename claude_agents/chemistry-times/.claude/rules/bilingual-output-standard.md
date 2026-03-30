---
name: Bilingual Output Standard
description: Every article must have independent CN and EN versions covering identical facts with a working bilingual toggle
---

# Bilingual Output Standard

## Applicability

- Applies to: Chinese Daily Writer, English Daily Writer, HTML Daily Producer

## Rule Content

### Both Versions Required

Every article published in ChemistryTimes must have both a Chinese version and an English version. Publishing a single-language article is prohibited unless Editor-in-Chief explicitly activates the Chinese-only escalation protocol under `daily-deadline.md`.

### Independent Authorship from Shared Source

Both writers must work from the same source bundle (fact-checked articles, analyst commentary, raw data files). The Chinese version must not be translated from the English version, and the English version must not be translated from or adapted from the Chinese version. Each is written independently from primary sources.

### Content Parity

The Chinese and English versions of each article must cover the same core facts, the same key data points, and the same story angle. Content drift — where one version includes significant facts omitted from the other — is prohibited.

### Article Structure

Every article in both languages must follow this structure:

1. **Headline** — The article title
2. **Lead / TL;DR** — One sentence capturing the essential news
3. **Body** — The full story with facts, context, and data
4. **Perspective section** — "化學觀點" (CN) / "The ChemistryTimes Take" (EN)

### HTML Bilingual Toggle

The HTML bilingual toggle must:
- Switch between CN and EN display using CSS class visibility changes only
- Require no page reload
- Be implemented in embedded JavaScript with no external framework dependency
- Show only one language at a time — both must never be visible simultaneously

## Violation Determination

- Article published with only one language version (outside escalation protocol) → Violation
- Chinese version is a translation of the English version, or vice versa → Violation
- One version omits a key fact that appears in the other → Violation
- Article missing headline, lead, body, or perspective section in either language → Violation
- Bilingual toggle triggers a page reload → Violation
- Both language versions visible simultaneously on page load → Violation

## Exceptions

- If Editor-in-Chief activates Option B (Chinese-only edition) under the escalation protocol in `daily-deadline.md`, the English version may be omitted for that day's edition only.
