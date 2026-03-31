#!/usr/bin/env python3
"""Build ChemistryTimes 2026-03-31 daily HTML from content files."""

import json
import re
import html as html_mod

# ── Load data ──────────────────────────────────────────────────────────────
with open("workspace/education-content-2026-03-31.json") as f:
    edu = json.load(f)
with open("workspace/en-curated-2026-03-31.json") as f:
    en_cur = json.load(f)
with open("workspace/cn-articles-2026-03-31.md") as f:
    cn_raw = f.read()

# ── Parse CN articles ──────────────────────────────────────────────────────
def parse_cn_articles(text):
    articles = {}
    blocks = re.split(r'\n---\n', text)
    for block in blocks:
        m = re.search(r'## (A\d+)', block)
        if not m:
            continue
        aid = m.group(1)
        art = {}
        # Title
        tm = re.search(r'\*\*標題\*\*：(.+)', block)
        art['title'] = tm.group(1).strip() if tm else ''
        # Lead
        lm = re.search(r'\*\*導言\*\*：(.+)', block)
        art['lead'] = lm.group(1).strip() if lm else ''
        # Body
        bm = re.search(r'\*\*正文\*\*：\n(.*?)(?=\n\*\*化學觀點\*\*)', block, re.S)
        art['body'] = bm.group(1).strip() if bm else ''
        # Perspective
        pm = re.search(r'\*\*化學觀點\*\*：\n(.*?)(?=\n\*\*來源\*\*)', block, re.S)
        art['perspective'] = pm.group(1).strip() if pm else ''
        # Sources HTML
        sm = re.search(r'\*\*來源\*\*：\n(.*?)$', block, re.S)
        art['sources_html'] = sm.group(1).strip() if sm else ''
        articles[aid] = art
    return articles

cn = parse_cn_articles(cn_raw)

# Build lookup by article_id
edu_by_id = {a['article_id']: a for a in edu['articles']}
en_by_id = {a['article_id']: a for a in en_cur['articles']}

# ── Article config ─────────────────────────────────────────────────────────
SECTIONS = [
    {
        'slug': 'world-news',
        'label_cn': '國際新聞',
        'label_en': 'World News',
        'deep_dives': [('A1', 'iran-war-oil-shock')],
        'briefs': [('A7', 'nasa-artemis-ii')],
    },
    {
        'slug': 'ai-tech',
        'label_cn': 'AI & 科技',
        'label_en': 'AI & Tech',
        'deep_dives': [('A2', 'anthropic-mythos-leak'), ('A3', 'microsoft-vibevoice')],
        'briefs': [('A4', 'claude-code-cache-bug')],
    },
    {
        'slug': 'business',
        'label_cn': '商業 & 產業',
        'label_en': 'Business & Industry',
        'deep_dives': [('A5', 'meta-instagram-plus')],
        'briefs': [('A6', 'ionq-skywater')],
    },
]

def e(text):
    """HTML-escape text."""
    return html_mod.escape(str(text))

def cn_body_to_html(body_text):
    """Convert CN body markdown text to HTML paragraphs."""
    paragraphs = [p.strip() for p in body_text.split('\n\n') if p.strip()]
    # Also split on single newlines if they look like real paragraphs
    if len(paragraphs) <= 1:
        paragraphs = [p.strip() for p in body_text.split('\n') if p.strip()]
    return '\n'.join(f'              <p>{e(p)}</p>' for p in paragraphs)

