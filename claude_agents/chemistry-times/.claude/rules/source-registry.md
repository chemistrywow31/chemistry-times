---
name: Source Registry
description: Define mandatory beat sources and monitoring priority for daily newsgathering
---

# Source Registry

## Applicability

- Applies to: Editor-in-Chief, Digital Journalist

## Rule Content

### Source List Location

Four source lists are maintained in the workspace, one per content section:

- `workspace/source-monitoring-tech.md` — AI 動態 + 技術發展 (AI labs, dev platforms, tech media, open source)
- `workspace/source-monitoring-gaming.md` — 遊戲產業 (platform holders, gaming media, esports, market data)
- `workspace/source-monitoring-jobs.md` — 軟體職缺 (job platforms, hiring reports, labor market)
- `workspace/source-monitoring-capital.md` — 資金動向 (deal databases, VC media, capital markets)

These lists are the authoritative reference. Digital Journalist must consult them before starting any newsgathering task.

### Social Media Aggregator — First Stop

Before checking individual beat sources, Digital Journalist must fetch the X (Twitter) daily summary from:

**https://x.deepsrt.com/** (Tier 2 — curated aggregation of ~500 X posts into ~72 summaries, updated daily, Traditional Chinese)

Focus on these sections:
- **AI & Technology** — model releases, developer tools, agent systems
- **Gaming** — game launches, platform news, esports
- **Industry & Commerce** — corporate news, M&A, business developments
- **Finance & Markets** — investment trends, funding rounds

Workflow: scan the summary → identify items relevant to any of the five content sections → for each promising item, trace back to the original source (official blog, press release, or Tier 1/2 media) before including in the story lineup. The aggregator is a discovery tool, not a citable source — always verify and cite the original.

### Daily Monitoring Obligation

After the social media aggregator scan, Digital Journalist must check **Beat Sources** before running any open WebSearch queries. Beat sources are checked first because they produce Tier 1 content that search engines may not surface promptly.

#### AI 動態 + 技術發展 Beat Sources

| Priority | Sources |
|----------|---------|
| Must-check | Anthropic News, OpenAI Blog, GitHub Trending (daily), HuggingFace Daily Papers, Hacker News front page |
| Daily rotating | Google DeepMind Blog, DeepSeek Blog, NVIDIA Newsroom, ArXiv cs.CL, 36Kr, TechCrunch |
| Weekly | MIT Tech Review, The Batch (deeplearning.ai), Import AI, LMSYS Chatbot Arena |

#### 遊戲產業 Beat Sources

| Priority | Sources |
|----------|---------|
| Must-check | IGN, GamesIndustry.biz, 巴哈姆特 GNN, Famitsu |
| Daily rotating | Eurogamer, Kotaku, Game Developer, VGC, PocketGamer.biz |
| Weekly | Newzoo, Sensor Tower Gaming, Niko Partners |

#### 軟體職缺 Beat Sources

| Priority | Sources |
|----------|---------|
| Must-check | Layoffs.fyi, 104 人力銀行, LinkedIn Jobs Blog |
| Daily rotating | TechCrunch Layoffs, iThome, INSIDE, Hacker News Who's Hiring |
| Weekly | Indeed Hiring Lab, Stack Overflow Survey, Dice Tech Job Report |

#### 資金動向 Beat Sources

| Priority | Sources |
|----------|---------|
| Must-check | Crunchbase News, TechCrunch Venture, PitchBook News |
| Daily rotating | Axios Pro Rata, Bloomberg Technology, 鉅亨網, DealStreetAsia |
| Weekly | CB Insights, Stanford HAI AI Index, NVCA reports |

### Search Complement

After completing beat source checks, Digital Journalist runs open WebSearch queries to discover stories not covered by beat sources. WebSearch is a supplement, not the primary source.

### Source List Maintenance

- Review cycle: quarterly (next review recorded in each source list file)
- Editor-in-Chief may add or remove sources at any time
- Any source exhibiting content farm traits (per `content-farm-filter.md`) must be removed immediately and flagged in the next quarterly review

## Violation Determination

- Digital Journalist starts WebSearch queries before checking beat sources → Violation
- Beat source list files do not exist or are empty at the start of a newsgathering task → Violation (Editor-in-Chief responsibility)
- Source added to beat list without URL and credibility tier → Violation

## Exceptions

- If a breaking news event is already known (e.g., user requests coverage of a specific story), Digital Journalist may go directly to relevant sources without completing the full beat rotation. All other beat sources must still be checked before the newsgathering phase closes.
