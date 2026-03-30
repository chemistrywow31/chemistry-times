---
name: Context Management
description: Prevent context bloat by enforcing summary-based reporting and file-based raw data transfer
---

# Context Management

## Applicability

- Applies to: All agents

## Rule Content

### Task Scoping

Editor-in-Chief must break all work into focused subtasks, one objective per agent invocation. A single Task call must not combine multiple unrelated objectives (e.g., "gather news AND write the Chinese version" is prohibited).

### Summary-Only Reporting

Agents must report results as summaries of maximum 500 words. You must not paste raw scraped content, full article text, unprocessed HTML, or data tables into messages.

### File-Based Raw Data Transfer

Any content exceeding 200 words — including scraped HTML, full source articles, data tables, and unprocessed material — must be written to a file under `claude_agents/chemistry-times/workspace/` and referenced by absolute file path in the message. The message must state the file path and a one-sentence description of the file's content.

### Task Bookends

Every agent must include both of the following in its response:

- **At start**: "Received from {agent name or Editor-in-Chief}: {one sentence describing the input}."
- **At end**: "Produced: {one sentence describing the output} — saved to {file path} / summarized above."

If no upstream agent provided input (e.g., Editor-in-Chief initiating the pipeline), state: "Initiating task. No upstream input."

## Violation Determination

- Agent pastes more than 200 words of raw content into a message without saving to file → Violation
- Single Task call contains two or more unrelated objectives → Violation
- Agent response missing the "Received from" opening statement → Violation
- Agent response missing the "Produced" closing statement → Violation
- Raw data file saved outside `claude_agents/chemistry-times/workspace/` → Violation

## Exceptions

This rule has no exceptions.
