# ChemistryTimes 化學時報

內部數位日報。每日 08:30 出刊，提供雙語（繁中／英文）新聞內容，聚焦競業情報與科技趨勢。

## Deployment Mode

This team runs in **subagent mode**. Editor-in-Chief delegates all tasks via the Task tool. All agents run within a single Claude Code session. No agent may spawn sub-coordinators or delegate tasks laterally to peer agents.

## Communication Language

All inter-agent communication and internal reports must use **Traditional Chinese**. Technical terms (HTML, API, etc.) may remain in English without translation. Do not use Simplified Chinese characters or mainland China terminology.

## Content Sections

| Section | Description |
|---------|-------------|
| AI 動態 | AI 新資訊、模型發布、AI 產業動態 |
| 技術發展 | 軟硬體技術趨勢、開源專案、開發工具 |
| 遊戲產業 | 遊戲產業發展、平台動態、市場趨勢 |
| 軟體職缺 | 軟體業 PM / 技術缺、就業市場變化 |
| 資金動向 | 融資、併購、全球資金流向 |

## Daily Workflow

All phases are sequential unless noted.

| Phase | Agent(s) | Description |
|-------|----------|-------------|
| 1. Topic Setting | Editor-in-Chief | Set daily topic list, assign priorities |
| 2. Newsgathering | Digital Journalist | Gather source articles, raw data, trending items |
| 3. Fact Verification | Data Auditor | Verify facts, tag source credibility, flag issues |
| 4. Analysis + Writing | Analysts (parallel) → Writers (streamed) | Analysts run in parallel. As each analyst completes, its commentary is immediately forwarded to both writers. Writers begin drafting with the first analyst's output and **must revise/expand** each article as subsequent analyst commentary arrives. Writers do NOT wait for all analysts to finish before starting. Editor-in-Chief must explicitly send each new analyst bundle to writers with the instruction: "Integrate this into your draft — revise existing articles and add new ones." |
| 5. HTML Production | HTML Daily Producer | Output HTML to `web/static/articles/chemistry-times-YYYYMMDD.html` |
| 6. Verify + Upload + Register | Code Reviewer → HTML Daily Producer → Editor-in-Chief | Code Reviewer verifies HTML matches NYT Huninn style (CSS tokens, dark theme, Huninn font, no old brand colors). If PASS: upload to server via API, confirm 200, POST article metadata to API. If FAIL: return to Phase 5 with issues. |

**Escalation rule**: If Analysis + Writing phase produces fewer than 3 articles, Editor-in-Chief must reduce scope or skip the English version.

## Output Format

The daily output is a **single self-contained HTML page** with:
- Fixed left sidebar Table of Contents (smooth scroll to anchors)
- Bilingual CN/EN toggle (switches without page reload, pure JS + CSS)
- All styles inline or in `<style>` tags — no CDN dependencies
- All assets use relative server paths

**File upload endpoint**: `POST /chemistry-times/api/upload` (multipart form, field name: `file`)

Returns a relative URL like: `/chemistry-times/static/articles/chemistry-times-YYYYMMDD.html`

HTML Producer must confirm the returned URL in the task summary. Editor-in-Chief records the URL in the final approval message.

**Article API registration**: After file upload, Editor-in-Chief must register the article by POSTing to the article API:

```bash
# Upload the HTML file
curl -X POST https://${SITE_HOST}/chemistry-times/api/upload \
    -F "file=@chemistry-times-YYYYMMDD.html"

# Register new article
curl -X POST https://${SITE_HOST}/chemistry-times/api/articles \
    -H "Content-Type: application/json" \
    -d '{"title":"{當日重點摘要，如：Apple×Google 重建 Siri、小米挑戰旗艦}","title_en":"{English summary, e.g.: Apple Rebuilds Siri, Xiaomi Challenges Flagships}","url":"/chemistry-times/static/articles/chemistry-times-YYYYMMDD.html","date":"YYYY-MM-DD"}'

# List existing articles (check before registering to avoid duplicates)
curl https://${SITE_HOST}/chemistry-times/api/articles?page=1&limit=15

# Update an article (title, title_en, url, or date)
curl -X PATCH https://${SITE_HOST}/chemistry-times/api/articles/{article_id} \
    -H "Content-Type: application/json" \
    -d '{"title_en":"Updated English Title","url":"/chemistry-times/static/articles/chemistry-times-YYYYMMDD.html"}'

# Delete an article (use when correcting or removing)
curl -X DELETE https://${SITE_HOST}/chemistry-times/api/articles/{article_id}
```

Required fields for POST: `title` (Chinese), `url`, `date` (YYYY-MM-DD format). Optional: `title_en` (English title for bilingual sidebar). The `title` field must reflect the day's actual content highlights (e.g., top 2 stories), not a generic title. The `date` field is the edition date used for sorting and display. Before registering, query the list endpoint to check for duplicates. Use PATCH to update fields without re-creating. Editor-in-Chief must confirm the API returns a success response with an `id` field before marking publication complete.

## Context Management

Every agent in this team must follow these rules to prevent context bloat:

- **Editor-in-Chief breaks work into focused subtasks**, one per agent invocation. Each Task call must have a single, well-scoped objective.
- **Agents report results as summaries** of maximum 500 words. Do not paste raw scraped content, full article text, or unprocessed data into messages.
- **Raw data must be written to files**. Scraped HTML, full article text, data tables, and any content exceeding 200 words must be saved to a file under `teams/chemistry-times/workspace/` and referenced by path in the message.
- **Each agent must state at the start of its task** what input it received and from which agent. At the end, it must state what it produced and where (file path or summary).

## Writing Standards

**Chinese version**: Use Taiwan-style Mandarin. Vivid, conversational tone. Internet slang is permitted (超有感, 根本神操作, 這波我給過). Pop culture references and rhetorical questions are encouraged. Prohibited: mainland China terms (use 資訊 not 信息, 影片 not 視頻, 軟體 not 軟件, 程式 not 程序). Academic or stiff formal tone is prohibited. The Chinese version must be written independently from source material, not translated from the English version.

**English version**: Native journalist voice. Conversational authority — like a knowledgeable colleague who happens to cover the beat. AP style as the foundation. Active voice preferred (80%+). No translation feel. The English version must be written independently from source material, not from the Chinese version.

## Quality Gates

Three gates must be passed before publication:

1. **Fact-check gate**: Data Auditor must complete verification and tag all sources before Analysts receive content.
2. **Code review gate**: Code Reviewer must approve the HTML before it is uploaded to the server.
3. **Final approval gate**: Editor-in-Chief must explicitly approve before HTML Producer uploads.

Any gate failure stops the pipeline. Editor-in-Chief decides whether to fix, reduce scope, or postpone publication.
