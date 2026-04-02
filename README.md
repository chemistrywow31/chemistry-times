# ChemistryTimes 化學時報

AI-powered internal daily newsletter — bilingual web reader + automated content pipeline, all in one Go monolith.

> **[繁體中文](#繁體中文)** | **[English](#english)**

---

<a id="繁體中文"></a>

## 繁體中文

### 專案簡介

ChemistryTimes 是一套**內部電子日報系統**，將「網站閱讀」與「AI 內容生成」整合在同一個專案中。

**它能做什麼？**

- **自動產報** — 每個工作日早上，Claude Code agent 團隊自動從多來源採集新聞，經事實查核、雙語撰稿、HTML 排版後上傳至伺服器
- **線上閱讀** — NYT 報紙風格的 Web 閱讀器，支援深色模式、繁中/英文即時切換、文章側邊欄分頁瀏覽，文章以 iframe 嵌入呈現
- **雙頻道** — 主站 `/chemistry-times` 與遊戲版 `/chemistry-game-times` 共用同一套後端，各自維護獨立內容

**為什麼叫化學時報？** 取自團隊內部代號，「化學反應」象徵資訊碰撞產生新洞見。

**適合誰？** 內部團隊日常資訊同步。無需登入驗證，啟動即可使用。

### 系統架構

```
┌─────────────────────────────────────────────────────┐
│                  ChemistryTimes                      │
│                                                     │
│  ┌──────────────┐    ┌──────────────┐               │
│  │  Go + Gin     │    │  MongoDB 7   │               │
│  │  Web Server   │◄──►│  articles    │               │
│  │  port 17171   │    │  collection  │               │
│  └──────┬───────┘    └──────────────┘               │
│         │                                            │
│  ┌──────┴───────┐    ┌──────────────────────────┐   │
│  │  HTML/CSS/JS  │    │  Claude Code Agent Team   │   │
│  │  前端閱讀器    │    │  AI 自動產線（採集→寫稿   │   │
│  │  iframe 嵌入   │    │  →HTML→上傳→註冊）        │   │
│  └──────────────┘    └──────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Tech Stack

| 層級 | 技術 |
|------|------|
| 後端 | Go 1.24 + Gin |
| 資料庫 | MongoDB 7 |
| 前端 | 原生 HTML/CSS/JS（Go template 渲染） |
| 內容生成 | Claude Code agent 團隊（多 agent 協作） |
| 部署 | Docker Compose |
| 反向代理 | Nginx + Let's Encrypt SSL 自動續約 |
| 跨平台編譯 | Docker buildx（Mac ARM → Linux amd64） |

---

### 快速開始

#### 前置條件

- Docker & Docker Compose
- Go 1.24+（僅方式二需要）

#### 方式一：Docker Compose（推薦，零設定）

```bash
docker compose up -d --build
open http://localhost:17171/chemistry-times
```

內建預設值，不需要先建 `.env`。如需自訂 API key：

```bash
cp .env.example .env   # 編輯 API_KEY
docker compose up -d --build
```

停止服務：

```bash
docker compose down      # 停止（保留資料）
docker compose down -v   # 停止並清除資料庫
```

#### 方式二：本地 Go + MongoDB

```bash
make run
open http://localhost:17171/chemistry-times
```

`make run` 會自動：建立 `.env`（從 `.env.example`）→ 啟動 MongoDB Docker 容器 → 載入環境變數 → 執行 Go server。

```bash
make mongo-clean   # 清除 MongoDB 容器 + 資料
```

#### 方式三：手動

```bash
cp .env.example .env
docker run -d -p 27017:27017 mongo:7
go run .
```

---

### 生成文章（AI 自動產線）

日報由 Claude Code agent 團隊自動產出。整個產線包含 6 個階段：

| 階段 | 負責 Agent | 工作內容 |
|------|-----------|---------|
| 1. 選題 | 主編 | 設定當日主題、分配優先級 |
| 2. 採集 | 數位記者 | 從多來源採集新聞素材 |
| 3. 查核 | 資料審計師 | 事實查核、來源可信度標記 |
| 4. 分析 + 寫作 | 分析師 + 中英文撰稿人 | 平行分析、雙語獨立撰稿 |
| 5. HTML 排版 | HTML 製作人 | 套用 NYT Huninn 報紙風格模板 |
| 6. 審核 + 上傳 | 程式碼審查 + 主編 | 檢查 HTML → 上傳 → API 註冊 |

#### 手動觸發產線

在 `claude_agents/chemistry-times/` 目錄下啟動 Claude Code，主編 agent 會自動執行完整產線。

詳細的 agent 團隊架構請參考下方 [AI Agent 團隊說明](#ai-agent-團隊說明) 章節。

---

### 手動發佈文章

如果需要手動建立或上傳文章（不透過 AI 產線）：

#### Step 1：準備 HTML 文章

```bash
# 複製模板
cp web/static/articles/TEMPLATE.html \
   web/static/articles/chemistry-times-20260401.html

# 編輯文章，填入 {{placeholders}}
```

模板中的 section 分類：

| Section | CSS class | 顏色 | 內容 |
|---------|-----------|------|------|
| AI 動態 | `ai` | indigo | AI 新資訊、模型發布 |
| 技術發展 | `tech` | cyan | 軟硬體技術趨勢 |
| 遊戲產業 | `gaming` | rose | 遊戲產業發展 |
| 軟體職缺 | `jobs` | emerald | PM / 技術職缺 |
| 資金動向 | `capital` | amber | 融資、併購 |
| 快訊 | (同上) | — | 各類短訊 |

#### Step 2：上傳並註冊

使用 publish 腳本一鍵完成上傳 + MongoDB 註冊：

```bash
./scripts/publish-article.sh \
  web/static/articles/chemistry-times-20260401.html \
  "化學時報 2026-04-01" \
  2026-04-01
```

指定遠端伺服器：

```bash
./scripts/publish-article.sh \
  web/static/articles/chemistry-times-20260401.html \
  "化學時報 2026-04-01" \
  2026-04-01 \
  https://your-server.example.com
```

---

### AI Agent 團隊說明

`claude_agents/chemistry-times/` 是 AI 日報產線的核心目錄。它是一個獨立的 Claude Code 工作區，包含完整的 agent 定義、規則、技能和工作空間。

#### 目錄結構

```
claude_agents/chemistry-times/
├── CLAUDE.md                              # Agent 團隊主設定檔
│                                          # 定義內容主題、工作流程、API 端點、
│                                          # 寫作規範、品質關卡
│
├── .claude/
│   ├── agents/                            # Agent 角色定義
│   │   ├── editor-in-chief.md             # 主編 — 統籌產線、分配任務、最終審核
│   │   ├── analysis/
│   │   │   ├── tech-analyst.md            # 技術分析師 — AI、技術趨勢、GitHub Trending
│   │   │   ├── online-english-education-analyst.md
│   │   │   │                              # 遊戲產業分析師 — 平台動態、市場趨勢
│   │   │   └── marketing-analyst.md       # 市場分析師 — 資金動向、軟體職缺
│   │   ├── journalism/
│   │   │   ├── digital-journalist.md      # 數位記者 — 多來源新聞採集
│   │   │   └── data-auditor.md            # 資料審計師 — 事實查核、來源分級
│   │   ├── writing/
│   │   │   ├── chinese-daily-writer.md    # 中文撰稿人 — 台灣用語、口語化風格
│   │   │   └── english-daily-writer.md    # 英文撰稿人 — AP style、原生英文
│   │   ├── production/
│   │   │   └── html-daily-producer.md     # HTML 製作人 — NYT Huninn 風格排版
│   │   └── review/
│   │       ├── code-reviewer.md           # 程式碼審查 — HTML 模板合規檢查
│   │       └── process-reviewer.md        # 流程審查 — 產線效率回顧
│   │
│   ├── rules/                             # 共用規則（所有 agent 遵守）
│   │   ├── source-registry.md             # 來源清單指引 + Beat Source 優先級
│   │   ├── content-farm-filter.md         # 內容農場偵測 + 來源可信度分級
│   │   ├── temporal-awareness.md          # 時效性標記（即時/近期/非即時/歷史）
│   │   ├── topic-deduplication.md         # 主題去重 + 冷卻期機制
│   │   ├── source-attribution.md          # 來源標示格式規範
│   │   ├── bilingual-output-standard.md   # 雙語產出標準（內容對齊、獨立撰寫）
│   │   ├── chinese-style-guide.md         # 中文風格指南（台灣用語、禁用詞）
│   │   ├── english-style-guide.md         # 英文風格指南（AP style、結構要求）
│   │   ├── html-template-standard.md      # HTML 模板規範（設計 token、結構元素）
│   │   ├── html-quality-standard.md       # HTML 品質標準
│   │   ├── daily-deadline.md              # 每日截止時間 + 超時升級協議
│   │   └── context-management.md          # Context 管理（摘要回報、檔案傳遞）
│   │
│   └── skills/                            # Agent 可調用的技能
│       ├── daily-production-pipeline/     # 每日產線流程規格
│       ├── fact-checking-framework/       # 事實查核方法論
│       ├── github-trending-analysis/      # GitHub Trending 分析法
│       ├── multi-platform-intelligence/   # 多平台新聞採集法
│       └── post-uploader/                 # HTML 檔案上傳工具
│
└── workspace/                             # 工作空間（產線運行時的資料存放處）
    ├── source-monitoring-tech.md          # AI 動態 + 技術發展 來源清單
    ├── source-monitoring-gaming.md        # 遊戲產業 來源清單
    ├── source-monitoring-jobs.md          # 軟體職缺 來源清單
    ├── source-monitoring-capital.md       # 資金動向 來源清單
    ├── topic-ledger.md                    # 主題帳本（已刊登主題追蹤）
    └── template/                          # HTML 文章模板
        ├── chemistry-times-template.html  # 正式模板
        └── chemistry-times-iframe-template.html
```

#### Agent 協作流程

```
主編 (Editor-in-Chief)
  │
  ├─► 數位記者 ─► 資料審計師 ─┐
  │                            │
  │   ┌────────────────────────┤
  │   │                        │
  │   ├─► 技術分析師 ──────────┤
  │   ├─► 遊戲產業分析師 ──────┤  (平行分析)
  │   ├─► 市場分析師 ──────────┤
  │   │                        │
  │   │   ┌────────────────────┤
  │   │   │                    │
  │   ├─► 中文撰稿人 ─────────┤  (平行撰稿)
  │   ├─► 英文撰稿人 ─────────┤
  │   │                        │
  │   └─► HTML 製作人 ─► 程式碼審查 ─► 主編最終審核 ─► 上傳
  │
  └─► 流程審查（事後回顧）
```

#### 五大內容主題

| 主題 | 分析師 | 來源清單 |
|------|--------|----------|
| AI 動態 | 技術分析師 | `source-monitoring-tech.md` |
| 技術發展 | 技術分析師 | `source-monitoring-tech.md` |
| 遊戲產業 | 遊戲產業分析師 | `source-monitoring-gaming.md` |
| 軟體職缺 | 市場分析師 | `source-monitoring-jobs.md` |
| 資金動向 | 市場分析師 | `source-monitoring-capital.md` |

#### 品質關卡

產線設有三道品質關卡，任一未通過即停止發行：

1. **事實查核關** — 資料審計師完成驗證並標記所有來源
2. **程式碼審查關** — 程式碼審查確認 HTML 符合模板規範
3. **主編最終審核** — 主編確認內容品質後授權上傳

#### 如何修改 Agent 行為

- **調整內容主題** — 編輯 `CLAUDE.md` 的 Content Sections
- **新增/修改 Agent** — 在 `.claude/agents/` 下新增或編輯 `.md` 檔案
- **調整採集來源** — 編輯 `workspace/source-monitoring-*.md`
- **修改寫作風格** — 編輯 `.claude/rules/` 下的 style guide
- **調整品質標準** — 編輯 `.claude/rules/` 下的對應規則

---

### AI Agent 團隊：英語學習版 (English Learning Edition)

`claude_agents/chemistry-times-english-learning/` 是化學時報的**英語學習加強版**產線。在原有中英雙語日報的基礎上，額外產出結構化的英語學習內容，適合 CEFR B1-B2 中級學習者。

#### 與基礎版的差異

| 項目 | 基礎版 (`chemistry-times`) | 英語學習版 (`chemistry-times-english-learning`) |
|------|---------------------------|----------------------------------------------|
| 中文版 | 獨立撰寫的台灣風格新聞 | 同左 |
| 英文版 | 獨立撰寫的原生英文報導 | 保留原文段落，附逐段翻譯、文法解析、單字表 |
| TTS 音檔 | 無 | 每段原文配 OpenAI TTS 語音 |
| 文章切換 | 繁中 / 英文 雙語切換 | 中文版 / English Learning 雙模式切換 |
| 內容主題 | AI 動態、技術、遊戲、職缺、資金 | AI & 科技、商業 & 產業、國際新聞、軟體職缺 |

#### 英語學習版特有功能

- **原文段落保留** — 不改寫、不簡化，直接呈現原始英文新聞
- **折疊中文翻譯** — 每段可展開精準中文翻譯（台灣用語）
- **折疊文法重點** — 每段 1-3 個文法結構解析，針對該句子的實際用法
- **重點單字表** — 每篇 5-10 個 B1-B2 等級詞彙，含詞性、中文定義、原文例句
- **TTS 語音** — 每段原文配預先生成的 MP3 音檔，語速略慢適合學習

#### 目錄結構

```
claude_agents/chemistry-times-english-learning/
├── CLAUDE.md                              # 團隊設定（雙模式產出、10 階段工作流）
├── .claude/
│   ├── agents/                            # 14 個 Agent 角色
│   │   ├── editor-in-chief.md             # 主編
│   │   ├── analysis/
│   │   │   ├── tech-analyst.md            # 科技分析師
│   │   │   ├── business-analyst.md        # 商業分析師
│   │   │   └── world-news-analyst.md      # 國際新聞分析師
│   │   ├── journalism/
│   │   │   ├── digital-journalist.md      # 數位記者
│   │   │   └── data-auditor.md            # 資料審計師
│   │   ├── writing/
│   │   │   ├── chinese-daily-writer.md    # 中文撰稿人
│   │   │   └── english-content-curator.md # 英文內容策展人（保留原文，非撰寫）
│   │   ├── education/                     # 教育管線（英語學習版專屬）
│   │   │   ├── professional-translator.md # 專業翻譯
│   │   │   ├── grammar-analyst.md         # 文法分析師
│   │   │   └── education-expert.md        # 教育專家（品質把關）
│   │   ├── production/
│   │   │   └── html-daily-producer.md     # HTML 製作人
│   │   └── review/
│   │       ├── code-reviewer.md           # 程式碼審查
│   │       └── process-reviewer.md        # 流程審查
│   │
│   ├── rules/                             # 14 條共用規則
│   │   ├── dual-mode-output-standard.md   # 雙模式產出標準（中文版 + English Learning）
│   │   ├── english-learning-standard.md   # 英語學習內容標準（CEFR B1-B2）
│   │   ├── english-curation-guide.md      # 英文策展指南（原文保留原則）
│   │   ├── worklog.md                     # 工作日誌規範（可追溯決策鏈）
│   │   └── ...                            # 其餘同基礎版
│   │
│   └── skills/                            # 9 個可調用技能
│       ├── boss/                          # 啟動主編（一鍵觸發完整產線）
│       ├── tts-producer/                  # TTS 音檔生成（OpenAI API）
│       ├── english-learning-assembly/     # 英語學習內容組裝
│       ├── post-uploader/                 # HTML + 音檔上傳
│       └── ...                            # 其餘同基礎版
│
└── workspace/                             # 工作空間
    ├── source-monitoring-*.md             # 來源清單（含國際新聞來源）
    ├── topic-ledger.md                    # 主題帳本
    ├── template/                          # HTML 模板
    ├── tts/                               # TTS 音檔存放處
    ├── build-html.py                      # HTML 建構腳本
    ├── generate-tts-fish.mjs              # TTS 生成腳本（Fish Audio）
    └── tts-config.yaml                    # TTS 設定
```

#### Agent 協作流程（10 階段）

```
主編 (Editor-in-Chief)
  │
  ├─► 1. 選題設定
  ├─► 2. 數位記者（採集）
  ├─► 3. 資料審計師（事實查核）
  │
  ├─► 4. 分析師 ×3（平行）
  │      ├─ 科技分析師
  │      ├─ 商業分析師
  │      └─ 國際新聞分析師
  │
  ├─► 5. 撰稿（平行）
  │      ├─ 中文撰稿人 ─────────────────────────────────┐
  │      └─ 英文策展人 ──┐                               │
  │                       │                               │
  ├─► 6. 教育管線（串流觸發：每篇英文完成即啟動）         │
  │      ├─ 翻譯 + 文法分析（平行）                      │
  │      └─ TTS 音檔生成                                 │
  │                                                       │
  ├─► 7. 教育專家（品質把關）                             │
  ├─► 8. HTML 製作人（組裝雙模式頁面）◄─────────────────┘
  ├─► 9. 程式碼審查
  └─► 10. 主編最終審核 → 上傳
```

#### 四道品質關卡

1. **事實查核關** — 資料審計師驗證所有來源
2. **教育品質關** — 教育專家審核翻譯精準度、文法解析等級、單字難度校準
3. **程式碼審查關** — 確認 HTML 模板合規
4. **主編最終審核** — 授權上傳

---

### 如何操作 Claude Agent 團隊

`claude_agents/` 下的每個子目錄都是獨立的 Claude Code 工作區。操作方式：

#### 啟動產線

```bash
# 方式一：在目標團隊目錄下啟動 Claude Code
cd claude_agents/chemistry-times-english-learning
claude

# 進入 Claude Code 後，使用 /boss 技能觸發完整產線
/boss
```

```bash
# 方式二：基礎版日報
cd claude_agents/chemistry-times
claude
/boss
```

#### 工作原理

每個團隊的 `CLAUDE.md` 定義了團隊設定，`.claude/agents/` 下的 `.md` 檔案定義各 agent 的角色。啟動後：

1. **主編 (Editor-in-Chief)** 是唯一的 coordinator，負責分派所有任務
2. 所有 agent 以 **subagent 模式** 運行 — 主編透過 Task tool 派工，agent 完成後回報
3. agent 之間**不會**直接互相通訊，一切經由主編轉發
4. 產線中的每個階段有明確的**品質關卡**，未通過即停止

#### 自訂團隊行為

| 想調整什麼 | 編輯哪個檔案 |
|-----------|-------------|
| 內容主題 / 工作流程 | `CLAUDE.md` |
| 新增 / 修改 Agent 角色 | `.claude/agents/*.md` |
| 修改共用規則 | `.claude/rules/*.md` |
| 調整新聞來源 | `workspace/source-monitoring-*.md` |
| 新增技能 | `.claude/skills/` 下新增目錄 + `SKILL.md` |

#### 團隊架構概覽

```
claude_agents/
├── chemistry-times/                    # 基礎版日報（雙語新聞）
│   ├── 10 個 agent、12 條規則、5 個技能
│   └── 6 階段產線：選題→採集→查核→分析寫作→HTML→上傳
│
└── chemistry-times-english-learning/   # 英語學習版（雙模式：中文版 + English Learning）
    ├── 14 個 agent、14 條規則、9 個技能
    └── 10 階段產線：選題→採集→查核→分析→撰稿→教育管線→品質把關→HTML→審查→上傳
```

---

### 部署到 Production

Production 包含 Go app + MongoDB + Nginx reverse proxy + Certbot SSL 自動續約，全部由 `docker-compose.prod.yml` 管理。

```
Internet :80/:443
    ↓
ct-nginx（Nginx reverse proxy）
    └─ ct-app:17171（Go + Gin）
         └─ ct-mongo:27017（MongoDB，僅內部網路）

ct-certbot → 自動續約 SSL（每 12 小時檢查）
ct-nginx 每 6 小時 reload → 載入新憑證
```

#### Step 1：Build & Push Docker Image

```bash
# Build + Push 到 Docker Hub
REGISTRY=your-dockerhub-user ./build-push.sh

# 僅 Build（不 push，載入本機 Docker）
./build-push.sh --build-only
```

腳本會自動產生 timestamp tag（例如 `20260401-083000`），跨平台編譯 Mac ARM → Linux amd64。

#### Step 2：設定域名

替換 `nginx/ct.conf` 中所有 `CT_DOMAIN` 為實際域名：

```bash
sed -i 's/CT_DOMAIN/ct.example.com/g' nginx/ct.conf
```

#### Step 3：首次 SSL 憑證申請

確認 DNS 已將域名指向 server IP，然後執行：

```bash
CERTBOT_EMAIL=you@example.com ./init-ssl.sh ct.example.com

# 測試用（Let's Encrypt staging CA，不會被瀏覽器信任）
CERTBOT_EMAIL=you@example.com ./init-ssl.sh ct.example.com --staging
```

腳本會自動啟動臨時 nginx → certbot 驗證 → 停掉臨時容器。憑證存放在 `certbot/` 目錄。

#### Step 4：啟動服務

```bash
IMAGE_TAG=<tag> docker compose -f docker-compose.prod.yml up -d
```

包含 4 個容器：`ct-app`（Go）、`ct-mongo`（MongoDB）、`ct-nginx`（反向代理）、`ct-certbot`（SSL 續約）。

#### Step 5：驗證

```bash
curl https://ct.example.com/chemistry-times/api/articles?page=1&limit=1
curl -I https://ct.example.com/chemistry-times
```

---

### Production 上線後調整

#### 修改文章標題或日期

```bash
curl -X PATCH http://your-server:17171/chemistry-times/api/articles/{article_id} \
  -H "Content-Type: application/json" \
  -d '{"title":"新標題","title_en":"New Title","date":"2026-04-01"}'
```

#### 刪除文章

```bash
curl -X DELETE http://your-server:17171/chemistry-times/api/articles/{article_id}
```

#### 查詢文章列表（找 article_id）

```bash
curl http://your-server:17171/chemistry-times/api/articles?page=1&limit=20
```

#### 重新上傳 HTML 檔案

```bash
curl -X POST http://your-server:17171/chemistry-times/api/upload \
  -F "file=@chemistry-times-20260401.html"
```

#### 更新 Docker 映像

```bash
# 1. 在開發機 build + push 新版
./build-push.sh

# 2. 在 production server 更新
export IMAGE_TAG=<新的 tag>
docker compose -f docker-compose.prod.yml pull
IMAGE_TAG=$IMAGE_TAG docker compose -f docker-compose.prod.yml up -d
```

---

### API 參考

所有端點在 `/chemistry-times/api` 和 `/chemistry-game-times/api` 下：

| Method | Endpoint | 說明 |
|--------|----------|------|
| `GET` | `/articles?page=1&limit=10` | 文章列表（由新到舊） |
| `POST` | `/articles` | 新增文章 |
| `GET` | `/articles/:id` | 取得單篇文章 |
| `PATCH` | `/articles/:id` | 更新文章（title, title_en, url, date） |
| `DELETE` | `/articles/:id` | 刪除文章 |
| `POST` | `/upload` | 上傳文章 HTML 檔案 |

**新增文章 Request Body：**

```json
{
  "title": "化學時報 2026-04-01",
  "title_en": "ChemistryTimes 2026-04-01",
  "url": "/chemistry-times/static/articles/chemistry-times-20260401.html",
  "date": "2026-04-01"
}
```

必填欄位：`title`、`url`、`date`。選填：`title_en`。

---

### 環境變數

| 變數 | 預設值 | 說明 |
|------|--------|------|
| `MONGO_URI` | `mongodb://localhost:27017` | MongoDB 連線字串 |
| `DB_NAME` | `chemistrytimes` | 資料庫名稱 |
| `PORT` | `17171` | 服務 port |
| `API_KEY` | `dev-api-key-change-me` | 異動端點認證（POST/PATCH/DELETE 需帶 `X-API-Key` header） |

---

### 專案結構

```
ChemistryTimes/
├── main.go                              # 入口：Gin router + MongoDB 初始化
├── internal/
│   ├── model/article.go                 # Article 資料結構
│   ├── repository/
│   │   ├── article.go                   # articles collection CRUD + 分頁
│   │   └── game_article.go             # game_articles collection
│   └── handler/
│       ├── article.go                   # /chemistry-times HTTP handlers
│       ├── game_article.go             # /chemistry-game-times HTTP handlers
│       └── upload.go                    # 檔案上傳 handler
├── web/
│   ├── templates/
│   │   ├── index.html                   # 主站閱讀器（深色模式、雙語切換）
│   │   └── game-index.html             # 遊戲版閱讀器
│   └── static/
│       ├── css/                         # 主站 + 遊戲版樣式
│       ├── js/                          # 主站 + 遊戲版邏輯
│       ├── articles/                    # 文章 HTML 檔案存放處
│       │   └── TEMPLATE.html           # 文章模板（NYT Huninn 報紙風格）
│       ├── hamster/                     # 寵物倉鼠 Flash 遊戲
│       └── fish/                        # 寵物魚 Flash 遊戲
├── claude_agents/                       # AI 日報產線（詳見上方說明）
│   ├── chemistry-times/                # 基礎版（雙語新聞，10 agent）
│   │   ├── CLAUDE.md                   # Agent 團隊主設定檔
│   │   ├── .claude/agents/            # Agent 角色定義（10 個 agent）
│   │   ├── .claude/rules/             # 共用規則（12 條）
│   │   ├── .claude/skills/            # 可調用技能（5 個）
│   │   └── workspace/                 # 來源清單 + 模板 + 主題帳本
│   └── chemistry-times-english-learning/  # 英語學習版（14 agent，含教育管線 + TTS）
│       ├── CLAUDE.md                   # 團隊設定（雙模式產出）
│       ├── .claude/agents/            # Agent 角色定義（14 個 agent）
│       ├── .claude/rules/             # 共用規則（14 條）
│       ├── .claude/skills/            # 可調用技能（9 個，含 TTS、英語學習組裝）
│       └── workspace/                 # 來源清單 + 模板 + TTS 音檔
├── scripts/
│   ├── publish-article.sh              # 一鍵上傳 + 註冊文章
│   └── migrate-articles.sh            # 批次更新文章資料
├── nginx/
│   ├── ct.conf                          # Nginx 設定（Production reverse proxy）
│   └── nginx-init.conf                 # 首次 SSL 用臨時 nginx config
├── Dockerfile                           # 多階段 build（Alpine）
├── docker-compose.yml                  # 本地開發（build from source）
├── docker-compose.prod.yml            # Production（含 Nginx + Certbot）
├── build-push.sh                       # Docker buildx 跨平台編譯 + push
├── init-ssl.sh                         # 首次 SSL 憑證申請
├── Makefile                            # 本地開發快捷指令
└── .env.example                        # 環境變數範例
```

---

### 功能特色

- **雙語切換** — 繁中/英文即時切換，無需重新載入
- **深色模式** — 搭配 View Transition API 的流暢主題切換
- **NYT 報紙風格** — Huninn 字體、極簡黑白排版
- **iframe 嵌入** — 文章獨立渲染，不受主站樣式影響
- **寵物小遊戲** — 側邊欄底部嵌入倉鼠/魚缸 Flash 遊戲
- **AI 全自動產線** — 兩套 agent 團隊：基礎版（10 agent）+ 英語學習版（14 agent，含教育管線 + TTS）
- **英語學習模式** — 原文段落 + 折疊翻譯 + 文法解析 + 單字表 + TTS 語音
- **雙頻道** — `/chemistry-times`（主站）+ `/chemistry-game-times`（遊戲版）

---

---

<a id="english"></a>

## English

### About

ChemistryTimes is an **internal daily newsletter system** that combines a web reader and AI-driven content generation in a single project.

**What does it do?**

- **Automated Publishing** — Every weekday morning, a Claude Code agent team gathers news from multiple sources, fact-checks, writes bilingual articles, builds HTML, and uploads to the server
- **Web Reader** — An NYT-inspired newspaper-style reader with dark mode, instant Traditional Chinese / English toggle, paginated sidebar, and articles rendered in isolated iframes
- **Dual Channels** — The main site `/chemistry-times` and the game edition `/chemistry-game-times` share the same backend but maintain separate content

**Why "ChemistryTimes"?** Named after an internal team codename — "chemical reactions" symbolize the new insights sparked when information collides.

**Who is it for?** Internal team daily information sync. No authentication required — just start and use.

### System Architecture

```
┌─────────────────────────────────────────────────────┐
│                  ChemistryTimes                      │
│                                                     │
│  ┌──────────────┐    ┌──────────────┐               │
│  │  Go + Gin     │    │  MongoDB 7   │               │
│  │  Web Server   │◄──►│  articles    │               │
│  │  port 17171   │    │  collection  │               │
│  └──────┬───────┘    └──────────────┘               │
│         │                                            │
│  ┌──────┴───────┐    ┌──────────────────────────┐   │
│  │  HTML/CSS/JS  │    │  Claude Code Agent Team   │   │
│  │  Web Reader   │    │  AI Pipeline (gather →    │   │
│  │  iframe embed │    │  write → HTML → upload)   │   │
│  └──────────────┘    └──────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Go 1.24 + Gin |
| Database | MongoDB 7 |
| Frontend | Vanilla HTML/CSS/JS (served via Go templates) |
| Content Generation | Claude Code agent team (multi-agent collaboration) |
| Deployment | Docker Compose |
| Reverse Proxy | Nginx + Let's Encrypt SSL auto-renewal |
| Cross-compilation | Docker buildx (Mac ARM → Linux amd64) |

---

### Quick Start

#### Prerequisites

- Docker & Docker Compose
- Go 1.24+ (only for Option 2)

#### Option 1: Docker Compose (Recommended, zero config)

```bash
docker compose up -d --build
open http://localhost:17171/chemistry-times
```

All defaults are built in — no `.env` file needed. To customize the API key:

```bash
cp .env.example .env   # edit API_KEY
docker compose up -d --build
```

Stop services:

```bash
docker compose down      # stop (keep data)
docker compose down -v   # stop and wipe database
```

#### Option 2: Local Go + MongoDB

```bash
make run
open http://localhost:17171/chemistry-times
```

`make run` automatically: creates `.env` (from `.env.example`) → starts MongoDB Docker container → loads env vars → runs Go server.

```bash
make mongo-clean   # remove MongoDB container + data
```

#### Option 3: Manual

```bash
cp .env.example .env
docker run -d -p 27017:27017 mongo:7
go run .
```

---

### Generating Articles (AI Pipeline)

Articles are produced automatically by a Claude Code agent team. The pipeline has 6 phases:

| Phase | Agent | Description |
|-------|-------|-------------|
| 1. Topic Setting | Editor-in-Chief | Set daily topics and priorities |
| 2. Newsgathering | Digital Journalist | Gather news from multiple sources |
| 3. Fact Verification | Data Auditor | Verify facts, tag source credibility |
| 4. Analysis + Writing | Analysts + CN/EN Writers | Parallel analysis, independent bilingual writing |
| 5. HTML Production | HTML Producer | Apply NYT Huninn newspaper-style template |
| 6. Review + Upload | Code Reviewer + Editor | Verify HTML → upload → register via API |

#### Running the Pipeline

Launch Claude Code in the `claude_agents/chemistry-times/` directory. The Editor-in-Chief agent orchestrates the full pipeline automatically.

See the [AI Agent Team](#ai-agent-team) section below for detailed architecture.

---

### Publishing Articles Manually

For manual article creation without the AI pipeline:

#### Step 1: Prepare the HTML Article

```bash
# Copy the template
cp web/static/articles/TEMPLATE.html \
   web/static/articles/chemistry-times-20260401.html

# Edit the article, fill in {{placeholders}}
```

Article sections in the template:

| Section | CSS class | Color | Content |
|---------|-----------|-------|---------|
| AI News | `ai` | indigo | AI updates, model releases |
| Tech Trends | `tech` | cyan | Software/hardware trends |
| Gaming Industry | `gaming` | rose | Gaming industry developments |
| Software Jobs | `jobs` | emerald | PM / engineering positions |
| Capital Flow | `capital` | amber | Funding, M&A |
| Briefs | (any above) | — | Short news items |

#### Step 2: Upload & Register

Use the publish script to upload + register in one step:

```bash
./scripts/publish-article.sh \
  web/static/articles/chemistry-times-20260401.html \
  "ChemistryTimes 2026-04-01" \
  2026-04-01
```

For a remote server:

```bash
./scripts/publish-article.sh \
  web/static/articles/chemistry-times-20260401.html \
  "ChemistryTimes 2026-04-01" \
  2026-04-01 \
  https://your-server.example.com
```

---

### AI Agent Team

The `claude_agents/chemistry-times/` directory is the core of the AI pipeline. It's a standalone Claude Code workspace containing agent definitions, rules, skills, and working data.

#### Directory Layout

```
claude_agents/chemistry-times/
├── CLAUDE.md                              # Team config file
│                                          # Defines content sections, workflow, API
│                                          # endpoints, writing standards, quality gates
│
├── .claude/
│   ├── agents/                            # Agent role definitions
│   │   ├── editor-in-chief.md             # Editor — orchestrates pipeline, final review
│   │   ├── analysis/
│   │   │   ├── tech-analyst.md            # Tech Analyst — AI, tech trends, GitHub
│   │   │   ├── online-english-education-analyst.md
│   │   │   │                              # Gaming Industry Analyst — platforms, market
│   │   │   └── marketing-analyst.md       # Market Analyst — funding, jobs, M&A
│   │   ├── journalism/
│   │   │   ├── digital-journalist.md      # Journalist — multi-source newsgathering
│   │   │   └── data-auditor.md            # Auditor — fact-checking, source tiering
│   │   ├── writing/
│   │   │   ├── chinese-daily-writer.md    # CN Writer — Taiwan style, colloquial tone
│   │   │   └── english-daily-writer.md    # EN Writer — AP style, native English
│   │   ├── production/
│   │   │   └── html-daily-producer.md     # HTML Producer — NYT Huninn layout
│   │   └── review/
│   │       ├── code-reviewer.md           # Code Review — HTML template compliance
│   │       └── process-reviewer.md        # Process Review — pipeline retrospective
│   │
│   ├── rules/                             # Shared rules (all agents must follow)
│   │   ├── source-registry.md             # Source list guide + beat source priorities
│   │   ├── content-farm-filter.md         # Content farm detection + source tiering
│   │   ├── temporal-awareness.md          # Freshness tags (breaking/recent/archival)
│   │   ├── topic-deduplication.md         # Topic dedup + cooldown mechanism
│   │   ├── source-attribution.md          # Source attribution format
│   │   ├── bilingual-output-standard.md   # Bilingual standards (parity, independence)
│   │   ├── chinese-style-guide.md         # Chinese style (Taiwan terms, banned words)
│   │   ├── english-style-guide.md         # English style (AP style, structure)
│   │   ├── html-template-standard.md      # HTML template spec (design tokens, elements)
│   │   ├── html-quality-standard.md       # HTML quality standard
│   │   ├── daily-deadline.md              # Daily deadline + escalation protocol
│   │   └── context-management.md          # Context management (summaries, file transfer)
│   │
│   └── skills/                            # Callable skills
│       ├── daily-production-pipeline/     # End-to-end pipeline specification
│       ├── fact-checking-framework/       # Fact-checking methodology
│       ├── github-trending-analysis/      # GitHub Trending analysis
│       ├── multi-platform-intelligence/   # Multi-platform newsgathering
│       └── post-uploader/                 # HTML file upload tool
│
└── workspace/                             # Working data (runtime storage)
    ├── source-monitoring-tech.md          # AI + Tech source list
    ├── source-monitoring-gaming.md        # Gaming industry source list
    ├── source-monitoring-jobs.md          # Software jobs source list
    ├── source-monitoring-capital.md       # Capital flow source list
    ├── topic-ledger.md                    # Topic ledger (published topic tracking)
    └── template/                          # HTML article templates
```

#### Agent Collaboration Flow

```
Editor-in-Chief
  │
  ├─► Digital Journalist ─► Data Auditor ─┐
  │                                        │
  │   ┌────────────────────────────────────┤
  │   │                                    │
  │   ├─► Tech Analyst ───────────────────┤
  │   ├─► Gaming Industry Analyst ────────┤  (parallel)
  │   ├─► Market Analyst ─────────────────┤
  │   │                                    │
  │   ├─► Chinese Writer ─────────────────┤  (parallel)
  │   ├─► English Writer ─────────────────┤
  │   │                                    │
  │   └─► HTML Producer ─► Code Reviewer ─► Final Review ─► Upload
  │
  └─► Process Reviewer (post-mortem)
```

#### Five Content Sections

| Section | Analyst | Source List |
|---------|---------|------------|
| AI News (AI 動態) | Tech Analyst | `source-monitoring-tech.md` |
| Tech Trends (技術發展) | Tech Analyst | `source-monitoring-tech.md` |
| Gaming (遊戲產業) | Gaming Industry Analyst | `source-monitoring-gaming.md` |
| Software Jobs (軟體職缺) | Market Analyst | `source-monitoring-jobs.md` |
| Capital Flow (資金動向) | Market Analyst | `source-monitoring-capital.md` |

#### Quality Gates

Three gates must pass before publication — any failure stops the pipeline:

1. **Fact-check gate** — Data Auditor verifies all facts and tags all sources
2. **Code review gate** — Code Reviewer confirms HTML meets template spec
3. **Final approval gate** — Editor-in-Chief approves before upload

#### Customizing the Agents

- **Change content sections** — Edit `CLAUDE.md` Content Sections table
- **Add/modify agents** — Add or edit `.md` files in `.claude/agents/`
- **Adjust news sources** — Edit `workspace/source-monitoring-*.md`
- **Change writing style** — Edit style guides in `.claude/rules/`
- **Adjust quality standards** — Edit the corresponding rule in `.claude/rules/`

---

### AI Agent Team: English Learning Edition

`claude_agents/chemistry-times-english-learning/` is the **English Learning enhanced edition** of the ChemistryTimes pipeline. It builds on the standard bilingual newsletter by adding structured English learning content for CEFR B1-B2 intermediate learners.

#### Differences from Standard Edition

| Feature | Standard (`chemistry-times`) | English Learning (`chemistry-times-english-learning`) |
|---------|------------------------------|------------------------------------------------------|
| Chinese version | Independent Taiwan-style news articles | Same |
| English version | Independent native English reports | Preserved original text with per-paragraph translation, grammar analysis, vocabulary table |
| TTS audio | None | OpenAI TTS audio per paragraph |
| Article toggle | CN / EN bilingual switch | Chinese / English Learning dual-mode switch |
| Content sections | AI, Tech, Gaming, Jobs, Capital | AI & Tech, Business & Industry, World News, Jobs |

#### English Learning Features

- **Original text preserved** — No rewriting or simplification; authentic English journalism
- **Collapsible translation** — Precise Chinese translation per paragraph (Taiwan Mandarin)
- **Collapsible grammar analysis** — 1-3 grammar structures per paragraph, contextual to the actual sentence
- **Vocabulary table** — 5-10 B1-B2 level words per article with part of speech, definition, and example context
- **TTS audio** — Pre-generated MP3 per paragraph via OpenAI TTS API, slightly slower pace for learners

#### Directory Layout

```
claude_agents/chemistry-times-english-learning/
├── CLAUDE.md                              # Team config (dual-mode output, 10-phase workflow)
├── .claude/
│   ├── agents/                            # 14 agent roles
│   │   ├── editor-in-chief.md             # Editor-in-Chief
│   │   ├── analysis/
│   │   │   ├── tech-analyst.md            # Tech Analyst
│   │   │   ├── business-analyst.md        # Business Analyst
│   │   │   └── world-news-analyst.md      # World News Analyst
│   │   ├── journalism/
│   │   │   ├── digital-journalist.md      # Digital Journalist
│   │   │   └── data-auditor.md            # Data Auditor
│   │   ├── writing/
│   │   │   ├── chinese-daily-writer.md    # CN Writer
│   │   │   └── english-content-curator.md # EN Content Curator (preserves, not writes)
│   │   ├── education/                     # Education pipeline (English Learning exclusive)
│   │   │   ├── professional-translator.md # Professional Translator
│   │   │   ├── grammar-analyst.md         # Grammar Analyst
│   │   │   └── education-expert.md        # Education Expert (quality gate)
│   │   ├── production/
│   │   │   └── html-daily-producer.md     # HTML Producer
│   │   └── review/
│   │       ├── code-reviewer.md           # Code Reviewer
│   │       └── process-reviewer.md        # Process Reviewer
│   │
│   ├── rules/                             # 14 shared rules
│   │   ├── dual-mode-output-standard.md   # Dual-mode output (Chinese + English Learning)
│   │   ├── english-learning-standard.md   # Learning content standards (CEFR B1-B2)
│   │   ├── english-curation-guide.md      # Curation guide (original text preservation)
│   │   ├── worklog.md                     # Worklog spec (traceable decision chain)
│   │   └── ...                            # Others same as standard edition
│   │
│   └── skills/                            # 9 callable skills
│       ├── boss/                          # Launch Editor-in-Chief (triggers full pipeline)
│       ├── tts-producer/                  # TTS audio generation (OpenAI API)
│       ├── english-learning-assembly/     # English learning content assembly
│       ├── post-uploader/                 # HTML + audio file upload
│       └── ...                            # Others same as standard edition
│
└── workspace/                             # Working data
    ├── source-monitoring-*.md             # Source lists (includes world news sources)
    ├── topic-ledger.md                    # Topic ledger
    ├── template/                          # HTML templates
    ├── tts/                               # TTS audio files
    ├── build-html.py                      # HTML build script
    ├── generate-tts-fish.mjs              # TTS generation script (Fish Audio)
    └── tts-config.yaml                    # TTS configuration
```

#### Agent Collaboration Flow (10 Phases)

```
Editor-in-Chief
  │
  ├─► 1. Topic Setting
  ├─► 2. Digital Journalist (newsgathering)
  ├─► 3. Data Auditor (fact verification)
  │
  ├─► 4. Analysts ×3 (parallel)
  │      ├─ Tech Analyst
  │      ├─ Business Analyst
  │      └─ World News Analyst
  │
  ├─► 5. Content Production (parallel)
  │      ├─ CN Writer ──────────────────────────────────┐
  │      └─ EN Content Curator ──┐                      │
  │                               │                      │
  ├─► 6. Education Pipeline (streaming: triggered per article)
  │      ├─ Translator + Grammar Analyst (parallel)     │
  │      └─ TTS audio generation                        │
  │                                                      │
  ├─► 7. Education Expert (quality gate)                │
  ├─► 8. HTML Producer (assemble dual-mode page) ◄─────┘
  ├─► 9. Code Reviewer
  └─► 10. Editor-in-Chief final review → Upload
```

#### Four Quality Gates

1. **Fact-check gate** — Data Auditor verifies all sources
2. **Education quality gate** — Education Expert reviews translation accuracy, grammar level calibration, vocabulary difficulty
3. **Code review gate** — HTML template compliance check
4. **Final approval gate** — Editor-in-Chief authorizes upload

---

### Operating Claude Agent Teams

Each subdirectory under `claude_agents/` is a standalone Claude Code workspace. Here's how to use them:

#### Launching a Pipeline

```bash
# Option 1: English Learning edition
cd claude_agents/chemistry-times-english-learning
claude

# Inside Claude Code, trigger the full pipeline:
/boss
```

```bash
# Option 2: Standard edition
cd claude_agents/chemistry-times
claude
/boss
```

#### How It Works

Each team's `CLAUDE.md` defines the team configuration, and `.md` files under `.claude/agents/` define each agent's role. Once launched:

1. **Editor-in-Chief** is the sole coordinator — dispatches all tasks
2. All agents run in **subagent mode** — Editor-in-Chief delegates via the Task tool, agents report back
3. Agents **never** communicate directly with each other — everything routes through the Editor-in-Chief
4. Each phase has explicit **quality gates** — any failure stops the pipeline

#### Customizing Team Behavior

| What to change | Which file to edit |
|---------------|--------------------|
| Content sections / workflow | `CLAUDE.md` |
| Add / modify agent roles | `.claude/agents/*.md` |
| Modify shared rules | `.claude/rules/*.md` |
| Adjust news sources | `workspace/source-monitoring-*.md` |
| Add new skills | Create directory + `SKILL.md` under `.claude/skills/` |

#### Team Overview

```
claude_agents/
├── chemistry-times/                    # Standard edition (bilingual news)
│   ├── 10 agents, 12 rules, 5 skills
│   └── 6-phase pipeline: topics → gather → verify → analyze+write → HTML → upload
│
└── chemistry-times-english-learning/   # English Learning edition (dual-mode: CN + English Learning)
    ├── 14 agents, 14 rules, 9 skills
    └── 10-phase pipeline: topics → gather → verify → analyze → write → education → QA → HTML → review → upload
```

---

### Deploying to Production

Production includes Go app + MongoDB + Nginx reverse proxy + Certbot SSL auto-renewal, all managed by `docker-compose.prod.yml`.

```
Internet :80/:443
    ↓
ct-nginx (Nginx reverse proxy)
    └─ ct-app:17171 (Go + Gin)
         └─ ct-mongo:27017 (MongoDB, internal network only)

ct-certbot → auto-renews SSL certs (every 12h)
ct-nginx reloads every 6h → picks up renewed certificates
```

#### Step 1: Build & Push Docker Image

```bash
# Build + push to Docker Hub
REGISTRY=your-dockerhub-user ./build-push.sh

# Build only (load to local Docker, no push)
./build-push.sh --build-only
```

Generates a timestamp tag automatically (e.g., `20260401-083000`). Cross-compiles Mac ARM → Linux amd64.

#### Step 2: Configure Domain

Replace all `CT_DOMAIN` in `nginx/ct.conf` with your actual domain:

```bash
sed -i 's/CT_DOMAIN/ct.example.com/g' nginx/ct.conf
```

#### Step 3: First-Time SSL Certificate

Ensure DNS points the domain to the server IP, then run:

```bash
CERTBOT_EMAIL=you@example.com ./init-ssl.sh ct.example.com

# Test mode (Let's Encrypt staging CA, not browser-trusted)
CERTBOT_EMAIL=you@example.com ./init-ssl.sh ct.example.com --staging
```

The script starts a temporary nginx → certbot validates → stops the temp container. Certificates are stored in `certbot/`.

#### Step 4: Start Services

```bash
IMAGE_TAG=<tag> docker compose -f docker-compose.prod.yml up -d
```

Starts 4 containers: `ct-app` (Go), `ct-mongo` (MongoDB), `ct-nginx` (reverse proxy), `ct-certbot` (SSL renewal).

#### Step 5: Verify

```bash
curl https://ct.example.com/chemistry-times/api/articles?page=1&limit=1
curl -I https://ct.example.com/chemistry-times
```

---

### Post-Deployment Operations

#### Update Article Title or Date

```bash
curl -X PATCH http://your-server:17171/chemistry-times/api/articles/{article_id} \
  -H "Content-Type: application/json" \
  -d '{"title":"New Title","title_en":"New English Title","date":"2026-04-01"}'
```

#### Delete an Article

```bash
curl -X DELETE http://your-server:17171/chemistry-times/api/articles/{article_id}
```

#### List Articles (Find article_id)

```bash
curl http://your-server:17171/chemistry-times/api/articles?page=1&limit=20
```

#### Re-upload an HTML File

```bash
curl -X POST http://your-server:17171/chemistry-times/api/upload \
  -F "file=@chemistry-times-20260401.html"
```

#### Update Docker Image

```bash
# 1. Build + push new version from dev machine
./build-push.sh

# 2. Update on production server
export IMAGE_TAG=<new-tag>
docker compose -f docker-compose.prod.yml pull
IMAGE_TAG=$IMAGE_TAG docker compose -f docker-compose.prod.yml up -d
```

---

### API Reference

All endpoints are under `/chemistry-times/api` and `/chemistry-game-times/api`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/articles?page=1&limit=10` | List articles (newest first) |
| `POST` | `/articles` | Create article |
| `GET` | `/articles/:id` | Get article by ID |
| `PATCH` | `/articles/:id` | Update article (title, title_en, url, date) |
| `DELETE` | `/articles/:id` | Delete article |
| `POST` | `/upload` | Upload article HTML file |

**Create Article Request Body:**

```json
{
  "title": "ChemistryTimes 2026-04-01",
  "title_en": "ChemistryTimes 2026-04-01",
  "url": "/chemistry-times/static/articles/chemistry-times-20260401.html",
  "date": "2026-04-01"
}
```

Required fields: `title`, `url`, `date`. Optional: `title_en`.

---

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGO_URI` | `mongodb://localhost:27017` | MongoDB connection string |
| `DB_NAME` | `chemistrytimes` | Database name |
| `PORT` | `17171` | Server port |
| `API_KEY` | `dev-api-key-change-me` | Auth for mutation endpoints (POST/PATCH/DELETE require `X-API-Key` header) |

---

### Project Structure

```
ChemistryTimes/
├── main.go                              # Entry: Gin router + MongoDB init
├── internal/
│   ├── model/article.go                 # Article data struct
│   ├── repository/
│   │   ├── article.go                   # articles collection CRUD + pagination
│   │   └── game_article.go             # game_articles collection
│   └── handler/
│       ├── article.go                   # /chemistry-times HTTP handlers
│       ├── game_article.go             # /chemistry-game-times HTTP handlers
│       └── upload.go                    # File upload handler
├── web/
│   ├── templates/                       # Go HTML templates (readers)
│   └── static/                          # CSS, JS, article files, mini-games
├── claude_agents/                       # AI pipeline (see AI Agent Teams above)
│   ├── chemistry-times/                # Standard edition (bilingual news, 10 agents)
│   │   ├── CLAUDE.md                   # Agent team config
│   │   ├── .claude/agents/            # 10 agent role definitions
│   │   ├── .claude/rules/             # 12 shared rules
│   │   ├── .claude/skills/            # 5 callable skills
│   │   └── workspace/                 # Source lists + templates + topic ledger
│   └── chemistry-times-english-learning/  # English Learning edition (14 agents, education pipeline + TTS)
│       ├── CLAUDE.md                   # Team config (dual-mode output)
│       ├── .claude/agents/            # 14 agent role definitions
│       ├── .claude/rules/             # 14 shared rules
│       ├── .claude/skills/            # 9 callable skills (incl. TTS, learning assembly)
│       └── workspace/                 # Source lists + templates + TTS audio
├── scripts/
│   ├── publish-article.sh              # One-step upload + register
│   └── migrate-articles.sh            # Batch update article data
├── nginx/
│   ├── ct.conf                          # Nginx config (production reverse proxy)
│   └── nginx-init.conf                 # Temporary nginx for first-time SSL setup
├── Dockerfile                           # Multi-stage build (Alpine)
├── docker-compose.yml                  # Local dev (build from source)
├── docker-compose.prod.yml            # Production (with Nginx + Certbot)
├── build-push.sh                       # Docker buildx cross-compile + push
├── init-ssl.sh                         # First-time SSL certificate setup
├── Makefile                            # Local dev shortcuts
└── .env.example                        # Environment variable template
```

---

### Features

- **Bilingual Toggle** — Switch between Traditional Chinese and English instantly, no reload
- **Dark Mode** — Smooth theme transition powered by View Transition API
- **NYT Newspaper Style** — Huninn font, minimal monochrome layout
- **iframe Embedding** — Articles render independently, isolated from the main site styles
- **Pet Mini-Games** — Hamster wheel and fish tank Flash games in the sidebar
- **AI Pipeline** — Two agent teams: standard (10 agents) + English Learning edition (14 agents with education pipeline + TTS)
- **English Learning Mode** — Original text paragraphs + collapsible translation + grammar analysis + vocabulary table + TTS audio
- **Dual Channels** — `/chemistry-times` (main) + `/chemistry-game-times` (game edition)
