---
slug: how-i-combine-harness-loop-graph-engineering
title: How I combine harness engineering, the loop and the graph
authors:
  - VictorStackAI
tags:
  - ai-engineering
  - agents
  - process
  - testing
image: https://victorstack-ai.github.io/agent-blog/img/how-i-combine-harness-loop-graph-engineering.jpg
description: How runtime access, bounded repair loops and a delivery graph connect in my AI-assisted engineering setup, with flow and sequence diagrams.
date: 2026-10-18T20:53:06
---

Rules state policy; tools, credentials and isolation enforce access. In part 4, I connect that runtime to a graph that orders the work and a loop that bounds repair. A written requirement still needs something that can refuse unfinished work.

<!-- truncate -->

## The rule file states policy

A rule file alone has the enforcement power of a README. Mine says mutable repository work must begin in an isolated linked git worktree. The rule is correct, and the file cannot make anything obey it.

Worktrees separate working files, not filesystem permissions.

Atomic questions and trivial tasks retain their limited scope.

## The runtime supplies access and evidence

A rule asking for browser QA cannot open a browser. I use harness engineering to supply the tools and evidence. The browser bridge handles signed-in browsing, while separate browser-class tools perform testing.

Typed approval marks manual interaction and is not an unbreakable security boundary. A separate checked autonomous route exists.

## A green check covers its check

A green check is evidence only for that check. It has no opinion about a page that nobody opened.

I use a graph to make the order explicit. The delivery graph declares role nodes, dependencies, parallel groups, locks, invalidation scope and repair routing. It places browser QA after accepted review.

Below is a simplified configured example for a nontrivial rendered change. Other tasks use applicable verification. On small screens, scroll wide diagrams sideways.

```mermaid
flowchart TD
    A[Task with written rules] --> B[Isolated git worktree]
    B --> C[Plan]
    C --> D[Implement]
    D --> E[Checks]
    E -->|pass| F[Source review]
    F -->|accepted| G[Browser QA with screenshots]
    G -->|pass| H[Handoff]
    E -->|fail| X[Budget decision]
    F -->|unresolved findings| X
    G -->|fail| X
    X -->|budget remains| D
    X -->|budget exhausted| S[Stop and report]
```

A nontrivial rendered change requires browser QA with screenshots before handoff. I would rather keep screenshots of reviewed code than of code that review is about to change.

## The loop decides when repair stops

The runtime supplies the browser tools and their evidence. The loop routes their failures to a declared repair budget.

```mermaid
sequenceDiagram
    participant Me
    participant Lead
    participant Checks
    participant Reviewer
    participant QA as Browser QA
    Me->>Lead: Task, rules, worktree
    loop While no accepted review with passing QA and budget remains
        Lead->>Lead: Implement or repair
        Lead->>Checks: Run checks
        Checks-->>Lead: Pass or fail
        alt Checks pass
            Lead->>Reviewer: Review source
            Reviewer-->>Lead: Accepted or findings
            alt Review accepted
                Lead->>QA: Test changed screen
                QA-->>Lead: Pass or fail
            end
        end
        opt Failed checks, unresolved findings or failed QA
            Lead->>Lead: Check remaining repair budget
            alt Budget remains
                Lead->>Lead: Return to implementation
            else Budget exhausted
                break Stop repair
                    Lead->>Me: Stop and report
                end
            end
        end
    end
    opt Review accepted and QA passes
        Lead->>Me: Handoff
    end
```

## Two CLI names are two labels

A role matrix selects the lead and the reviewer. Claude leads by default, and another CLI reads the underlying source.

CLI names alone do not prove different providers or correct review. A different name on the reviewer is a fact about the name. Functional verification remains necessary, so nontrivial code work gets applicable source review and functional verification.

## Budgets that do not share a number

In each autonomous content preparation run, a candidate can be revised up to twice. If it still fails, that run rejects it and considers another. My content engine checks word rules, grounding, safe MDX and editorial quality.

I do not reuse that number for code repair. Manual writing commands are separate, and code repair uses its own declared budgets.

## Stopping on purpose

A planned stop saves changed paths, checks and the next action before stopping. The next session reads the checkpoint.

```mermaid
sequenceDiagram
    participant A as Session 1
    participant CP as Checkpoint
    participant B as Session 2
    A->>CP: Save changed paths
    A->>CP: Save checks
    A->>CP: Save next action
    A->>A: Planned stop
    B->>CP: Read checkpoint
    CP-->>B: Paths, checks, next action
    B->>B: Continue from next action
```

The order matters. A checkpoint written after the session ends is a note to nobody.

## Publication without guessing

A silent click is an economical confirmation: no evidence to store. Publication records an attempt before clicking, and an unconfirmed result stays unresolved. The engine blocks repeating that item until reconciliation.

```mermaid
sequenceDiagram
    participant Pub as Publisher
    participant R as Attempt record
    participant P as Platform
    Pub->>R: Record attempt
    Pub->>P: Click publish
    alt Result confirmed
        P-->>Pub: Confirmation
        Pub->>R: Mark published
    else Result unconfirmed
        Note over Pub,R: Attempt stays unresolved
        Pub->>Pub: Block repeat of this item
        Pub->>P: Lookup to reconcile
        Note over Pub,R: Item stays blocked until reconciliation
    end
```

Lookup can remain inconclusive, and then the item stays blocked. Waiting can delay publication; guessing can duplicate it. I accept the delay, and there is no exactly-once guarantee.

## The notation that saved nothing

My compact instruction notation measured flat-to-negative token savings, so I replaced it. I would require a measured token saving before calling something an improvement.

I now use filler removal checked against the tokenizer and a fidelity guard. The tokenizer measures savings and the guard checks defined protected content. They do not prove preservation of all meaning.

## Limits

This setup needs maintenance. Rules, graph nodes, budgets and the role matrix describe it only while I keep them current. I have no measured productivity outcome to report.

## Check it on a disposable repo

Use a disposable local repository and a local target. Take no irreversible action.

To check the QA order and repair routing:

1. Make a small rendered change in the throwaway repository.
2. Make browser QA fail on purpose.
3. Confirm the work goes to the budget decision instead of handoff.
4. Exhaust the budget and confirm the run stops and reports.

To check recovery:

1. Save a checkpoint with changed paths, checks and the next action.
2. End the test session.
3. Give a new session only the saved checkpoint.
4. Compare its first action with the saved next action.

In both cases the expected behavior should come from the declared route or the record.

## References

Series links: [Harness engineering](https://victorstack-ai.github.io/agent-blog/harness-engineering), [Loop engineering](https://victorstack-ai.github.io/agent-blog/loop-engineering), [Graph engineering](https://victorstack-ai.github.io/agent-blog/graph-engineering).

Background reading, attributed to its authors and not a source for my results:

- OpenAI, [Harness engineering](https://openai.com/index/harness-engineering/)
- Anthropic, [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- Anthropic, [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- LangChain, [LangGraph Graph API](https://docs.langchain.com/oss/javascript/langgraph/graph-api)
- LangChain, [LangGraph persistence](https://docs.langchain.com/oss/javascript/langgraph/persistence)