def build_en_learning(article_id):
    """Build English Learning mode HTML for an article."""
    edu_art = edu_by_id.get(article_id)
    en_art = en_by_id.get(article_id)
    if not edu_art or not en_art:
        return '<!-- Missing education content -->'

    parts = []
    # Headline
    parts.append(f'            <h3 class="article-headline">{e(en_art["headline"])}</h3>')

    # Paragraphs
    for pkey in sorted(edu_art['paragraphs'].keys(), key=lambda x: int(x[1:])):
        pnum = pkey[1:]
        p = edu_art['paragraphs'][pkey]
        tts_src = f'tts-{article_id}-p{pnum}.mp3'

        parts.append(f'            <div class="en-paragraph-block">')
        parts.append(f'              <div class="tts-player"><audio controls preload="none" src="{tts_src}"></audio></div>')
        parts.append(f'              <p class="en-original">{e(p["original"])}</p>')

        # Translation
        parts.append(f'              <details class="translation-block"><summary>中文翻譯</summary>')
        parts.append(f'                <div class="translation-content">{e(p["translation"])}</div>')
        parts.append(f'              </details>')

        # Grammar
        if p.get('grammar'):
            parts.append(f'              <details class="grammar-block"><summary>文法重點</summary>')
            parts.append(f'                <div class="grammar-content">')
            for g in p['grammar']:
                parts.append(f'                  <div class="grammar-item">')
                parts.append(f'                    <div class="grammar-structure">{e(g["structure"])}</div>')
                parts.append(f'                    <div class="grammar-example">"{e(g["example"])}"</div>')
                parts.append(f'                    <div class="grammar-explanation">{e(g["explanation"])}</div>')
                parts.append(f'                    <div class="grammar-pattern">Pattern: {e(g["pattern"])}</div>')
                parts.append(f'                  </div>')
            parts.append(f'                </div>')
            parts.append(f'              </details>')

        parts.append(f'            </div>')

    # Vocabulary table
    vocab = edu_art.get('vocabulary_table', [])
    if vocab:
        parts.append(f'            <table class="vocab-table">')
        parts.append(f'              <thead><tr><th>Word</th><th>POS</th><th>中文</th><th>Context</th></tr></thead>')
        parts.append(f'              <tbody>')
        for v in vocab:
            parts.append(f'                <tr><td>{e(v["word"])}</td><td>{e(v["pos"])}</td><td>{e(v["definition"])}</td><td>{e(v["context"])}</td></tr>')
        parts.append(f'              </tbody>')
        parts.append(f'            </table>')

    return '\n'.join(parts)

def build_deep_dive(article_num, cn_key, article_id, tag_class):
    """Build a full deep dive article card."""
    cn_art = cn.get(cn_key, {})
    en_art = en_by_id.get(article_id, {})

    return f'''      <article class="article-card" id="article-{article_num}">
        <div class="article-card-header">
          <div class="article-tag {tag_class}">
            <span class="article-tag-dot"></span>
            <span class="freshness-tag breaking">即時</span>
          </div>
        </div>
        <div class="article-card-body">
          <div class="article-zh-tw">
            <h3 class="article-headline">{e(cn_art.get('title',''))}</h3>
            <p class="article-deck">{e(cn_art.get('lead',''))}</p>
            <div class="article-body">
{cn_body_to_html(cn_art.get('body',''))}
            </div>
            <div class="article-perspective">
              <div class="article-perspective-label">化學觀點</div>
              <p>{e(cn_art.get('perspective',''))}</p>
            </div>
          </div>
          <div class="article-en">
{build_en_learning(article_id)}
          </div>
          <div class="article-sources">
            <div class="article-sources-label">
              <span class="toc-zh-tw">來源</span>
              <span class="toc-en">Sources</span>
            </div>
            {cn_art.get('sources_html','')}
          </div>
        </div>
      </article>'''

