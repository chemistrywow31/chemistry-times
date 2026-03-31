---
name: Post Uploader
description: Upload HTML, audio, and asset files to ChemistryTimes server via multipart POST
---

# Post Uploader

Upload files to the ChemistryTimes server (`/chemistry-times/api/upload`) and return public URLs. Supports HTML, audio, images, and web assets.

## Quick Start

```bash
# Upload today's newspaper
python .claude/skills/post-uploader/scripts/upload.py chemistry-times-2026-03-30.html

# Upload TTS audio files
python .claude/skills/post-uploader/scripts/upload.py tts-article-1-p1.mp3 tts-article-1-p2.mp3

# Upload all files from output directory
python .claude/skills/post-uploader/scripts/upload.py --dir ./output/

# Upload with custom server URL
python .claude/skills/post-uploader/scripts/upload.py output.html --url http://myserver:17171/chemistry-times/api/upload
```

## Upload Endpoint

```
POST /chemistry-times/api/upload
Content-Type: multipart/form-data
```

Returns:
```json
{"url": "/chemistry-times/static/articles/filename.html", "filename": "filename.html"}
```

## Daily Workflow

1. Generate TTS audio files
2. Upload audio files first (they must be accessible before HTML references them)
3. Code Reviewer approves HTML
4. Editor-in-Chief authorizes publication
5. Upload HTML file
6. Return public URL to Editor-in-Chief

## Supported File Types

| Extension | MIME Type |
|-----------|-----------|
| `.html` | `text/html; charset=utf-8` |
| `.mp3` | `audio/mpeg` |
| `.css` | `text/css; charset=utf-8` |
| `.js` | `application/javascript; charset=utf-8` |
| `.png`, `.jpg`, `.gif`, `.webp`, `.svg` | Corresponding image types |

## Configuration

Set server URL in `config/settings.yaml` or via `UPLOAD_URL` environment variable.
Default: `http://localhost:17171/chemistry-times/api/upload`

## Example: Full Daily Upload with TTS

```bash
# Upload all TTS audio files
$ python .claude/skills/post-uploader/scripts/upload.py --dir ./tts-output/
[upload] tts-article-1-p1.mp3... [ok]
[upload] tts-article-1-p2.mp3... [ok]
# ... 30 files uploaded

# Upload the newspaper HTML
$ python .claude/skills/post-uploader/scripts/upload.py chemistry-times-2026-03-30.html
[ok] /chemistry-times/static/articles/chemistry-times-2026-03-30.html
```

## Quality Checkpoints

- [ ] Audio files uploaded before HTML (HTML references them)
- [ ] Upload confirmation URL matches expected path
- [ ] All files return HTTP 200
