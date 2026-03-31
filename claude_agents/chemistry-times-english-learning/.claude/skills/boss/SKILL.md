---
name: Boss
description: Entry point that spawns the Editor-in-Chief coordinator to run the full daily production pipeline
---

# Boss

Invoke this skill to start the ChemistryTimes daily production pipeline. It spawns the Editor-in-Chief coordinator who orchestrates all 13 agents through the complete workflow.

## Usage

```
/boss
/boss 今天重點：Apple AI 發表會、NVIDIA 財報
/boss breaking: OpenAI 發布 GPT-6
```

## Workflow

When invoked, this skill:
1. Spawns the Editor-in-Chief agent via the Agent tool
2. Passes any user-provided arguments as editorial context
3. Editor-in-Chief begins the daily production pipeline from Phase 1 (Topic Setting)

If no arguments are provided, Editor-in-Chief starts from scratch: reads source monitoring sheets, checks topic ledger, and begins the full pipeline.

## Instructions

Use the Agent tool to spawn the coordinator:

```
Agent tool call:
  subagent_type: editor-in-chief
  prompt: |
    Start the daily production pipeline for ChemistryTimes.

    <user_context>
    {any arguments the user provided, or "No specific editorial direction. Run the standard daily pipeline."}
    </user_context>

    Read the source monitoring sheets at workspace/source-monitoring-*.md and the topic ledger at workspace/topic-ledger.md.
    Follow the daily-production-pipeline skill for the complete workflow.
    Dispatch all agent tasks via the Task tool.
```
