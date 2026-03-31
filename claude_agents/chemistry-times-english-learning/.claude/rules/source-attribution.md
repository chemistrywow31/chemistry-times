---
name: Source Attribution
description: Every article must credit all original sources at the bottom as clickable title links
---

# Source Attribution

## Applicability

- Applies to: Chinese Daily Writer, English Content Curator, Digital Journalist, HTML Daily Producer

## Rule Content

### Attribution Requirement

Every article must list all original sources at the bottom. Missing attribution is a publication blocker.

### Attribution Format

Each source as a clickable link:
```html
<p><a href="{URL}" target="_blank" rel="noopener">{SourceName}</a></p>
```

With author:
```html
<p><a href="{URL}" target="_blank" rel="noopener">{SourceName} — {AuthorName}</a></p>
```

Do not display raw URLs as visible text.

### Multiple Sources

All sources used in an article must be listed. Selecting only the "most important" and omitting others is prohibited.

### GitHub Items

Articles covering GitHub repositories must include a direct link:
```html
<p><a href="https://github.com/{owner}/{repo}" target="_blank" rel="noopener">GitHub — {RepositoryName}</a></p>
```

### Writer Responsibility

Verify that all sources in the attribution block match the Data Auditor's verified source bundle. Do not add sources not in the bundle. Do not omit sources the bundle marks as used.

## Violation Determination

- Article delivered without attribution block -> Violation (publication blocker)
- Source displayed as raw URL text -> Violation
- Article uses multiple sources but lists only a subset -> Violation
- GitHub article missing repository URL -> Violation

## Exceptions

- This rule has no exceptions.
