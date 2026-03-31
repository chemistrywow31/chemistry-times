# ChemistryTimes 化學時報

每日新聞日報 + 英語學習平台。從主流英文新聞網站（科技 + 綜合媒體）挑選值得分享的報導（至少5篇），製作雙模式文章：獨立中文版（台灣風格編輯）+ 英語學習版（原文段落 + 折疊中文翻譯 + 折疊文法重點 + 重點單字表格 + 段落TTS音檔）。

## Deployment Mode

This team runs in **subagent mode**. Editor-in-Chief delegates all tasks via the Task tool. All agents run within a single Claude Code session. No agent may spawn sub-coordinators or delegate tasks laterally to peer agents.

## Communication Language

All inter-agent communication and internal reports must use **Traditional Chinese**. Technical terms (HTML, API, TTS, CEFR, etc.) may remain in English without translation. Do not use Simplified Chinese characters or mainland China terminology.

## Content Sections

Sections are flexible and may be reorganized by Editor-in-Chief based on the day's news.

Default sections:

| Section | Description |
|---------|-------------|
| AI & 科技 | AI 新資訊、模型發布、AI 產業動態、軟硬體技術趨勢、開源專案、開發工具 |
| 商業 & 產業 | 融資、併購、全球資金流向、遊戲產業、企業策略、市場趨勢 |
| 國際新聞 | 地緣政治、科學、健康、綜合性重大新聞 |
| 軟體職缺 | 軟體業 PM / 技術缺、就業市場變化 |

Editor-in-Chief may add, remove, or merge sections for any given edition.

## Dual-Mode Articles

Every article is published in two modes, switchable via HTML toggle:

### 中文版
Independent Chinese article written in Taiwan-style Mandarin. Vivid, conversational tone with internet slang. Written independently from source material — not translated from English. Contains: 標題, TL;DR, 內文, 化學觀點.

### English Learning
Structured learning content built from original English news text:
- **原文段落**: Preserved original English text (not simplified, not rewritten)
- **折疊中文翻譯**: Collapsible precise Chinese translation per paragraph
- **折疊文法重點**: Collapsible grammar analysis per paragraph, calibrated for CEFR B1-B2
- **重點單字表格**: Vocabulary table (English word, Chinese definition, part of speech)
- **TTS 音檔**: Pre-generated audio per paragraph via OpenAI TTS API, embedded as static audio files

Toggle: `中文版 / English Learning` button switches between modes without page reload.

## Daily Workflow

| Phase | Agent(s) | Description |
|-------|----------|-------------|
| 1. Topic Setting | Editor-in-Chief | Set daily topic list, assign priorities |
| 2. Newsgathering | Digital Journalist | Gather from tech + general news sources |
| 3. Fact Verification | Data Auditor | Verify facts, tag source credibility |
| 4. Analysis | Tech + Business + World News Analysts (parallel) | Domain commentary, streamed to Phase 5 |
| 5. Content Production | CN Writer + EN Curator (parallel) | CN: independent articles. EN: curate original text for learning |
| 6. Education Pipeline | Per-article streaming: Translator + Grammar Analyst (parallel) + HTML Producer TTS pre-gen | Translation, grammar analysis, TTS generation via `tts-producer` skill — triggered per article as EN content finalizes |
| 7. Education Review | Education Expert | Quality gate for learning content |
| 8. HTML Production | HTML Daily Producer | Dual-mode HTML assembly with all content tracks |
| 9. Code Review | Code Reviewer | HTML/CSS/JS quality validation |
| 10. Final Approval + Publish | Editor-in-Chief → HTML Producer | Authorize upload, execute upload + article registration |

**Streaming trigger**: Each article's EN content, once finalized by EN Curator, immediately triggers its education pipeline (Phase 6). CN Writer runs in parallel with the entire EN + education pipeline.

**Escalation rule**: If Phase 5 is not complete by the target time, Editor-in-Chief must reduce scope or skip the English Learning version.

## Output Format

The daily output is a **single self-contained HTML page** with:
- Fixed left sidebar Table of Contents (smooth scroll to anchors)
- Dual-mode toggle: 中文版 / English Learning (pure JS + CSS, no page reload)
- Collapsible translation and grammar sections in English Learning mode
- Vocabulary tables per article in English Learning mode
- Embedded audio players for TTS per paragraph in English Learning mode
- All styles inline or in `<style>` tags — no CDN dependencies (except Google Fonts Huninn)
- All assets use relative server paths

**File naming**: `chemistry-times-{YYYY-MM-DD}.html`

**File upload endpoint**: `POST /chemistry-times/api/upload` (multipart form, field name: `file`)

**Article API registration**: After upload, register via:
```bash
curl -X POST https://${SITE_HOST}/chemistry-times/api/articles \
    -H "Content-Type: application/json" \
    -d '{"title":"{CN headline summary}","title_en":"{EN headline summary}","url":"/chemistry-times/static/articles/chemistry-times-YYYY-MM-DD.html","date":"YYYY-MM-DD"}'
```

**TTS audio upload**: Audio files are uploaded as static assets via the same upload endpoint before HTML publication. Audio files are named `tts-{article-id}-p{paragraph-number}.mp3` and referenced in the HTML via relative paths.

## Writing Standards

**Chinese version**: Use Taiwan-style Mandarin. Vivid, conversational tone. Internet slang is permitted (超有感, 根本神操作, 這波我給過). Pop culture references and rhetorical questions are encouraged. Prohibited: mainland China terms (use 資訊 not 信息, 影片 not 視頻, 軟體 not 軟件, 程式 not 程序). The Chinese version must be written independently from source material.

**English Learning version**: Preserve original news text verbatim. Translations must be precise and natural in Taiwan Mandarin. Grammar explanations must target CEFR B1-B2 level — contextual analysis of the specific sentence, not generic grammar definitions.

## Quality Gates

Four gates must pass before publication:

1. **Fact-check gate**: Data Auditor verifies all sources before content enters analysis.
2. **Education quality gate**: Education Expert reviews all learning content (translations, grammar, vocabulary) before HTML assembly.
3. **Code review gate**: Code Reviewer approves the HTML before upload.
4. **Final approval gate**: Editor-in-Chief approves before HTML Producer uploads.

Any gate failure stops the pipeline. Editor-in-Chief decides whether to fix, reduce scope, or postpone.

## Context Management

Every agent in this team must follow these rules to prevent context bloat:

- **Editor-in-Chief breaks work into focused subtasks**, one per agent invocation. Each Task call must have a single, well-scoped objective.
- **Agents report results as structured summaries** with completion status (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT). Maximum 500 words per summary.
- **Raw data must be written to files**. Scraped HTML, full article text, data tables, and any content exceeding 200 words must be saved to a file under `workspace/` and referenced by path.
- **Each agent must state at the start of its task** what input it received and from which agent. At the end, state what it produced and where.

## Worklog

All work is documented in `.worklog/yyyymm/task-name/phase-n-label/` with three core files per phase:
- `references.md` — Sources consulted
- `findings.md` — Key discoveries and analysis
- `decisions.md` — Decisions with rationale, alternatives, and evidence chain

The worklog serves dual purpose: verifiable decision trail and context offloading. Agents read from worklog instead of carrying full context. Every Task dispatch from Editor-in-Chief must include the current worklog path and upstream reference paths.
