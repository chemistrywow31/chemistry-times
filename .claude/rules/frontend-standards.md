---
name: Frontend Standards
description: Enforce component quality, accessibility, and responsive design standards across all frontend code
paths:
  - "src/components/**/*.{ts,tsx}"
  - "src/app/**/*.{ts,tsx}"
  - "src/hooks/**/*.ts"
  - "**/*.tsx"
---

# Frontend Standards

## Applicability

- Applies to: `frontend-engineer`, `code-reviewer`

## Rule Content

### Component Size Limit

You must keep every component file under 200 lines. When a component exceeds 200 lines, you must split it into sub-components or extract logic into custom hooks.

### TypeScript Strictness

You must not use the `any` type in frontend code. Define proper interfaces for all data structures, props, and API responses. Use `unknown` with type guards when the type is genuinely unknown.

### CVA for Multi-Variant Components

You must use `class-variance-authority` (CVA) for any component that has more than one visual variant. Do not use conditional ternary chains for variant styling.

### Responsive Design

You must implement mobile-first responsive design. Every page and component must render correctly at these breakpoints:
- Mobile: 375px
- Tablet: 768px
- Desktop: 1024px
- Wide: 1440px

### Accessibility Requirements

You must meet WCAG 2.1 AA compliance:
- All images must have `alt` attributes
- All form inputs must have associated `<label>` elements
- All interactive elements must be keyboard-navigable (Tab, Enter, Escape)
- Color contrast must meet 4.5:1 ratio for normal text
- You must include `aria-label` on icon-only buttons
- You must respect `prefers-reduced-motion` for animations

### Loading and Error States

Every component that fetches data must implement:
- A loading state (skeleton or spinner)
- An error state with a user-friendly message
- An empty state when data is empty

### No Production Console Logs

You must not leave `console.log`, `console.warn`, or `console.error` in production frontend code. Use a structured logger or remove debug statements before marking work complete.

### List Key Props

You must provide a stable, unique `key` prop for every element rendered in a list. Do not use array index as `key` unless the list is static and never reordered.

## Violation Determination

- Component file exceeds 200 lines without being split -> Violation
- `any` type used in frontend code -> Violation
- Multi-variant component uses ternary chains instead of CVA -> Violation
- Page does not render correctly at all four breakpoints -> Violation
- Image missing `alt` attribute -> Violation
- Form input missing label -> Violation
- Data-fetching component missing loading or error state -> Violation
- `console.log` found in production code -> Violation
- List element missing unique `key` prop -> Violation

## Exceptions

- Prototype code marked with `// SPIKE: <reason>` is exempt from the 200-line limit but must be refactored before merging to main.
