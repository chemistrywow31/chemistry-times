---
name: UI/UX Pro Max
description: Comprehensive UI/UX design intelligence for HTML production including learning mode components
---

# UI/UX Pro Max

## Description

This skill provides access to a UI/UX design intelligence library covering 50+ design styles, 97 color palettes, 57 font pairings, 99 UX guidelines, and 25 chart types. It supports HTML-based layouts and guides the HTML Daily Producer in building the dual-mode newspaper template including learning mode components.

## Users

- HTML Daily Producer: primary user for template design and iteration

## Core Knowledge

### External Installation Path

The full UI/UX Pro Max skill library is installed at:
```
/Users/wow/wrk/side_proj/A-Team/ui-ux-pro-max/
```

Use the installed scripts for all design queries. Do not reconstruct recommendations from memory.

### Command Reference

**Design system query:**
```bash
python /Users/wow/wrk/side_proj/A-Team/ui-ux-pro-max/scripts/search.py \
  "editorial newspaper digital bilingual learning" --design-system
```

**UX guidelines:**
```bash
python /Users/wow/wrk/side_proj/A-Team/ui-ux-pro-max/scripts/search.py \
  "collapsible accordion learning content" --domain ux --stack html-tailwind
```

**Color palette:**
```bash
python /Users/wow/wrk/side_proj/A-Team/ui-ux-pro-max/scripts/search.py \
  "professional news dark mode accessible learning" --domain palette
```

### Learning Mode Component Patterns

Use these queries for learning-specific components:

- Collapsible sections: `"accordion expandable content toggle reading"`
- Vocabulary tables: `"data table educational compact readable"`
- Audio players: `"audio player minimal inline controls"`
- Mode toggle: `"tab switch toggle two-state content"`

### Recommended Workflow

1. Query design system with learning + newspaper keywords
2. Get stack-specific guidelines with `--stack html-tailwind`
3. Query learning component patterns specifically
4. Build and iterate
5. Re-query for specific components when stuck

## Application Guide

### Scenario A: Template with Learning Components
Query for newspaper + learning layout, get collapsible section patterns, audio player styles, vocabulary table design.

### Scenario B: Accessibility Fix
Code Reviewer flags contrast issue -> query `"high contrast accessible WCAG"` -> apply fix.

### Scenario C: Mobile Responsive Learning Mode
Query `"mobile responsive accordion audio player"` for mobile-optimized learning component patterns.

## Quality Checkpoints

- [ ] Design system query run before template construction
- [ ] Learning component queries run for each new component type
- [ ] Template is self-contained HTML
- [ ] Font and color queries applied (no defaults)
- [ ] Renders at 1280px and 768px
