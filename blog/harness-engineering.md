---
slug: harness-engineering
title: "Harness engineering: check context and proof before the model"
authors:
  - VictorStackAI
tags:
  - ai-engineering
  - agents
  - testing
image: https://victorstack-ai.github.io/agent-blog/img/harness-engineering.jpg
description: Before changing models, check the context the runtime supplies and whether the completion check can fail. Part 1 on harness engineering.
date: 2026-10-18T19:34:26
---

A check that passes with its criterion unmet is a no-op with a status code. In harness engineering, I recommend checking context and completion evidence before changing models. I have not measured how often context is the cause, and a better model could change the result.

<!-- truncate -->

## What the runtime supplies

For a failing task, I would list the context, tools, access controls and testable criterion the runtime supplied. Check whether each was present before comparing models.

Two published reports describe this layer. OpenAI's [Harness engineering](https://openai.com/index/harness-engineering/) describes repository knowledge and mechanically enforced architectural constraints. Anthropic's [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) describes progress records and browser verification.

These are their reports, not my results. My publication checks target different conditions from architectural dependency rules, so I do not borrow their outcomes.

## Configuration describes intent

My assistant rules reject a silent exit 0 or empty reviewer output as acceptance evidence. The rule has completed the part of enforcement that involves being written down. I still need evidence the runtime enforces it.

| Mechanism | What it does | What it does not do |
|---|---|---|
| Assistant rules | Express intended policy on acceptance evidence | Prove enforcement |
| Typed terminal phrase | Marks deliberate manual interaction | Prevent automation or act as a security boundary |
| `git worktree` | Separates working copies and keeps main on its integration branch | Restrict filesystem access |

Typing the phrase is also within a script's skill set. I would put access limits in tools, credentials or isolation.

## Generation returns text

My content engine's subscription model call returns text with no tools. Claiming completion in that call is still a writing task. Drafts must pass word lint, grounding, safe MDX and editorial review before autonomous approval.

## Make the check fail first

Configuration and a verified result are different things. A check must test the specific task criterion, and a passing check is evidence only for that check.

The test I recommend runs on a local test target. Leave one criterion unmet on purpose, then run the check that covers it. An exit 0 there reveals a defective check.

For a rendered change, I recommend browser interactions as the check. A clean build is evidence about the build.

Repeat the unmet-criterion test for each criterion that matters. Context needs separate inspection.

The evidence that would change my mind is narrow. If a model change fixes a result while the context and the checks stay fixed, the model was the variable. That is the comparison I would want before switching.

## References

- OpenAI, [Harness engineering](https://openai.com/index/harness-engineering/)
- Anthropic, [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)

Series links: [loop engineering](https://victorstack-ai.github.io/agent-blog/loop-engineering), [graph engineering](https://victorstack-ai.github.io/agent-blog/graph-engineering) and [the combined workflow](https://victorstack-ai.github.io/agent-blog/how-i-combine-harness-loop-graph-engineering).
