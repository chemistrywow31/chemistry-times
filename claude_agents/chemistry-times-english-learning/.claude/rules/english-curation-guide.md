---
name: English Curation Guide
description: Standards for curating and structuring original English news text for the English Learning mode
---

# English Curation Guide

## Applicability

- Applies to: English Content Curator

## Rule Content

### Core Principle

You preserve and structure original English news text for learning purposes. You do not rewrite, simplify, or paraphrase the original text. The learning value comes from exposing readers to authentic English journalism.

### Text Selection

Select the most informative and well-written paragraphs from the source material. For each article:
- Include the original headline as-is
- Include 4-8 paragraphs that carry the core story
- Omit repetitive filler paragraphs, promotional content, and boilerplate disclaimers
- Preserve the original paragraph order

### Paragraph Segmentation

Segment text at natural paragraph boundaries from the original source. Each segment becomes one learning unit with its own:
- English text block
- Translation slot (filled by Professional Translator)
- Grammar analysis slot (filled by Grammar Analyst)
- TTS audio slot (filled by TTS Producer)

### Image References

For each article, extract the primary image URL from the source. Include it in the output as a reference for HTML assembly. Use the original image URL — do not download or re-host images.

### Output Format

Deliver structured content per article as a JSON-like structure:

```
Article ID: {story_id}
Headline: {original headline}
Source: {source name and URL}
Image URL: {primary image URL or "none"}
Paragraphs:
  P1: {original text}
  P2: {original text}
  ...
Vocabulary Candidates: {list of potentially challenging words per paragraph}
```

### Vocabulary Candidate Selection

For each paragraph, identify 3-5 words or phrases that a CEFR B1-B2 learner would likely not know. Prioritize:
- Domain-specific terminology (e.g., "valuation", "depreciation", "inference")
- Idiomatic expressions (e.g., "double down", "play hardball")
- Advanced connectors and discourse markers (e.g., "notwithstanding", "insofar as")

Do not flag common B1 vocabulary (e.g., "important", "because", "however").

### Constraints

- Do not rewrite or simplify original text
- Do not add commentary or editorial perspective (that belongs in the Chinese version)
- Do not translate any content (Professional Translator handles translation)
- Do not analyze grammar (Grammar Analyst handles analysis)

## Violation Determination

- Original text is rewritten, simplified, or paraphrased -> Violation
- Article has fewer than 4 paragraphs without Editor-in-Chief approval -> Violation
- Vocabulary candidates include common B1-level words -> Violation
- Output missing any required field (headline, source, paragraphs) -> Violation

## Exceptions

- For very short news briefs (under 3 paragraphs in the original), include all available paragraphs even if fewer than 4.
