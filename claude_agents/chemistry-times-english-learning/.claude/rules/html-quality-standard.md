---
name: HTML Quality Standard
description: Enforce valid HTML5 structure, dual-mode toggle, learning components, performance, and accessibility
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

- Valid HTML5 with `<!DOCTYPE html>` declaration
- Semantic elements: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`
- Heading levels must be hierarchical (h1 -> h2 -> h3) without skipping

### Sidebar Table of Contents

- Fixed-position left sidebar (does not scroll with page content)
- Every TOC entry links to its article section via anchor with smooth scroll
- Sidebar functional at viewport widths 1024px and above

### Dual-Mode Toggle

- Toggle switches between 中文版 and English Learning using CSS class changes only
- No page reload when switching modes
- No external JavaScript framework
- 中文版 is the default on page load

### Learning Mode Components

- Collapsible translation sections open/close without page reload
- Collapsible grammar sections open/close without page reload
- Vocabulary tables render correctly with all four columns
- Audio players load and play TTS MP3 files
- Audio elements use `preload="none"` to avoid loading all audio on page load

### Responsive Layout

- Functional at desktop (1024px+) and tablet (768px+)
- On mobile below 768px, sidebar may collapse into top navigation

### Accessibility

- All images must have descriptive `alt` attributes
- Color contrast: minimum 4.5:1 ratio for body text (WCAG AA)
- Interactive elements must have visible focus states
- Collapsible sections must be keyboard-accessible
- Audio players must have visible controls

### Performance

- Total page size (excluding audio files and linked images) must not exceed 800KB
- No external JavaScript or CSS frameworks via CDN
- All styles in `<style>` tags or inline
- Audio files use `preload="none"` attribute
- All scripts embedded in `<script>` tags

### Asset URLs

All assets (images, audio, supplemental files) must use relative server paths (e.g., `/chemistry-times/static/articles/{filename}`). External absolute URLs are prohibited for locally hosted assets.

## Violation Determination

- HTML fails valid HTML5 structure -> Violation
- Sidebar TOC not fixed-position or anchor links broken -> Violation
- Mode toggle causes page reload -> Violation
- External JS framework loaded from CDN -> Violation
- Total page size exceeds 800KB (excluding audio and images) -> Violation
- Image missing `alt` attribute -> Violation
- Text contrast ratio below 4.5:1 -> Violation
- Audio player missing controls attribute -> Violation
- Collapsible section not keyboard-accessible -> Violation

## Exceptions

- This rule has no exceptions.
