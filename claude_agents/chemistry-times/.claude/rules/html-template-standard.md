---
name: HTML Template Standard
description: Enforce consistent use of the NYT Huninn newspaper-style HTML template for all daily newspaper output
---

# HTML Template Standard

## Applicability

- Applies to: HTML Daily Producer, Code Reviewer

## Rule Content

### Template Reference

Every daily newspaper HTML file must be built from the template at:

```
claude_agents/chemistry-times/workspace/template/chemistry-times-template.html
```

You must use this template as the structural foundation. You must not improvise a new layout, color scheme, or component structure from scratch.

### Brand Design Tokens

The following CSS custom properties define the ChemistryTimes NYT Huninn newspaper-style palette (monochrome, ink-on-paper aesthetic). You must use these variables — hardcoding alternative hex values is prohibited:

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#fafaf8` | Page background, article cards |
| `--bg-secondary` | `#f5f4f2` | Perspective block background |
| `--text-primary` | `#333333` | Body text |
| `--text-secondary` | `#555555` | Subheadlines, muted body, brief summaries |
| `--text-muted` | `#999999` | Labels, captions, tag text |
| `--text-inverse` | `#333333` | Inverse text (same as primary in light mode) |
| `--border-color` | `#e2e2e2` | Card borders, source dividers |
| `--border-light` | `#eeeeee` | Subtle internal dividers |
| `--border-heavy` | `#121212` | Section divider double-border |
| `--accent` | `#121212` | Headlines, section titles, perspective border |
| `--link-color` | `#326891` | Hyperlinks, active TOC indicator |

Dark theme tokens (applied via `[data-theme="dark"]`):

| Token | Dark Value |
|-------|-----------|
| `--bg-primary` | `#1a1a1a` |
| `--bg-secondary` | `#242424` |
| `--text-primary` | `#e0e0e0` |
| `--text-secondary` | `#b0b0b0` |
| `--text-muted` | `#777777` |
| `--text-inverse` | `#e0e0e0` |
| `--border-color` | `#333333` |
| `--border-light` | `#2a2a2a` |
| `--border-heavy` | `#e0e0e0` |
| `--accent` | `#e0e0e0` |
| `--link-color` | `#6ca4d9` |

### Date Display Format

All date displays in the HTML output must use the `YYYY.MM.DD` format (e.g., `2026.03.19`). This applies to: `<title>` and any visible date references.

You must not use `YYYY-MM-DD`, `YYYY 年 M 月 DD 日`, or any other date format in user-visible elements.

### Article Anchor IDs

Every article (Deep Dive and Brief) must carry sequential anchor IDs for deep-linking. All articles are numbered sequentially across the entire issue — Deep Dives first, then Briefs.

| Target | ID Pattern |
|--------|-----------|
| Article N heading | `id="article-{N}"` |
| Article N, paragraph M | `id="article-{N}-p-{M}"` |

Rules:
- Deep Dives are numbered first (article-1, article-2, ...), Briefs continue the sequence (article-4, article-5, ...)
- Every `<p>` inside `.article-body` and `.brief-summary` must carry a paragraph ID
- For bilingual content, only the Chinese version (`article-zh-tw`) paragraphs carry the `id` attributes (CN is the default visible language; EN paragraphs occupy the same scroll position)
- The perspective section paragraph carries the next sequential paragraph ID
- TOC links must use `#article-{N}` format

Final deep-link format: `/chemistry-times?article=MONGO_ID#article-2-p-3`

### Required Structural Elements

Every daily HTML output must contain all of the following:

1. **Google Fonts Huninn import** via `<link>` tags in `<head>`
2. **Sticky margin TOC** (`nav.article-toc`) with bilingual TOC items grouped by content pillar
3. **Bilingual content switching** via `body[data-lang]` CSS class toggling (`zh-tw` / `en`) — no page reload
4. **Section dividers** between content pillars with double-border style
5. **Article cards** (deep dives) with tag, headline, deck/lead, body, and perspective section
6. **News brief cards** (compact format) with tag, headline, summary, and perspective section
7. **Source attribution block** per article — every source URL must be wrapped in an `<a>` tag with `target="_blank" rel="noopener"`
8. **Freshness tags** on each article (`breaking`, `recent`, `not-breaking`)
9. **Dark theme CSS** via `[data-theme="dark"]` selector with full token overrides
10. **Lang/theme query param JS** that reads `?lang=` and `?theme=` from the URL and applies them on load, plus `postMessage` listener for shell-driven switching

### Two-Tier Article Format

Articles are classified into two formats by the Editor-in-Chief:

- **深度報導 / Deep Dive**: Full `article-card` with headline, deck, body, perspective section, and source attribution. Used for high-priority stories requiring analysis.
- **快訊 / News Brief**: Compact `brief-card` with headline, summary paragraphs, perspective section, and source attribution. All news briefs are grouped under a single "快訊 / News Briefs" section at the bottom of the content area.

There is no fixed cap on the total number of articles. Include every story that passes editorial judgment.

### Typography Stack

All text uses the Huninn font imported from Google Fonts. The template defines these font variables:

- **`--font-serif-tc`**: `'Huninn', 'Noto Sans TC', sans-serif`
- **`--font-sans-tc`**: `'Huninn', 'Noto Sans TC', sans-serif`
- **`--font-sans-en`**: `'Huninn', 'Noto Sans TC', sans-serif`
- **`--font-serif-en`**: `'Huninn', 'Noto Sans TC', sans-serif`
- **`--font-mono`**: `"SF Mono", "Fira Code", Consolas, monospace`

### Permitted Modifications

The HTML Daily Producer may:
- Add or remove article cards (repeat the `article-card` or `brief-card` block)
- Adjust article-specific tag classes (`competitor`, `tech`, `github`)
- Add new article tag types with colors consistent with the monochrome palette
- Add or remove TOC entries to match the day's article lineup

### Prohibited Modifications

The HTML Daily Producer must not:
- Change CSS custom property values in `:root` or `[data-theme="dark"]`
- Remove the TOC, section dividers, or source attribution structures
- Replace the language toggle mechanism with a different approach
- Add external CDN dependencies EXCEPT Google Fonts Huninn (which is required)
- Remove the dark theme CSS or the lang/theme query param JS
- Introduce box-shadow, border-radius > 3px, or gradient backgrounds (the NYT style uses flat, minimal decoration)

### Code Reviewer Validation

Code Reviewer must verify template compliance by checking:
- All CSS custom properties from the design tokens table are present and unchanged
- All ten required structural elements exist in the HTML
- Language toggle uses `body[data-lang]` CSS switching (no page reload)
- Dark theme uses `[data-theme="dark"]` with correct token overrides
- Google Fonts Huninn `<link>` is present in `<head>`
- No external resource requests other than Google Fonts Huninn
- No box-shadows or rounded corners beyond 3px

## Violation Determination

- Daily HTML output missing any of the ten required structural elements -> Violation
- Source URL not wrapped in `<a>` tag -> Violation
- CSS custom property values changed from the specified design tokens -> Violation
- External CDN dependency added (other than Google Fonts Huninn) -> Violation
- HTML Producer builds layout from scratch without using the template -> Violation
- Box-shadow, gradient, or border-radius > 3px introduced -> Violation

## Exceptions

- If a structural element is genuinely inapplicable (e.g., zero articles in a pillar), the corresponding section divider and article cards for that pillar may be omitted. The TOC must reflect this omission.