def build_brief(article_num, cn_key, article_id, tag_class):
    """Build a brief article card."""
    cn_art = cn.get(cn_key, {})

    return f'''      <div class="brief-card" id="article-{article_num}">
        <div class="article-tag {tag_class}">
          <span class="article-tag-dot"></span>
          <span class="freshness-tag breaking">即時</span>
        </div>
        <div class="article-zh-tw">
          <h4 class="brief-headline">{e(cn_art.get('title',''))}</h4>
          <p class="brief-summary">{e(cn_art.get('lead',''))}</p>
          <div class="article-body">
{cn_body_to_html(cn_art.get('body',''))}
          </div>
          <div class="article-perspective">
            <div class="article-perspective-label">化學觀點</div>
            <p>{e(cn_art.get('perspective',''))}</p>
          </div>
        </div>
        <div class="article-en">
{build_en_learning(article_id)}
        </div>
        <div class="article-sources">
          <div class="article-sources-label">
            <span class="toc-zh-tw">來源</span>
            <span class="toc-en">Sources</span>
          </div>
          {cn_art.get('sources_html','')}
        </div>
      </div>'''

# ── Build TOC ──────────────────────────────────────────────────────────────
toc_lines = []
article_counter = 0

for sec in SECTIONS:
    toc_lines.append(f'      <div class="toc-label toc-zh-tw">{e(sec["label_cn"])}</div>')
    toc_lines.append(f'      <div class="toc-label toc-en">{e(sec["label_en"])}</div>')
    for cn_key, aid in sec['deep_dives']:
        article_counter += 1
        cn_title = cn.get(cn_key, {}).get('title', '')
        en_headline = en_by_id.get(aid, {}).get('headline', '')
        toc_lines.append(f'      <a href="#article-{article_counter}" class="toc-item toc-zh-tw">{e(cn_title[:20])}</a>')
        toc_lines.append(f'      <a href="#article-{article_counter}" class="toc-item toc-en">{e(en_headline[:30])}</a>')
    for cn_key, aid in sec['briefs']:
        article_counter += 1
        cn_title = cn.get(cn_key, {}).get('title', '')
        en_headline = en_by_id.get(aid, {}).get('headline', '')
        toc_lines.append(f'      <a href="#article-{article_counter}" class="toc-item toc-zh-tw">{e(cn_title[:20])}</a>')
        toc_lines.append(f'      <a href="#article-{article_counter}" class="toc-item toc-en">{e(en_headline[:30])}</a>')

toc_html = '\n'.join(toc_lines)

# ── Build content sections ─────────────────────────────────────────────────
content_parts = []
article_counter = 0
tag_classes = {
    'world-news': 'competitor',
    'ai-tech': 'tech',
    'business': 'competitor',
}

for sec in SECTIONS:
    tag_class = tag_classes.get(sec['slug'], 'competitor')

    # Section divider for deep dives
    if sec['deep_dives']:
        content_parts.append(f'''      <div class="section-divider" id="pillar-{sec['slug']}">
        <h2>
          <span class="toc-zh-tw">{e(sec['label_cn'])}</span>
          <span class="toc-en">{e(sec['label_en'])}</span>
        </h2>
        <div class="section-line"></div>
        <div class="section-badge">Deep Dives</div>
      </div>''')

        for cn_key, aid in sec['deep_dives']:
            article_counter += 1
            content_parts.append(build_deep_dive(article_counter, cn_key, aid, tag_class))

    # Briefs section
    if sec['briefs']:
        content_parts.append(f'''      <div class="section-divider" id="pillar-{sec['slug']}-briefs">
        <h2>
          <span class="toc-zh-tw">{e(sec['label_cn'])} — 快訊</span>
          <span class="toc-en">{e(sec['label_en'])} — Briefs</span>
        </h2>
        <div class="section-line"></div>
        <div class="section-badge">Briefs</div>
      </div>''')

        for cn_key, aid in sec['briefs']:
            article_counter += 1
            content_parts.append(build_brief(article_counter, cn_key, aid, tag_class))

content_html = '\n\n'.join(content_parts)

# ── Read template CSS & JS ─────────────────────────────────────────────────
with open("workspace/template/chemistry-times-template.html") as f:
    template = f.read()

# Extract CSS from template
css_match = re.search(r'<style>(.*?)</style>', template, re.S)
template_css = css_match.group(1) if css_match else ''

