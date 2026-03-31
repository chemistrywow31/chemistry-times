---
name: Context Management
description: Prevent context bloat through summary-based reporting, file-based data transfer, and worklog-based context recovery
---

# Context Management

## Applicability

- Applies to: All agents

## Rule Content

### Task Scoping

Editor-in-Chief must break all work into focused subtasks, one objective per agent invocation. A single Task call must not combine multiple unrelated objectives.

### Coordinator Dispatch Format

Every Task dispatch from Editor-in-Chief must include:
1. **Current worklog path**: The directory for this phase's outputs
2. **Upstream reference paths**: Paths to relevant upstream worklog files
3. **Task scope summary**: Concise description of what this task must accomplish

Variable data in dispatches must be wrapped in descriptive XML tags to separate data from instructions.

### Agent Return Format

Every agent must return a structured summary:

```
## Task Completion: {task name}
### Status: {DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT}
### Key Outcomes
- {Outcome 1}
### Artifacts Produced
- {file path}: {description}
### Issues (if any)
- {Issue and suggested resolution}
```

### Summary-Only Reporting

Agents must report results as summaries of maximum 500 words. You must not paste raw scraped content, full article text, or unprocessed data into messages.

### File-Based Raw Data Transfer

Any content exceeding 200 words must be written to a file under `workspace/` and referenced by absolute file path in the message.

### Task Bookends

Every agent must include:
- **At start**: "Received from {agent}: {one sentence describing input}."
- **At end**: "Produced: {description} — saved to {path} / summarized above."

### Completion Status Protocol

- **DONE**: All steps completed successfully.
- **DONE_WITH_CONCERNS**: Completed with issues the coordinator must evaluate.
- **BLOCKED**: Cannot proceed after 3 attempts. State what failed and what is needed.
- **NEEDS_CONTEXT**: Missing information required to continue.

## Violation Determination

- Agent pastes more than 200 words of raw content without saving to file -> Violation
- Single Task call contains two or more unrelated objectives -> Violation
- Agent response missing task bookend statements -> Violation
- Coordinator dispatches without worklog path -> Violation

## Exceptions

- This rule has no exceptions.
