---
name: GitHub Trending Analysis
description: Methodology for analyzing GitHub trending repositories and extracting tech-newsworthy insights
---

# GitHub Trending Analysis

## Description

This skill provides a structured method for collecting GitHub trending repositories, evaluating newsworthiness, and producing digestible analysis for the daily newspaper.

## Users

- Tech Analyst: primary user for daily GitHub trending analysis

## Core Knowledge

### Data Collection

1. Fetch `https://github.com/trending` for daily trending
2. Fetch `https://github.com/trending?since=weekly` for weekly context
3. Apply language filter when brief specifies a domain (e.g., `?l=python`)
4. Supplement with Product Hunt and ArXiv repos

Collect data from live pages using WebFetch or WebSearch, not from memory.

### Analysis Framework

| Metric | How to Assess |
|--------|--------------|
| Star velocity | Stars gained in last 24 hours |
| Fork-to-star ratio | `forks / stars` — >0.3 = high practical utility |
| README quality | Installation steps, usage examples, clear description |
| Relevance | Applicability to AI, education, language learning |

### Newsworthiness Criteria (2+ required)

- AI/ML project
- Developer tool with broad impact
- Breakthrough paper implementation
- Taiwan/Chinese developer as primary contributor
- Education technology application
- Star velocity >500/day
- Fork-to-star ratio >0.3

### Output Format

```
**{repo-name}** ({total stars}, +{daily} today, {language})
URL: https://github.com/{owner}/{repo}
Fork ratio: {forks/stars:.2f}
{One paragraph: what, why notable, who benefits}
Relevance: {HIGH|MEDIUM|LOW} — {justification}
```

## Application Guide

### Scenario A: General Daily Sweep
Fetch trending, score against criteria, select top 3-5, write analysis, assign relevance.

### Scenario B: Topic-Focused Research
Search GitHub topic pages, filter by recent activity, apply full framework.

### Scenario C: Paper-to-Repository Tracking
Find implementations of referenced papers, assess maturity and production-readiness.

## Quality Checkpoints

- [ ] Data fetched from live page
- [ ] Each selection matches 2+ criteria
- [ ] Fork-to-star ratio calculated
- [ ] Relevance rating with justification
- [ ] 3-5 entries per digest