# Extract JS from template
js_match = re.search(r'<script>(.*?)</script>', template, re.S)
template_js = js_match.group(1) if js_match else ''

# ── Learning mode additional CSS ───────────────────────────────────────────
learning_css = """
    /* --- Learning Mode Components --- */
    :root {
      --learning-bg: #f0f7ff;
      --grammar-bg: #fff8f0;
      --vocab-bg: #f5fff5;
    }
    [data-theme="dark"] {
      --learning-bg: #1a2433;
      --grammar-bg: #2a2218;
      --vocab-bg: #1a2a1a;
    }

    .en-paragraph-block {
      margin-bottom: 28px;
      padding: 20px;
      background: var(--learning-bg);
      border-radius: 3px;
      border: 1px solid var(--border-color);
    }

    .en-original {
      font-size: 16px;
      line-height: 1.8;
      color: var(--text-primary);
      margin: 12px 0;
    }

    .tts-player { margin-bottom: 12px; }
    .tts-player audio { width: 100%; height: 36px; }

    .translation-block,
    .grammar-block { margin-top: 12px; border-radius: 3px; }

    .translation-block summary,
    .grammar-block summary {
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-secondary);
      padding: 8px 12px;
      user-select: none;
    }

    .translation-block summary:hover,
    .grammar-block summary:hover { color: var(--text-primary); }

    .translation-content {
      padding: 12px 16px;
      font-size: 15px;
      line-height: 1.8;
      color: var(--text-primary);
      background: var(--bg-secondary);
      border-radius: 0 0 3px 3px;
    }

    .grammar-content {
      padding: 12px 16px;
      background: var(--grammar-bg);
      border-radius: 0 0 3px 3px;
    }

    .grammar-item {
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border-light);
    }
    .grammar-item:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }

    .grammar-structure {
      font-size: 14px;
      font-weight: 600;
      color: var(--accent);
      margin-bottom: 4px;
    }

    .grammar-example {
      font-size: 14px;
      font-style: italic;
      color: var(--text-secondary);
      margin-bottom: 8px;
      padding-left: 12px;
      border-left: 2px solid var(--border-color);
    }

    .grammar-explanation {
      font-size: 14px;
      line-height: 1.7;
      color: var(--text-primary);
      margin-bottom: 6px;
    }

    .grammar-pattern {
      font-size: 13px;
      color: var(--text-muted);
      font-family: var(--font-mono);
    }

    .vocab-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 24px;
      font-size: 14px;
      background: var(--vocab-bg);
      border-radius: 3px;
      overflow: hidden;
    }

    .vocab-table th {
      text-align: left;
      padding: 10px 12px;
      border-bottom: 2px solid var(--border-color);
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--text-muted);
    }

    .vocab-table td {
      padding: 8px 12px;
      border-bottom: 1px solid var(--border-light);
      color: var(--text-primary);
      line-height: 1.5;
    }

    .vocab-table tr:last-child td { border-bottom: none; }
"""

# ── Assemble final HTML ────────────────────────────────────────────────────
final_html = f'''<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Huninn&display=swap" rel="stylesheet">
  <title>ChemistryTimes 化學時報 — 2026-03-31</title>
  <style>
{template_css}
{learning_css}
  </style>
</head>
<body data-lang="zh-tw">

  <div class="article-layout">

    <nav class="article-toc" role="navigation" aria-label="Table of contents">
{toc_html}
    </nav>

    <div class="article-content">

{content_html}

    </div>

  </div>

  <script>
{template_js}
  </script>

</body>
</html>'''

outpath = "workspace/chemistry-times-2026-03-31.html"
with open(outpath, 'w', encoding='utf-8') as f:
    f.write(final_html)

size_kb = len(final_html.encode('utf-8')) / 1024
print(f"Written: {outpath} ({size_kb:.1f} KB)")
print(f"Articles: {article_counter}")
