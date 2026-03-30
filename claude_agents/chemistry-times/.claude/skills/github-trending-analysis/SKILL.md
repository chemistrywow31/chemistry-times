---
name: GitHub Trending Analysis
description: Methodology for analyzing GitHub trending repositories and extracting tech-newsworthy insights
---

# GitHub Trending Analysis

## Description

This skill provides a structured method for collecting GitHub trending repositories, evaluating their newsworthiness against defined criteria, and producing digestible analysis entries for the daily newspaper production pipeline.

## Users

This skill belongs exclusively to `agents/tech/tech-analyst.md`

## Core Knowledge

### Data Collection

1. Fetch `https://github.com/trending` for daily trending (default view)
2. Fetch `https://github.com/trending?since=weekly` for weekly momentum context
3. Apply language filter when brief specifies a domain (e.g., `?l=python` for AI/ML focus)
4. Supplement with Product Hunt daily launches for non-code tools
5. Check ArXiv `cs.CL`, `cs.AI`, `cs.LG` for papers with associated repositories

You must collect data from the live page using WebFetch or WebSearch, not from memory.

### Analysis Framework Per Repository

Evaluate each trending repository on these metrics:

| Metric | How to Assess |
|--------|--------------|
| Star velocity | Stars gained in last 24 hours (shown on trending page) |
| Contributor growth | Recent commit activity, number of unique contributors in last 30 days |
| Fork-to-star ratio | `forks / stars` — ratio >0.3 indicates high practical utility |
| README quality | Well-documented = installation steps, usage examples, clear description |
| Educational/AI relevance | Direct applicability to language learning, education tech, or AI capabilities |

### Newsworthiness Criteria

Select repositories that match 2 or more of the following:

- [ ] AI/ML project (LLM, speech processing, NLP, computer vision)
- [ ] Developer tool with broad impact (affects workflow of many developers)
- [ ] Breakthrough implementation of a recent research paper
- [ ] Taiwan or Chinese developer or organization as primary contributor
- [ ] Education technology application (learning tools, tutoring, assessment)
- [ ] Star velocity >500 stars in 24 hours
- [ ] Fork-to-star ratio >0.3 (high practical adoption signal)

If fewer than 3 repositories pass the threshold on a given day, lower the minimum match count to 1 and select the 3 most relevant.

### Relevance to ChemistryTimes Rating

Assign one of three levels with explicit reasoning:

- **HIGH**: Direct application possible in ChemistryTimes's product, curriculum, or operations
- **MEDIUM**: Adjacent technology that competitors may adopt; worth monitoring
- **LOW**: General tech interest; include only if day's selection is thin

### Output Format Per Repository

```
**{repo-name}** ({total stars}, +{daily stars} today, {primary language})
URL: https://github.com/{owner}/{repo}
Fork ratio: {forks/stars:.2f}
{One paragraph: what the project does, why it is notable now, who benefits}
Relevance to ChemistryTimes: {HIGH | MEDIUM | LOW} — {one sentence justification}
```

### Daily Digest Format

Produce a digest of 3-5 selected repositories, preceded by a one-sentence context note:

```
GitHub Trending — {date} ({N} repositories analyzed, {M} selected)

1. {repository entry}
2. {repository entry}
3. {repository entry}
```

## Application Guide

### Scenario A: General Daily Sweep

1. Fetch daily trending page
2. Collect all visible repositories (typically 25)
3. Score each against newsworthiness criteria (count matches)
4. Select top 3-5 by match count, breaking ties by star velocity
5. Write analysis paragraph for each selected repository
6. Assign ChemistryTimes relevance rating
7. Produce daily digest

### Scenario B: Topic-Focused Research (from Editorial Brief)

1. Extract topic keywords from brief (e.g., "speech recognition", "AI tutoring")
2. Search GitHub topic pages: `https://github.com/topics/{keyword}`
3. Filter results by recent activity (updated within last 7 days)
4. Apply full analysis framework
5. Produce focused analysis (not daily digest format) with competitive implications

### Scenario C: Paper-to-Repository Tracking

1. Identify paper referenced in brief (title or ArXiv ID)
2. Search GitHub for repositories implementing the paper
3. Evaluate maturity: stars, forks, README quality, open issues
4. Assess whether the implementation is production-ready or research-only
5. Include production-readiness assessment in the output paragraph

## Quality Checkpoints

- [ ] Data fetched from live GitHub page, not recalled from memory
- [ ] Each selected repository matches 2+ newsworthiness criteria (criteria listed in output)
- [ ] Fork-to-star ratio is calculated and included
- [ ] ChemistryTimes relevance rating includes a specific one-sentence justification
- [ ] Daily digest contains 3-5 entries (not fewer, not more)
- [ ] Analysis paragraph answers: what + why notable + who benefits

## Example

### Input
Today's GitHub trending page (fetched live)

### Output
```
GitHub Trending — 2026-03-18 (25 repositories analyzed, 4 selected)

1. **open-interpreter** (12,340 stars, +800 today, Python)
URL: https://github.com/OpenInterpreter/open-interpreter
Fork ratio: 0.15
Natural language interface that allows LLMs to execute code locally. Surged today
following a viral demo showing GPT-4 autonomously debugging a Python project.
Broad interest but low practical contribution rate (ratio 0.15) suggests adoption
is exploratory. Strong community momentum.
Relevance to ChemistryTimes: HIGH — could power interactive coding exercises in
tech-English courses where learners write and run code with English prompts.

2. **whisper-live** (3,210 stars, +620 today, Python)
URL: https://github.com/collabora/WhisperLive
Fork ratio: 0.42
Real-time speech transcription server built on OpenAI Whisper. Fork ratio 0.42
indicates high practical adoption. Active contributor base (47 unique contributors
last 30 days). Designed for low-latency deployment.
Relevance to ChemistryTimes: HIGH — direct application to real-time pronunciation
assessment and live lesson transcription. Competitors may already be evaluating this.
```
