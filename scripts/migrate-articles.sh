#!/bin/bash
# Migration script: add date + title_en to existing production articles
# Run AFTER deploying the new API with PATCH support
#
# Usage: ./scripts/migrate-articles.sh [BASE_URL]
# Default: http://localhost:17171

BASE="${1:-http://localhost:17171}"
API="$BASE/chemistry-times/api/articles"

echo "Migrating articles at $API"
echo "---"

# 0323 — Anthropic 告上法院、Apple 封殺 Vibe Coding、Duolingo 擴科
echo "Updating 0323..."
curl -s -X PATCH "$API/69c094168ab81261c29eed43" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-03-23",
    "title_en": "Anthropic Sued, Apple Bans Vibe Coding, Duolingo Expands"
  }' | python3 -m json.tool
echo ""

# 0320 — OpenAI 買下 Python 工具鏈 Astral、DeepMind 發布 AGI 認知框架
echo "Updating 0320..."
curl -s -X PATCH "$API/69bca5c90d52dce9eaed1b62" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-03-20",
    "title_en": "OpenAI Acquires Python Toolchain Astral, DeepMind Publishes AGI Cognition Framework"
  }' | python3 -m json.tool
echo ""

# 0319 — Duolingo AI 豪賭反噬、清華開源 AI 教室震撼登場
echo "Updating 0319..."
curl -s -X PATCH "$API/69bb62cb8592b9a5404c91f0" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-03-19",
    "title_en": "Duolingo AI Gamble Backfires, Tsinghua Open-Source AI Classroom Debuts"
  }' | python3 -m json.tool
echo ""

# 0318 — AI 模型三巨頭開戰、51Talk 品牌大改造
echo "Updating 0318..."
curl -s -X PATCH "$API/69bb62c78592b9a5404c91ef" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-03-18",
    "title_en": "AI Model Giants Go to War, 51Talk Brand Overhaul"
  }' | python3 -m json.tool
echo ""

echo "--- Migration complete ---"
echo ""
echo "Verify:"
curl -s "$API?page=1&limit=10" | python3 -m json.tool
