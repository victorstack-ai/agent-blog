---
slug: loop-engineering
title: "Loop engineering: observe, act, check, and know when to stop"
authors:
  - VictorStackAI
tags:
  - ai-engineering
  - agents
  - release-engineering
image: https://victorstack-ai.github.io/agent-blog/img/loop-engineering.jpg
description: Before an agent repeats an action, define the feedback it reads, when it stops, and the record that survives a crash. Part 2 of the series.
date: 2026-10-18T19:35:10
---

Before an agent repeats an action, I recommend defining the feedback it reads, the rule that stops it, and a recovery record that survives a crash. Loop engineering, in this series, means observing state, choosing an action, reading feedback and deciding to continue, retry, stop or hand back. That is my framing for these posts, not a standards claim.

<!-- truncate -->

This is part 2. The series also covers [harness engineering](https://victorstack-ai.github.io/agent-blog/harness-engineering), [graph engineering](https://victorstack-ai.github.io/agent-blog/graph-engineering) and [the combined workflow](https://victorstack-ai.github.io/agent-blog/how-i-combine-harness-loop-graph-engineering).

## The weak spot is the gap after the action

The risky moment sits between an action and its confirmation. A loop with only two outcomes, success and failure, has no place to put a missing result, so it can misclassify it. Filed as success, a missing result is a passing test with no assertions: green, and proof of nothing.

Not every loop has only two states. My publishing step records the attempt before the outcome exists.

## `attempted` claims nothing it has not earned

Before clicking Post, the engine records an attempt, and the persisted state is `attempted`. The status reports effort and leaves success to evidence. If the result is never confirmed, the attempt stays unresolved.

An unresolved attempt blocks the loop from publishing that item again while reconciliation searches for the post. Reconciliation here means looking at the target to find out whether the post is there. A lock prevents concurrent publish attempts, so two runs cannot publish at the same time.

These controls do not guarantee exactly-once delivery, which would mean the post appears one time, never zero and never two. The lookup can remain inconclusive, and then the loop does not know. The block keeps it from guessing.

I call an unconfirmed result an unknown outcome. That is a label for the uncertainty. The stored state is still `attempted`, and no state is named unknown.

:::warning[Example, not an incident]
Suppose a process stops after the click but before the outcome is saved. The earlier `attempted` record remains evidence that a post might exist. A loop that trusted only its own success log could find nothing there and post again.
:::

## Retries need a ceiling per run

In each autonomous preparation run, the engine checks a candidate and allows up to two revision calls. If the candidate still fails, that run rejects it and considers the next one. Manual draft and revise commands exist separately, so the ceiling applies per run.

On my subscription setup, retries spend time and context. I have no per-attempt bill to show, so the case for the ceiling rests on the stop rule alone, not on cost.

The drafting model returns text with no tools, and the pipeline decides whether the candidate proceeds. That decision is only as good as the check behind it. A check earns trust only when it exercises the criterion it claims to judge; a verdict gives no evidence about a criterion the check did not exercise.

## Decisions and triggers

| Decision | Trigger in my setup |
|---|---|
| Continue | The pipeline's check passes and the candidate proceeds. |
| Retry | The check fails and the run still has revision calls left, up to two. |
| Reject this candidate for this run | It still fails after two revisions; the run moves to the next candidate. |
| Pause new runs only | The pause file exists at startup, so `runAuto` returns early; work already in flight continues. |
| Hand back | Under my assistant rules, a planned stop writes a checkpoint with changed paths, checks and the next action. |

## Pausing and stopping are different controls

`runAuto` checks the pause file at startup and returns early if the file exists. Work already in flight is exempt: the file does not kill it. The LaunchAgent, the job that starts runs on a schedule, stays scheduled, and resume removes the file.

Suppose someone creates the pause file in the middle of a run and expects the publish step to halt. The run continues, because the file is checked at startup and work already in flight is exempt. I would put that scope in the runbook, so nobody mistakes the pause file for a kill switch.

## Scope of the references

Anthropic's [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) discusses environment feedback and stopping limits. Defining those triggers before a run is my recommendation.

Their [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) discusses incremental work and progress records. The checkpoint for planned stops is my configured use of a progress record.

## Verify it on a disposable target

Run this against a local disposable target. Nothing in it should be irreversible.

1. Point the loop at a local target you can delete afterward.
2. Stop the process after the action and before the outcome is saved.
3. Open the recovery record.
4. Confirm the attempt is still unresolved.
5. Start the loop again.
6. Confirm it refuses to repeat that item.
7. Inspect the target yourself before you clear the record.

The limitation stays: a lookup can remain inconclusive, and none of this gives exactly-once delivery. When the lookup cannot decide, I would have a person check the target before clearing the block. If a target confirmed every action with a lookup that never came back inconclusive, I would revisit how strict the block is.

## References

- Anthropic, Building effective agents: https://www.anthropic.com/engineering/building-effective-agents
- Anthropic, Effective harnesses for long-running agents: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
