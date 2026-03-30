---
name: Post Uploader
description: Upload HTML, CSS, JS, and image files to ChemistryTimes server via multipart POST
---

# Post Uploader

Upload files to the ChemistryTimes server (`/chemistry-times/api/upload`) and return public URLs. Supports HTML, CSS, JS, images, and any web asset.

## Quick Start

```bash
# Upload today's newspaper
python .claude/skills/post-uploader/scripts/upload.py chemistry-times-2026-03-18.html
# Output: {"url": "/chemistry-times/static/articles/chemistry-times-2026-03-18.html", "filename": "chemistry-times-2026-03-18.html"}

# Upload with custom server URL
python .claude/skills/post-uploader/scripts/upload.py output.html --url http://myserver:17171/chemistry-times/api/upload

# Upload multiple files (HTML + images)
python .claude/skills/post-uploader/scripts/upload.py index.html hero.png chart.svg

# Upload all files from output directory
python .claude/skills/post-uploader/scripts/upload.py --dir ./output/
```

## Daily Newspaper Upload Workflow

1. HTML Daily Producer finishes integrating the bilingual newspaper HTML
2. Code Reviewer approves the HTML quality
3. Editor-in-Chief authorizes publication
4. Upload the HTML file:

```bash
python .claude/skills/post-uploader/scripts/upload.py \
  chemistry-times-2026-03-18.html
```

5. If the newspaper includes separate image files, upload them too:

```bash
python .claude/skills/post-uploader/scripts/upload.py \
  --dir ./images/
```

6. Return the public URL to the Editor-in-Chief for distribution.

## Upload Endpoint

Files are uploaded via multipart POST to the ChemistryTimes server:

```
POST /chemistry-times/api/upload
Content-Type: multipart/form-data
```

The server returns JSON:

```json
{
  "url": "/chemistry-times/static/articles/filename.html",
  "filename": "filename.html"
}
```

## Script Reference

| Flag | Description |
|------|-------------|
| `files` | File(s) to upload (positional arguments) |
| `--url` | Override server upload URL (default: `http://localhost:17171/chemistry-times/api/upload`) |
| `--dir, -d` | Upload all web files from directory |
| `--extensions` | File extensions for --dir mode (default: common web types) |

## Supported File Types

| Extension | MIME Type |
|-----------|-----------|
| `.html`, `.htm` | `text/html; charset=utf-8` |
| `.css` | `text/css; charset=utf-8` |
| `.js` | `application/javascript; charset=utf-8` |
| `.json` | `application/json; charset=utf-8` |
| `.png` | `image/png` |
| `.jpg`, `.jpeg` | `image/jpeg` |
| `.gif` | `image/gif` |
| `.webp` | `image/webp` |
| `.svg` | `image/svg+xml` |
| `.woff`, `.woff2` | `font/woff`, `font/woff2` |

## Configuration

Set server URL in `config/settings.yaml`:

```yaml
server:
  upload_url: "http://localhost:17171/chemistry-times/api/upload"
```

Environment variable `UPLOAD_URL` works as fallback.

## Example: Full Daily Upload

```bash
# Input: completed newspaper HTML file
# Output: server URL for distribution

$ python .claude/skills/post-uploader/scripts/upload.py \
    chemistry-times-2026-03-18.html

[upload] chemistry-times-2026-03-18.html...
[ok] /chemistry-times/static/articles/chemistry-times-2026-03-18.html

{
  "url": "/chemistry-times/static/articles/chemistry-times-2026-03-18.html",
  "filename": "chemistry-times-2026-03-18.html"
}
```
