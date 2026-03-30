---
name: HTML Quality Standard
description: Enforce valid HTML5 structure, bilingual toggle mechanics, performance, and accessibility for the daily HTML output
paths:
  - "**/*.html"
  - "**/*.css"
  - "**/*.js"
---

# HTML Quality Standard

## Applicability

- Applies to: HTML Daily Producer, Code Reviewer

## Rule Content

### HTML Structure

- The output must be valid HTML5 with a proper `<!DOCTYPE html>` declaration.
- Use semantic elements: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`.
- Heading levels must be hierarchical (h1 → h2 → h3) without skipping levels.

### Sidebar Table of Contents

- The left sidebar TOC must be fixed-position (does not scroll with page content).
- Every TOC entry must be an anchor link that scrolls smoothly to its corresponding article section.
- Sidebar must remain functional at viewport widths of 1024px and above.

### Bilingual Toggle

- The toggle must switch between Chinese and English display using CSS class changes only (e.g., `body.lang-en .cn { display: none }`).
- No page reload is permitted when switching languages.
- No external JavaScript framework (React, Vue, jQuery, etc.) may be used.
- On page load, Chinese is the default visible language.

### Responsive Layout

- Layout must be functional at desktop (1024px+) and tablet (768px+) breakpoints.
- On mobile viewports below 768px, the sidebar may collapse into a top navigation bar.

### Accessibility

- All images must have descriptive `alt` attributes.
- Color contrast between text and background must meet WCAG AA: minimum 4.5:1 ratio for body text.
- Interactive elements (buttons, links) must have visible focus states.

### Performance

- Total page size (excluding linked images) must not exceed 500KB.
- No external JavaScript or CSS framework loaded via CDN.
- All styles must be in `<style>` tags or inline. No external stylesheet links.
- All scripts must be in `<script>` tags embedded in the HTML file.

### Asset URLs

All assets (images, supplemental files) must use relative server paths (e.g., `/chemistry-times/static/articles/{filename}`). External absolute URLs are prohibited for locally hosted assets.

## Violation Determination

- HTML file fails W3C HTML5 validation → Violation
- Sidebar TOC not fixed-position or anchor links broken → Violation
- Bilingual toggle causes page reload → Violation
- External JS framework loaded from CDN → Violation
- Total page size exceeds 500KB (excluding linked images) → Violation
- Any image missing `alt` attribute → Violation
- Text contrast ratio below 4.5:1 → Violation
- Asset referenced with an external absolute URL instead of a relative server path → Violation

## Exceptions

This rule has no exceptions.
