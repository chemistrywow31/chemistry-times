# ChemistryTimes 化學時報

內部電子報系統。Go + MongoDB，文章以 iframe 嵌入瀏覽。

## Commands

```bash
# Local dev (Docker Compose)
docker compose up -d --build
docker compose down

# Run directly (requires local MongoDB)
go run .

# Build
go build -o chemistrytimes .
```

## Architecture

```
main.go                        # Gin router + MongoDB init
internal/
  model/article.go             # Article struct (title, url, created_at)
  repository/article.go        # articles collection CRUD + pagination
  repository/game_article.go   # game_articles collection (same logic)
  handler/article.go           # HTTP handlers for /chemistry-times
  handler/game_article.go      # HTTP handlers for /chemistry-game-times
  handler/upload.go            # File upload handler
web/
  templates/                   # Go HTML templates
  static/                      # CSS + JS
    articles/                  # Uploaded article HTML files (nested by YYYY/MM/)
      TEMPLATE.html            # Base template for new articles
      2026/03/                  # Example: March 2026 articles
```

Two channels share the same Article model but use separate collections:
- `/chemistry-times` → `articles`
- `/chemistry-game-times` → `game_articles`

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGO_URI` | `mongodb://localhost:27017` | MongoDB connection string |
| `DB_NAME` | `chemistrytimes` | Database name |
| `PORT` | `17171` | Server port |
| `API_KEY` | *(required)* | API key for mutation endpoints (POST/PATCH/DELETE) |

## API

All endpoints are under `/chemistry-times/api` and `/chemistry-game-times/api`:
- `GET /articles?page=1&limit=10` — List (newest first)
- `POST /articles` — Create (`{"title":"...","url":"...","date":"YYYY-MM-DD"}`) — requires `X-API-Key` header
- `GET /articles/:id` — Get by ID
- `PATCH /articles/:id` — Update — requires `X-API-Key` header
- `DELETE /articles/:id` — Delete — requires `X-API-Key` header
- `POST /upload` — Upload article HTML file (multipart form, field: `file`) — requires `X-API-Key` header

## Upload

Use the publish script to upload and register an article in one step:

```bash
API_KEY=your-key ./scripts/publish-article.sh <file> <title> <date> [BASE_URL]

# Example
API_KEY=your-key ./scripts/publish-article.sh web/static/articles/2026/03/chemistry-times-20260325.html "化學時報 2026-03-25" 2026-03-25
```

The script handles upload + MongoDB registration automatically. Do not call the APIs manually.

## Article Template

New articles use `web/static/articles/TEMPLATE.html` as the base. Copy and fill in `{{placeholders}}`.

Sections (in order):

| Section | CSS class | Color | Content |
|---------|-----------|-------|---------|
| AI 動態 | `ai` | indigo | AI 新資訊、模型發布、AI 產業動態 |
| 技術發展 | `tech` | cyan | 軟硬體技術趨勢、開源專案、開發工具 |
| 遊戲產業 | `gaming` | rose | 遊戲產業發展、平台動態、市場趨勢 |
| 軟體職缺 | `jobs` | emerald | 軟體業 PM / 技術缺、就業市場變化 |
| 資金動向 | `capital` | amber | 融資、併購、全球資金流向 |
| 快訊 | (any above) | — | 各類短訊，tag 用對應分類的 class |

Each section supports Deep Dive (full `article-card`) and Brief (`brief-card`) formats.

## Gotchas

- `docker-compose.yml` port must match `PORT` env var (default 17171)
- Mutation APIs (POST/PATCH/DELETE) require `X-API-Key` header; GET endpoints are public
- Frontend is vanilla JS served by Go templates, not a separate build step
- Article URLs use relative paths with year/month nesting (e.g., `/chemistry-times/static/articles/2026/03/chemistry-times-20260319.html`)
