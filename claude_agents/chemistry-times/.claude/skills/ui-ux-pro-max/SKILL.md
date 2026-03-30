---
name: UI/UX Pro Max
description: Comprehensive UI/UX design intelligence with styles, palettes, typography, and stack guidelines for HTML production
---

# UI/UX Pro Max

## Description

This skill provides access to a comprehensive UI/UX design intelligence library covering 50+ design styles, 97 color palettes, 57 font pairings, 99 UX guidelines, and 25 chart types. It supports the HTML-Tailwind stack and is used to guide the HTML Daily Producer in building and iterating the ChemistryTimes bilingual newspaper template.

## Users

This skill belongs exclusively to `agents/production/html-daily-producer.md`

## Core Knowledge

### External Installation Path

The full UI/UX Pro Max skill library is installed at:

```
/Users/wow/wrk/codeworks/A-Team/ui-ux-pro-max/
```

All queries and design system lookups are executed via the scripts in that directory. You must use the installed scripts — do not reconstruct design recommendations from memory.

### Capability Summary

| Capability | Coverage |
|-----------|----------|
| Design styles | 50+ named styles (editorial, minimal, brutalist, glassmorphism, etc.) |
| Color palettes | 97 palettes with hex codes, use-case tags, accessibility ratings |
| Font pairings | 57 combinations with heading/body/caption roles and web-safe alternatives |
| UX guidelines | 99 guidelines covering layout, navigation, readability, accessibility |
| Chart types | 25 chart types with when-to-use criteria and Tailwind implementation notes |
| Stack support | HTML + Tailwind CSS (primary), with CDN-ready component patterns |

### Recommended Workflow for HTML Daily Producer

Execute these steps when building or updating the newspaper template:

1. **Query for newspaper/editorial design style** — Run a style search with domain-specific terms to get matching design styles and palette recommendations
2. **Run `--design-system`** — Get comprehensive template recommendations including layout structure, typography scale, color tokens, and component patterns
3. **Get stack-specific guidelines** — Run with `--stack html-tailwind` to receive Tailwind class recommendations and CDN-ready HTML patterns
4. **Build and iterate** — Apply recommendations to the HTML template, re-query with specific component names when stuck on a UI element

### Command Reference

**Style and design system query:**
```bash
python /Users/wow/wrk/codeworks/A-Team/ui-ux-pro-max/scripts/search.py \
  "editorial newspaper digital bilingual" --design-system
```

**UX guidelines with stack filter:**
```bash
python /Users/wow/wrk/codeworks/A-Team/ui-ux-pro-max/scripts/search.py \
  "sidebar navigation fixed" --domain ux --stack html-tailwind
```

**Color palette query:**
```bash
python /Users/wow/wrk/codeworks/A-Team/ui-ux-pro-max/scripts/search.py \
  "professional news dark mode accessible" --domain palette
```

**Typography query:**
```bash
python /Users/wow/wrk/codeworks/A-Team/ui-ux-pro-max/scripts/search.py \
  "bilingual Chinese English serif readable" --domain typography
```

**Chart type guidance:**
```bash
python /Users/wow/wrk/codeworks/A-Team/ui-ux-pro-max/scripts/search.py \
  "comparison bar chart market share" --domain chart --stack html-tailwind
```

### Query Keywords for ChemistryTimes Context

Use these keyword combinations for newspaper-relevant queries:

- Layout: `"editorial newspaper grid bilingual two-column"`
- Typography: `"Traditional Chinese English mixed serif sans-serif"`
- Color: `"news professional readable dark accent"`
- Navigation: `"fixed sidebar section anchor scroll"`
- Data visualization: `"comparison table trend sparkline news"`

## Application Guide

### Scenario A: Initial Template Build

1. Run design system query with `"editorial newspaper digital bilingual"` keywords
2. Note recommended design style, color palette, and font pairing from output
3. Run stack query with `--stack html-tailwind` to get Tailwind class recommendations
4. Build base template using the full-page single-file structure
5. Validate: template must be self-contained, no external dependencies requiring authentication

### Scenario B: Component-Level Iteration

When a specific component needs improvement (headline block, data table, GitHub section):

1. Identify the component type and describe it in plain language
2. Run targeted query: `python .../search.py "{component description}" --stack html-tailwind`
3. Apply the returned Tailwind patterns to the component
4. Ensure changes do not break the overall layout grid

### Scenario C: Accessibility or Readability Issue

When the Code Reviewer flags a readability or contrast issue:

1. Run palette query with accessibility keywords: `"high contrast accessible WCAG"`
2. Identify the failing element and the recommended alternative from query output
3. Apply color token swap using Tailwind utility classes
4. Re-submit to Code Reviewer

## Quality Checkpoints

- [ ] Design style query is run before template construction (not skipped)
- [ ] `--stack html-tailwind` flag is used for all implementation queries
- [ ] Template is self-contained HTML (single file, no unauthenticated external dependencies)
- [ ] Font pairing query is run and applied (no default browser fonts)
- [ ] Color palette query is run and applied (no arbitrary hex codes)
- [ ] Template renders correctly at 1280px and 768px viewport widths

## Example

### Input
HTML Daily Producer begins building the ChemistryTimes newspaper template from scratch.

### Output (Workflow Execution)
```bash
# Step 1: Get overall design direction
python /Users/wow/wrk/codeworks/A-Team/ui-ux-pro-max/scripts/search.py \
  "editorial newspaper digital bilingual" --design-system
# Returns: Style "Editorial Minimal", Palette "Ink and Paper Pro",
#   Font pairing "Noto Serif TC + Inter", Layout grid recommendations

# Step 2: Get Tailwind implementation guidance
python /Users/wow/wrk/codeworks/A-Team/ui-ux-pro-max/scripts/search.py \
  "editorial newspaper fixed header section navigation" \
  --domain ux --stack html-tailwind
# Returns: Tailwind classes for fixed header, scroll-spy nav,
#   section anchor pattern, responsive two-column grid

# Step 3: Get chart guidance for GitHub trending section
python /Users/wow/wrk/codeworks/A-Team/ui-ux-pro-max/scripts/search.py \
  "star count ranking horizontal bar" --domain chart --stack html-tailwind
# Returns: Horizontal bar chart pattern using Tailwind width utilities

# Result: HTML template built using recommended styles, palette, fonts,
# and Tailwind patterns. Self-contained single file ready for Code Review.
```
