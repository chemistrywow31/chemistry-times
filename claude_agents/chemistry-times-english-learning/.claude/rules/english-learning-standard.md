---
name: English Learning Standard
description: Quality requirements for learning mode content including translation, grammar, vocabulary, and TTS
---

# English Learning Standard

## Applicability

- Applies to: Professional Translator, Grammar Analyst, Education Expert

## Rule Content

### Target Learner Profile

- CEFR level: B1-B2 (intermediate)
- Native language: Traditional Chinese (Taiwan Mandarin)
- Goal: Improve English reading comprehension, vocabulary, and grammar awareness through authentic news content

### Translation Requirements

Professional Translator must produce paragraph-level translations that:
- Are precise and complete — every sentence in the English paragraph has a corresponding Chinese translation
- Use natural Taiwan Mandarin (not word-for-word translation)
- Preserve the tone and register of the original (formal news -> formal Chinese, casual quote -> casual Chinese)
- Use Taiwan terminology (資訊 not 信息, 軟體 not 軟件)
- Do not add interpretation or commentary beyond what the original states

### Grammar Analysis Requirements

Grammar Analyst must produce per-paragraph grammar notes that:
- Identify 1-3 grammar structures per paragraph that are instructive for B1-B2 learners
- Explain each structure in context of the specific sentence (not generic textbook definitions)
- Include the original sentence fragment demonstrating the structure
- Provide a pattern template (e.g., "not only... but also..." -> "不僅...而且...")
- Use Traditional Chinese for all explanations

Grammar structures to prioritize:
- Complex sentence structures (relative clauses, participial phrases, subjunctive mood)
- Discourse connectors and transitions
- Idiomatic verb patterns (phrasal verbs, collocations)
- Passive constructions in news reporting
- Conditional and hypothetical structures

Grammar structures to skip:
- Basic subject-verb-object order
- Simple present/past tense
- Basic articles (a, the) unless used in a noteworthy pattern

### Vocabulary Table Requirements

Education Expert validates vocabulary tables that:
- Include 5-10 words per article (aggregated from per-paragraph candidates)
- Have columns: English Word, Part of Speech, Chinese Definition, Example Context
- Target words genuinely challenging for B1-B2 (not basic vocabulary)
- Include the sentence context from the article where the word appears

### TTS Audio Requirements

- Voice: Clear, natural pace suitable for language learners
- Speed: 0.9x normal speed (slightly slower for comprehension)
- Format: MP3
- Segmentation: One audio file per paragraph
- File naming: `tts-{article-id}-p{paragraph-number}.mp3`

### Education Expert Review Checklist

Education Expert must verify:
- [ ] Translations are accurate and natural (no machine-translation artifacts)
- [ ] Grammar explanations target B1-B2 level (not too basic, not too advanced)
- [ ] Grammar explanations reference the specific sentence, not generic rules
- [ ] Vocabulary difficulty is calibrated (no words below B1, no words above C1)
- [ ] Vocabulary table is complete with all four columns
- [ ] Content is consistent across all articles in the edition

## Violation Determination

- Translation omits sentences from the original paragraph -> Violation
- Grammar explanation uses generic textbook definition without referencing the specific sentence -> Violation
- Vocabulary table includes common B1 words (e.g., "important", "because") -> Violation
- Translation uses mainland China terminology -> Violation
- Grammar analysis identifies more than 3 structures per paragraph -> Violation (information overload)

## Exceptions

- For paragraphs with no notable grammar structures above B1 level, Grammar Analyst may note "No advanced grammar structures in this paragraph" instead of forcing an analysis.
