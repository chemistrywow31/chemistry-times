#!/bin/bash
# Publish an article: upload file + register in MongoDB
#
# Usage: ./scripts/publish-article.sh <file> <title> <date> [BASE_URL]
#   file     — path to the HTML article file
#   title    — article title (e.g. "化學時報 2026-03-25")
#   date     — publish date in YYYY-MM-DD format
#   BASE_URL — optional, default http://localhost:17171
#
# Environment:
#   API_KEY  — required, the server API key for mutation endpoints
#
# Example:
#   API_KEY=your-key ./scripts/publish-article.sh web/static/articles/2026/03/chemistry-times-20260325.html "化學時報 2026-03-25" 2026-03-25

set -euo pipefail

FILE="${1:?Usage: $0 <file> <title> <date> [BASE_URL]}"
TITLE="${2:?Usage: $0 <file> <title> <date> [BASE_URL]}"
DATE="${3:?Usage: $0 <file> <title> <date> [BASE_URL]}"
BASE="${4:-http://localhost:17171}"
API="$BASE/chemistry-times/api"

if [ -z "${API_KEY:-}" ]; then
  echo "Error: API_KEY environment variable is required" >&2
  exit 1
fi

if [ ! -f "$FILE" ]; then
  echo "Error: file not found: $FILE" >&2
  exit 1
fi

# Step 1: Upload file
echo "Uploading $FILE ..."
UPLOAD_RESP=$(curl -s -X POST "$API/upload" -H "X-API-Key: $API_KEY" -F "file=@$FILE")

URL=$(echo "$UPLOAD_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['url'])" 2>/dev/null)
if [ -z "$URL" ]; then
  echo "Error: upload failed: $UPLOAD_RESP" >&2
  exit 1
fi
echo "Uploaded: $URL"

# Step 2: Register article
echo "Registering article ..."
CREATE_RESP=$(curl -s -X POST "$API/articles" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d "{\"title\":\"$TITLE\",\"url\":\"$URL\",\"date\":\"$DATE\"}")

ID=$(echo "$CREATE_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null)
if [ -z "$ID" ]; then
  echo "Error: registration failed: $CREATE_RESP" >&2
  exit 1
fi

echo "Done! id=$ID"
