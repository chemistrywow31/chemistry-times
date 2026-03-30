---
name: Source Attribution
description: Every article must credit all original sources at the bottom as clickable title links
---

# Source Attribution

## Applicability

- Applies to: Chinese Daily Writer, English Daily Writer, Digital Journalist, HTML Daily Producer

## Rule Content

### Attribution Requirement

Every article published in ChemistryTimes must list all original sources at the bottom of the article. Missing attribution is a publication blocker — the article may not proceed to HTML production until attribution is complete.

### Attribution Format

Each source must be rendered as a clickable link where the source name is the link text and the URL is the href. One source per `<p>` tag:

```html
<p><a href="{URL}" target="_blank" rel="noopener">{SourceName}</a></p>
```

If the source has a named author, include it in the link text:

```html
<p><a href="{URL}" target="_blank" rel="noopener">{SourceName} — {AuthorName}</a></p>
```

Do NOT use the old `來源 / Source: {Name} ({URL})` format. The URL must not appear as visible text — it must be embedded in the link's `href` attribute only.

### Multiple Sources

When an article draws from more than one source, all sources must be listed. Selecting only the "most important" source and omitting others is prohibited.

### GitHub Items

Any article covering a GitHub repository must include a direct link to the repository in the attribution block:

```html
<p><a href="https://github.com/{owner}/{repo}" target="_blank" rel="noopener">GitHub — {RepositoryName}</a></p>
```

### Writer Responsibility

The writer is responsible for verifying that all sources in the attribution block match the sources flagged in the Data Auditor's verified source bundle. You must not add sources not present in the bundle, and you must not omit sources the bundle marks as used.

## Violation Determination

- Article delivered to HTML Producer with no attribution block → Violation (publication blocker)
- Source displayed as raw URL text instead of clickable title link → Violation
- Source uses the old `來源 / Source:` prefix format → Violation
- Article uses multiple sources but lists only a subset → Violation
- GitHub repository article missing direct repository URL → Violation
- Attribution block includes a source not in the Data Auditor's verified bundle → Violation

## Exceptions

This rule has no exceptions.
