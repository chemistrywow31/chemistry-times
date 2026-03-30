#!/usr/bin/env python3
"""
Upload files (HTML, CSS, JS, images, etc.) to ChemistryTimes server.

Usage:
  # Upload an HTML file
  python scripts/upload.py daily.html

  # Upload with custom server URL
  python scripts/upload.py daily.html --url http://myserver:17171/chemistry-times/api/upload

  # Upload multiple files (HTML + CSS + JS + images)
  python scripts/upload.py index.html style.css app.js hero.png

  # Upload all files from a directory
  python scripts/upload.py --dir ./output/

Environment variables (or use config/settings.yaml):
  UPLOAD_URL - Server upload endpoint

Output: JSON with {url, filename} or array of results for batch uploads
"""

import argparse
import json
import os
import sys
from pathlib import Path

import requests
import yaml


def load_config() -> dict:
    """Load upload config from settings.yaml or environment."""
    config = {
        "upload_url": os.getenv(
            "UPLOAD_URL",
            "http://localhost:17171/chemistry-times/api/upload",
        ),
    }

    config_paths = [
        Path(__file__).parent.parent / "config" / "settings.yaml",
        Path("config/settings.yaml"),
    ]

    for config_path in config_paths:
        if config_path.exists():
            with open(config_path) as f:
                yaml_config = yaml.safe_load(f)
                server = yaml_config.get("server", {})
                if server.get("upload_url"):
                    config["upload_url"] = server["upload_url"]
            break

    return config


def upload_file(filepath: Path, upload_url: str) -> dict:
    """Upload a single file to the ChemistryTimes server via multipart POST."""
    filename = filepath.name

    print(f"[upload] {filename}...", file=sys.stderr)

    try:
        with open(filepath, "rb") as f:
            resp = requests.post(
                upload_url,
                files={"file": (filename, f)},
                timeout=60,
            )

        if resp.status_code >= 300:
            error_msg = f"HTTP {resp.status_code}: {resp.text}"
            print(f"[err] {error_msg}", file=sys.stderr)
            return {
                "filename": filename,
                "success": False,
                "error": error_msg,
            }

        result = resp.json()
        url = result.get("url", "")
        returned_filename = result.get("filename", filename)

        print(f"[ok] {url}", file=sys.stderr)
        return {
            "url": url,
            "filename": returned_filename,
            "success": True,
        }

    except requests.RequestException as e:
        error_msg = f"Request failed: {e}"
        print(f"[err] {error_msg}", file=sys.stderr)
        return {
            "filename": filename,
            "success": False,
            "error": error_msg,
        }


def main():
    parser = argparse.ArgumentParser(
        description="Upload files to ChemistryTimes server"
    )
    parser.add_argument("files", nargs="*", help="Files to upload")
    parser.add_argument(
        "--url",
        help="Override server upload URL",
    )
    parser.add_argument(
        "--dir", "-d",
        help="Upload all web files from directory",
    )
    parser.add_argument(
        "--extensions",
        default=".html,.htm,.css,.js,.json,.png,.jpg,.jpeg,.gif,.webp,.svg,.ico,.woff,.woff2",
        help="File extensions for --dir mode",
    )

    args = parser.parse_args()

    config = load_config()
    upload_url = args.url or config["upload_url"]

    results = []

    if args.dir:
        dir_path = Path(args.dir)
        extensions = tuple(args.extensions.split(","))
        filepaths = sorted(
            p for p in dir_path.iterdir()
            if p.is_file() and p.suffix.lower() in extensions
        )
        if not filepaths:
            print("[err] No matching files in directory", file=sys.stderr)
            sys.exit(1)
        for fp in filepaths:
            results.append(upload_file(fp, upload_url))

    elif args.files:
        for f in args.files:
            fp = Path(f)
            if not fp.exists():
                results.append({
                    "filename": f,
                    "success": False,
                    "error": f"File not found: {f}",
                })
                continue
            results.append(upload_file(fp, upload_url))

    else:
        parser.error("Specify files to upload or use --dir")

    if len(results) == 1:
        print(json.dumps(results[0], indent=2))
    else:
        print(json.dumps(results, indent=2))

    sys.exit(0 if all(r["success"] for r in results) else 1)


if __name__ == "__main__":
    main()
