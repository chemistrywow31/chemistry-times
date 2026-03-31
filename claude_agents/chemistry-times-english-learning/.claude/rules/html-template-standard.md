---
name: HTML Template Standard
description: Enforce consistent use of the dual-mode newspaper HTML template with learning components
paths:
  - "**/*.html"
---

# HTML Template Standard

## Applicability

- Applies to: HTML Daily Producer, Code Reviewer

## Rule Content

### Template Reference

Every daily HTML file must be built from the template at:
```
workspace/template/chemistry-times-template.html
```

Use this template as the structural foundation. Do not improvise a new layout from scratch.

### Brand Design Tokens

Use CSS custom properties for all colors. The ChemistryTimes palette uses a monochrome, ink-on-paper aesthetic:

| Token | Light Value | Dark Value |
|-------|------------|------------|
| `--bg-primary` | `#fafaf8` | `#1a1a1a` |
| `--bg-secondary` | `#f5f4f2` | `#242424` |
| `--text-primary` | `#333333` | `#e0e0e0` |
| `--text-secondary` | `#555555` | `#b0b0b0` |
| `--text-muted` | `#999999` | `#777777` |
| `--border-color` | `#e2e2e2` | `#333333` |
| `--border-heavy` | `#121212` | `#e0e0e0` |
| `--accent` | `#121212` | `#e0e0e0` |
| `--link-color` | `#326891` | `#6ca4d9` |
| `--learning-bg` | `#f0f7ff` | `#1a2433` |
| `--grammar-bg` | `#fff8f0` | `#2a2218` |
| `--vocab-bg` | `#f5fff5` | `#1a2a1a` |

Dark theme tokens are applied via `[data-theme="dark"]`.

### Required Structural Elements

Every daily HTML output must contain:

1. **Google Fonts Huninn import** via `<link>` in `<head>`
2. **Sticky sidebar TOC** with bilingual TOC items
3. **Dual-mode toggle** (`中文版 / English Learning`) via `body[data-mode]` CSS class toggling
4. **Section dividers** between content sections
5. **Article cards** (deep dives) with all content for both modes
6. **News brief cards** (compact format) with both mode content
7. **Source attribution block** per article with clickable links
8. **Collapsible sections** for translations and grammar notes (`<details><summary>` or CSS accordion)
9. **Vocabulary tables** per article in English Learning mode
10. **Audio players** per paragraph in English Learning mode (`<audio>` elements with controls)
11. **Dark theme CSS** via `[data-theme="dark"]` selector
12. **Mode/theme query param JS** that reads `?mode=` and `?theme=` from URL

### Learning Mode Components

#### Collapsible Translation
```html
<details class="translation-block">
  <summary>中文翻譯</summary>
  <div class="translation-content">{paragraph translation}</div>
</details>
```

#### Collapsible Grammar
```html
<details class="grammar-block">
  <summary>文法重點</summary>
  <div class="grammar-content">{grammar analysis}</div>
</details>
```

#### Vocabulary Table
```html
<table class="vocab-table">
  <thead><tr><th>Word</th><th>POS</th><th>中文</th><th>Context</th></tr></thead>
  <tbody>{rows}</tbody>
</table>
```

#### Audio Player
```html
<div class="tts-player">
  <audio controls preload="none" src="{tts-file-path}"></audio>
</div>
```

### Prohibited Modifications

- Do not change CSS custom property values in `:root` or `[data-theme="dark"]`
- Do not remove the TOC, section dividers, or source attribution
- Do not replace the mode toggle mechanism
- Do not add external CDN dependencies except Google Fonts Huninn
- Do not introduce box-shadow, border-radius > 3px, or gradient backgrounds

## Violation Determination

- HTML output missing any of the 12 required structural elements -> Violation
- Source URL not wrapped in clickable `<a>` tag -> Violation
- CSS custom property values changed from design tokens -> Violation
- External CDN dependency added (other than Google Fonts) -> Violation
- Learning mode components missing collapsible behavior -> Violation

## Exceptions

- If a section has zero articles, its section divider and cards may be omitted. TOC must reflect the omission.
