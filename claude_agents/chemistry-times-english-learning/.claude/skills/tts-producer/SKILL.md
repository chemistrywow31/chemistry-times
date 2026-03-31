---
name: TTS Producer
description: Generate paragraph-level TTS audio files via OpenAI API with extensible provider configuration
---

# TTS Producer

## Description

This skill generates text-to-speech audio files for each paragraph of the English Learning mode content using the OpenAI TTS API. Audio files are uploaded as static assets to the ChemistryTimes server.

## Users

- HTML Daily Producer: primary user for generating and uploading TTS audio during production

## Core Knowledge

### Configuration

TTS settings are stored in `workspace/tts-config.yaml`:

```yaml
tts:
  provider: openai
  providers:
    openai:
      model: tts-1
      voice: alloy
      format: mp3
      speed: 0.9
    # Future providers:
    # azure:
    #   endpoint: https://...
    #   voice: en-US-JennyNeural
    # elevenlabs:
    #   voice_id: ...
```

Read the config file at the start of every TTS task. Use the active provider's settings.

### OpenAI TTS API Call

```bash
curl -s https://api.openai.com/v1/audio/speech \
  -H "Authorization: Bearer ${OPENAI_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "tts-1",
    "input": "{paragraph text}",
    "voice": "alloy",
    "speed": 0.9,
    "response_format": "mp3"
  }' \
  --output "tts-{article-id}-p{N}.mp3"
```

### File Naming Convention

```
tts-{article-id}-p{paragraph-number}.mp3
```

Example: `tts-article-3-p2.mp3` = Article 3, Paragraph 2

### Workflow

1. Read `workspace/tts-config.yaml` for provider settings
2. For each paragraph in the curated English content:
   a. Call the TTS API with the paragraph text
   b. Save the audio file with the correct naming convention
   c. Upload the audio file via `post-uploader` skill
3. Return the list of audio file paths to Editor-in-Chief

### Error Handling

- If a single paragraph's TTS fails (API error, timeout): retry once. If retry fails, skip that paragraph and log: `TTS_FAILED: {article-id} P{N}. Error: {message}`
- If the entire API is unreachable: report BLOCKED to Editor-in-Chief
- If the config file is missing: report NEEDS_CONTEXT with the expected config path

### Text Preprocessing

Before sending text to the TTS API:
- Remove HTML tags if any are present
- Remove source attribution lines
- Keep punctuation intact (it affects speech pacing)
- Do not modify the English text content

## Application Guide

### Scenario A: Normal TTS Generation
5 articles, 30 paragraphs total. Generate 30 MP3 files, upload all, return file path list. Expected time: 5-10 minutes.

### Scenario B: Partial Failure
API times out for 3 paragraphs. Retry each once. 1 succeeds on retry, 2 remain failed. Report: `DONE_WITH_CONCERNS: 28/30 TTS files generated. Failed: article-2 P4, article-5 P1.`

### Scenario C: Config Missing
`workspace/tts-config.yaml` does not exist. Report: `NEEDS_CONTEXT: TTS config file not found at workspace/tts-config.yaml. Create the config file with provider settings before proceeding.`

## Quality Checkpoints

- [ ] Config file read at task start (not using hardcoded values)
- [ ] Each audio file named correctly (`tts-{id}-p{N}.mp3`)
- [ ] All audio files uploaded via post-uploader
- [ ] Failed generations logged with specific error messages
- [ ] Audio file paths returned in structured format
