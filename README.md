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
| 反向代理 | Nginx（與 cddn 共用） + Let's Encrypt SSL 自動續約 |
| 跨平台編譯 | Docker buildx（Mac ARM → Linux amd64） |

---

### 快速開始

#### 前置條件

- Docker & Docker Compose
- Go 1.24+（僅直接執行時需要）
- Python 3（publish 腳本使用）

#### 方式一：Docker Compose（推薦）

```bash
# 1. 複製環境變數
cp .env.example .env

# 2. 啟動服務（Go app + MongoDB）
docker compose up -d --build

# 3. 開啟瀏覽器
open http://localhost:17171/chemistry-times
```

停止服務：

```bash
# 停止（保留資料）
docker compose down

# 停止並清除資料庫
docker compose down -v
```

#### 方式二：本地直接執行

```bash
# 1. 啟動 MongoDB（Docker 容器）
make mongo

# 2. 執行 Go server
make run

# 3. 開啟瀏覽器
open http://localhost:17171/chemistry-times
```

清除本地 MongoDB：

```bash
make mongo-clean
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

### 部署到 Production

CT 與 [cddn](https://github.com/user/cddn) 共用同一台 nginx reverse proxy 和 certbot SSL 自動續約。架構如下：

```
Internet :80/:443
    ↓
cddn-nginx（共用）
    ├─ meet-chess.com     → cddn frontend/backend
    └─ CT_DOMAIN          → ct-app:17171（透過 cddn-network）

cddn-certbot（共用） → 自動續約所有域名 SSL（每 12 小時檢查）
nginx 每 6 小時 reload → 載入新憑證
```

#### Step 1：Build & Push Docker Image

```bash
# Build + Push 到 Docker Hub (wow31/chemistry-times)
./build-push.sh

# 僅 Build（不 push，載入本機 Docker）
./build-push.sh --build-only
```

腳本會自動產生 timestamp tag（例如 `20260401-083000`），跨平台編譯 Mac ARM → Linux amd64。

#### Step 2：首次 SSL 憑證申請

確認 DNS 已將 CT 域名指向 server IP，然後執行：

```bash
# 申請 SSL 憑證（複用 cddn 的 certbot 目錄）
./init-ssl.sh ct.example.com

# 測試用（Let's Encrypt staging CA，不會被瀏覽器信任）
./init-ssl.sh ct.example.com --staging
```

腳本會自動偵測 cddn-nginx 是否在執行：
- **cddn-nginx 已在跑** → 注入臨時 ACME config → certbot 驗證 → 移除臨時 config
- **cddn-nginx 沒在跑** → 啟動臨時 nginx (port 80) → certbot 驗證 → 停掉

可透過環境變數調整：
- `CDDN_DIR` — cddn 專案路徑（預設 `/Users/wow/wrk/side_proj/cddn`）
- `CERTBOT_EMAIL` — Let's Encrypt 通知信箱（預設 `admin@meet-chess.com`）

#### Step 3：合併 Nginx 設定

將 `nginx/ct.conf` 的內容合併進 cddn 的 `nginx/nginx.conf`：

1. 把 `upstream ct-app` 加到檔案頂部
2. 把 HTTP redirect + HTTPS server block 加到檔案底部
3. 全域替換 `CT_DOMAIN` 為實際域名

```bash
# 替換後 reload nginx
docker exec cddn-nginx nginx -s reload
```

#### Step 4：啟動 CT

```bash
IMAGE_TAG=<tag> docker compose -f docker-compose.prod.yml up -d
```

CT 的 `ct-app` 容器會加入 `cddn-network`，讓 cddn-nginx 可以透過 `ct-app:17171` 轉發請求。MongoDB 則在獨立的 `ct-network` 內，不對外曝露。

#### Step 5：驗證

```bash
# 確認服務啟動
curl https://ct.example.com/chemistry-times/api/articles?page=1&limit=1

# 確認頁面可存取
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
│   └── chemistry-times/
│       ├── CLAUDE.md                    # Agent 團隊主設定檔
│       ├── .claude/agents/             # Agent 角色定義（10 個 agent）
│       ├── .claude/rules/              # 共用規則（12 條）
│       ├── .claude/skills/             # 可調用技能（5 個）
│       └── workspace/                  # 來源清單 + 模板 + 主題帳本
├── scripts/
│   ├── publish-article.sh              # 一鍵上傳 + 註冊文章
│   └── migrate-articles.sh            # 批次更新文章資料
├── nginx/
│   ├── ct.conf                          # Nginx 設定片段（合併進 cddn nginx）
│   └── nginx-init.conf                 # 首次 SSL 用臨時 nginx config
├── Dockerfile                           # 多階段 build（Alpine）
├── docker-compose.yml                  # 本地開發（build from source）
├── docker-compose.prod.yml            # Production（加入 cddn-network）
├── build-push.sh                       # Docker buildx 跨平台編譯 + push
├── init-ssl.sh                         # 首次 SSL 憑證申請（複用 cddn certbot）
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
- **AI 全自動產線** — 10 個 agent 協作：採集→查核→分析→撰稿→排版→上傳
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
| Reverse Proxy | Nginx (shared with cddn) + Let's Encrypt SSL auto-renewal |
| Cross-compilation | Docker buildx (Mac ARM → Linux amd64) |

