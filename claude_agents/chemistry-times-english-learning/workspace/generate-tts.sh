#!/bin/bash
# Generate TTS audio files from education content JSON
# Usage: OPENAI_API_KEY=sk-xxx ./generate-tts.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
JSON_FILE="$SCRIPT_DIR/education-content-2026-03-31.json"
TTS_DIR="$SCRIPT_DIR/tts"
CONFIG_FILE="$SCRIPT_DIR/tts-config.yaml"

# Read config
MODEL=$(grep 'model:' "$CONFIG_FILE" | head -1 | awk '{print $2}')
VOICE=$(grep 'voice:' "$CONFIG_FILE" | head -1 | awk '{print $2}')
SPEED=$(grep 'speed:' "$CONFIG_FILE" | head -1 | awk '{print $2}')

echo "TTS Config: model=$MODEL voice=$VOICE speed=$SPEED"
echo "Output dir: $TTS_DIR"

if [ -z "${OPENAI_API_KEY:-}" ]; then
    echo "ERROR: OPENAI_API_KEY not set"
    exit 1
fi

mkdir -p "$TTS_DIR"

# Extract paragraphs: article_id|P_number|text
TOTAL=$(jq -r '.articles[] | .article_id as $id | .paragraphs | to_entries[] | "\($id)|\(.key)"' "$JSON_FILE" | wc -l | tr -d ' ')
COUNT=0
FAILED=0

jq -r '.articles[] | .article_id as $id | .paragraphs | to_entries[] | @json "\({id: $id, key: .key, text: .value.original})"' "$JSON_FILE" | while IFS= read -r line; do
    ARTICLE_ID=$(echo "$line" | jq -r '.id')
    PKEY=$(echo "$line" | jq -r '.key')
    TEXT=$(echo "$line" | jq -r '.text')
    PNUM=$(echo "$PKEY" | sed 's/P//')

    OUTFILE="$TTS_DIR/tts-${ARTICLE_ID}-p${PNUM}.mp3"
    COUNT=$((COUNT + 1))

    echo "[$COUNT/$TOTAL] Generating: tts-${ARTICLE_ID}-p${PNUM}.mp3"

    # Build JSON payload
    PAYLOAD=$(jq -n \
        --arg model "$MODEL" \
        --arg input "$TEXT" \
        --arg voice "$VOICE" \
        --argjson speed "$SPEED" \
        '{model: $model, input: $input, voice: $voice, speed: $speed, response_format: "mp3"}')

    HTTP_CODE=$(curl -s -w "%{http_code}" -o "$OUTFILE" \
        https://api.openai.com/v1/audio/speech \
        -H "Authorization: Bearer ${OPENAI_API_KEY}" \
        -H "Content-Type: application/json" \
        -d "$PAYLOAD")

    if [ "$HTTP_CODE" != "200" ]; then
        echo "  FAILED (HTTP $HTTP_CODE)"
        cat "$OUTFILE"
        echo ""
        FAILED=$((FAILED + 1))
    else
        FSIZE=$(wc -c < "$OUTFILE" | tr -d ' ')
        echo "  OK (${FSIZE} bytes)"
    fi
done

echo ""
echo "TTS generation complete. Failed: $FAILED"
