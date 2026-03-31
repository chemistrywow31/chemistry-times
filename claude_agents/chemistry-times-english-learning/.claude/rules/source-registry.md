---
name: Source Registry
description: Define mandatory beat sources and monitoring priority for daily newsgathering across tech and general news
---

# Source Registry

## Applicability

- Applies to: Editor-in-Chief, Digital Journalist

## Rule Content

### Source List Location

Five source lists are maintained in the workspace:

- `workspace/source-monitoring-tech.md` — AI & 科技 (AI labs, dev platforms, tech media, open source)
- `workspace/source-monitoring-gaming.md` — 遊戲產業 (platform holders, gaming media)
- `workspace/source-monitoring-jobs.md` — 軟體職缺 (job platforms, hiring reports)
- `workspace/source-monitoring-capital.md` — 資金動向 (deal databases, VC media)
- `workspace/source-monitoring-general.md` — 國際新聞 (BBC, CNN, Reuters, NYT, Guardian, AP News)

These lists are authoritative. Digital Journalist must consult them before starting any newsgathering task.

### Social Media Aggregator — First Stop

Before checking beat sources, fetch the X (Twitter) daily summary from **https://x.deepsrt.com/** (Tier 2). Focus on: AI & Technology, Gaming, Industry & Commerce, Finance & Markets, World News sections.

Workflow: scan summary -> identify relevant items -> trace back to original source before including.

### Daily Monitoring Obligation

After the aggregator scan, check Beat Sources before running open WebSearch queries.

#### AI & 科技 Beat Sources
| Priority | Sources |
|----------|---------|
| Must-check | Anthropic News, OpenAI Blog, GitHub Trending (daily), HuggingFace Daily Papers, Hacker News front page |
| Daily rotating | Google DeepMind Blog, DeepSeek Blog, NVIDIA Newsroom, ArXiv cs.CL, 36Kr, TechCrunch |

#### 國際新聞 Beat Sources
| Priority | Sources |
|----------|---------|
| Must-check | BBC News, CNN, Reuters, AP News |
| Daily rotating | NYT, The Guardian, Al Jazeera English, NHK World, France 24 |

#### 商業 & 產業 Beat Sources
| Priority | Sources |
|----------|---------|
| Must-check | Crunchbase News, TechCrunch Venture, PitchBook News, IGN, GamesIndustry.biz |
| Daily rotating | Axios Pro Rata, Bloomberg Technology, Eurogamer, VGC |

#### 軟體職缺 Beat Sources
| Priority | Sources |
|----------|---------|
| Must-check | Layoffs.fyi, 104 人力銀行, LinkedIn Jobs Blog |
| Daily rotating | TechCrunch Layoffs, iThome, INSIDE |

### Search Complement

After beat source checks, run open WebSearch queries to discover stories not covered by beat sources.

### Source List Maintenance

- Review cycle: monthly
- Any source exhibiting content farm traits must be removed immediately

## Violation Determination

- Journalist starts WebSearch before checking beat sources -> Violation
- Source list files do not exist at newsgathering start -> Violation (Editor-in-Chief responsibility)
- Source added without URL and credibility tier -> Violation

## Exceptions

- Breaking news with known source may go direct without full beat rotation. All other beats must still be checked before the phase closes.