---

### Quick Start

#### Prerequisites

- Docker & Docker Compose
- Go 1.24+ (only for running without Docker)
- Python 3 (used by publish script)

#### Option 1: Docker Compose (Recommended)

```bash
# 1. Copy environment config
cp .env.example .env

# 2. Start services (Go app + MongoDB)
docker compose up -d --build

# 3. Open browser
open http://localhost:17171/chemistry-times
```

Stop services:

```bash
# Stop (keep data)
docker compose down

# Stop and wipe database
docker compose down -v
```

#### Option 2: Run Locally

```bash
# 1. Start MongoDB (Docker container)
make mongo

# 2. Run Go server
make run

# 3. Open browser
open http://localhost:17171/chemistry-times
```

Clean up local MongoDB:

```bash
make mongo-clean
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

### Deploying to Production

CT shares an nginx reverse proxy and certbot SSL auto-renewal with the [cddn](https://github.com/user/cddn) project on the same server:

```
Internet :80/:443
    ↓
cddn-nginx (shared)
    ├─ meet-chess.com     → cddn frontend/backend
    └─ CT_DOMAIN          → ct-app:17171 (via cddn-network)

cddn-certbot (shared) → auto-renews all domain SSL certs (every 12h)
nginx reloads every 6h → picks up renewed certificates
```

#### Step 1: Build & Push Docker Image

```bash
# Build + push to Docker Hub (wow31/chemistry-times)
./build-push.sh

# Build only (load to local Docker, no push)
./build-push.sh --build-only
```

Generates a timestamp tag automatically (e.g., `20260401-083000`). Cross-compiles Mac ARM → Linux amd64.

#### Step 2: First-Time SSL Certificate

Ensure DNS points the CT domain to the server IP, then run:

```bash
# Request SSL certificate (reuses cddn's certbot directory)
./init-ssl.sh ct.example.com

# Test mode (Let's Encrypt staging CA, not browser-trusted)
./init-ssl.sh ct.example.com --staging
```

The script auto-detects whether cddn-nginx is running:
- **cddn-nginx running** → injects temporary ACME config → certbot validates → removes temp config
- **cddn-nginx not running** → starts temporary nginx (port 80) → certbot validates → stops temp nginx

Configurable via environment variables:
- `CDDN_DIR` — path to the cddn project (default: `/Users/wow/wrk/side_proj/cddn`)
- `CERTBOT_EMAIL` — Let's Encrypt notification email (default: `admin@meet-chess.com`)

#### Step 3: Merge Nginx Config

Merge the contents of `nginx/ct.conf` into cddn's `nginx/nginx.conf`:

1. Add the `upstream ct-app` block at the top
2. Add the HTTP redirect + HTTPS server blocks at the bottom
3. Replace all `CT_DOMAIN` with the actual domain

```bash
# Reload nginx after merging
docker exec cddn-nginx nginx -s reload
```

#### Step 4: Start CT

```bash
IMAGE_TAG=<tag> docker compose -f docker-compose.prod.yml up -d
```

The `ct-app` container joins `cddn-network`, allowing cddn-nginx to proxy requests to `ct-app:17171`. MongoDB stays in the isolated `ct-network`, not exposed externally.

#### Step 5: Verify

```bash
# Check service is up
curl https://ct.example.com/chemistry-times/api/articles?page=1&limit=1

# Check page is accessible
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
├── claude_agents/                       # AI pipeline (see AI Agent Team above)
│   └── chemistry-times/
│       ├── CLAUDE.md                    # Agent team config
│       ├── .claude/agents/             # 10 agent role definitions
│       ├── .claude/rules/              # 12 shared rules
│       ├── .claude/skills/             # 5 callable skills
│       └── workspace/                  # Source lists + templates + topic ledger
├── scripts/
│   ├── publish-article.sh              # One-step upload + register
│   └── migrate-articles.sh            # Batch update article data
├── nginx/
│   ├── ct.conf                          # Nginx config snippet (merge into cddn nginx)
│   └── nginx-init.conf                 # Temporary nginx for first-time SSL setup
├── Dockerfile                           # Multi-stage build (Alpine)
├── docker-compose.yml                  # Local dev (build from source)
├── docker-compose.prod.yml            # Production (joins cddn-network)
├── build-push.sh                       # Docker buildx cross-compile + push
├── init-ssl.sh                         # First-time SSL cert (reuses cddn certbot)
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
- **AI Pipeline** — 10 agents collaborate: gather → verify → analyze → write → layout → upload
- **Dual Channels** — `/chemistry-times` (main) + `/chemistry-game-times` (game edition)
