---
slug: agentic-ai-without-vibe-coding
title: "Stop Vibe Coding Your AI Agents: Test Them Like Software"
authors: [VictorStackAI]
description: "Vibe coding gives an AI agent a good demo and a fragile production life. Modular structure, mocked LLM calls and tests written first fix that."
tags: [ai-engineering, agents, testing, python]
image: https://victorstack-ai.github.io/agent-blog/img/vs-social-card.png
date: 2026-02-21T10:00:00
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Vibe coding an AI agent means you tweak a prompt, rerun it and ship when the output feels right. The feeling is the only check, and it does not run in CI. I build agents the way I build any other software: modular code, mocked dependencies and tests written before the logic.

<!-- truncate -->

<details>
<summary>TL;DR</summary>

- Split agent logic, the LLM service and configuration into separate modules.
- Mock the LLM in unit tests. They should never make a real API call.
- Version prompts, keep model names and keys in config, and test the error paths.
- Connect real services only after the tests pass against mocks.

</details>

## What vibe coding looks like

Agentic AI moves fast. A few lines of code and a powerful LLM, and an agent is doing something that looks impressive. The iteration loop is addictive, and that is where the trouble starts.

My definition of vibe coding: development without a clear structure, relying on intuition and manual spot-checks.

:::info[Context]
I see this pattern in every team adopting AI agents. The first prototype is fast and impressive. Then it breaks in production because nobody wrote tests, nobody versioned the prompts and nobody knows what the agent does with unexpected inputs.
:::

| Vibe Coding Symptom | What Goes Wrong |
|---|---|
| Monolithic code | Agent logic, prompts and API calls live tangled in one script |
| No tests | Verification means running the agent and eyeballing the output |
| Fragile prompts | Prompts are magic strings with no versioning and no evaluation |
| Hidden risks | No boundaries and no tests for unexpected inputs or model changes |

In this setup, the test suite is one person reading output and nodding. It covers every input that person thought to try. The replacement is a test file that runs the same checks on every change, including the unexpected inputs.

Without that replacement, the agent is brittle, only its author can maintain it and nobody should trust it in production.

## The engineering-first workflow

The order matters. Real services come in only after the tests pass against mocks, and end-to-end tests come before deploy.

```mermaid
flowchart TD
    A[Define Requirements] --> B[Create Modular Structure]
    B --> C[Develop Core Logic]
    C --> D[Write Unit Tests]
    D --> E[Mock Dependencies]
    E --> F{Tests Pass?}
    F -->|Yes| G[Integrate Real Services]
    F -->|No| C
    G --> H[End-to-End Testing]
    H --> I[Deploy and Monitor]
```

<Tabs>
<TabItem value="project" label="Project Structure">

The project keeps each concern in its own file. The agent logic is in `agent.py`, the LLM call is in `llm_service.py` and the tests are under `tests/`:

```text title="structured-agent-example/" showLineNumbers
structured-agent-example/
├── pyproject.toml      # Project definition and dependencies
├── README.md
├── src/
│   └── structured_agent_example/
│       ├── __init__.py
│       ├── agent.py        # Core agent logic
│       └── llm_service.py  # Mocked external service
└── tests/
└── test_agent.py     # Unit tests for the agent
```

</TabItem>
<TabItem value="test" label="A Sample Test">

This test uses Python's `unittest.mock` to check the agent's behavior without calling a real LLM:

```python title="tests/test_agent.py" showLineNumbers
@patch('structured_agent_example.llm_service.get_sentiment')
def test_run_positive_sentiment(self, mock_get_sentiment):
"""Tests the agent's run method with a mock."""
# Configure the mock to return a specific value
mock_get_sentiment.return_value = "positive"

agent = SentimentAgent({"model_name": "test-model-v1"})
text = "This is a great product, I love it!"
# highlight-next-line
result = agent.run(text)

# Assert that our mock was called correctly
mock_get_sentiment.assert_called_once_with(text, model="test-model-v1")

# Assert that the agent processed the result correctly
self.assertEqual(result["status"], "success")
self.assertEqual(result["sentiment"], "positive")
```

This test checks the agent's internal logic: it passes the right model name, and it turns the service's answer into the right result. It says nothing about the LLM's accuracy, and that is by design.

</TabItem>
</Tabs>

## Vibe coding next to engineering-first

The gap is widest on failure handling. One column has explicit error paths. The other column has a plan.

| Aspect | Vibe Coding | Engineering-First |
|---|---|---|
| Structure | Single script | Modular components |
| Testing | Manual spot-checks | Automated unit and integration tests |
| Dependencies | Direct API calls everywhere | Mocked, injectable services |
| Prompts | Hardcoded magic strings | Versioned, evaluated, configurable |
| Configuration | Env vars scattered across the code | Config as code (YAML or .env) |
| Failure handling | Hope it works | Explicit error paths |
| Maintainability | Only the author understands it | Any engineer can contribute |

"Hope it works" has one advantage: it needs no configuration file. It also needs no tests, which is how it ends up in production. My call is to write the error paths down and test them, even in a script this small.

```mermaid
quadrantChart
    title Vibe Coding vs Engineering: Effort vs Reliability
    x-axis Low Effort --> High Effort
    y-axis Low Reliability --> High Reliability
    Vibe Coding Demo: [0.15, 0.3]
    Vibe Coding Production: [0.2, 0.1]
    Engineering Demo: [0.4, 0.6]
    Engineering Production: [0.6, 0.9]
    Vibe with Tests Bolted On: [0.5, 0.35]
```

The chart shows the same split as effort against reliability. Tests bolted onto a vibe-coded script after the fact cost more effort and still buy little reliability. The structure has to come first for the tests to be worth writing.

:::caution[Reality Check]
"Structure is freedom" sounds like a platitude until you debug a production agent at 2 AM. At that point you find out the prompt changed three times, nobody updated the mock and nobody ever tested the error handling path. Structure built up front pays for itself on the first incident.
:::

## The four principles

Each principle removes one symptom from the first table. None of them is specific to AI.

<details>
<summary>The four principles in detail</summary>

1. **Modular structure**: Separate the agent's main logic, the services that call external APIs such as LLMs, and the configuration. Each piece should be testable on its own.

2. **Test-driven development (TDD)**: Write the tests that define what the agent should do before writing its core logic. This forces decisions about edge cases and expected outcomes before implementation.

3. **Mocking dependencies**: Agent tests should never make real API calls. Mocking libraries simulate LLM behavior, so tests stay fast, predictable and free.

4. **Configuration as code**: Hardcoded model names, API keys and prompts are a liability. Configuration files (YAML or .env) change behavior per environment without code changes.

</details>

## Checklist before an agent ships

- [ ] Agent logic, the LLM service and configuration live in separate modules.
- [ ] Tests define the expected behavior before the core logic exists.
- [ ] No unit test makes a real API call.
- [ ] Prompts are versioned and evaluated.
- [ ] Model names, API keys and prompts live in YAML or .env files.
- [ ] Error paths and unexpected inputs have tests.
- [ ] Real services are connected only after the tests pass, then end-to-end tests run, then the agent is deployed and monitored.

## What I learned

- **Structure is freedom.** Good structure does not slow me down. It makes the code clearer to reason about and safer to change.
- **Unit tests check the agent.** They cover its logic, error handling and data transformations. The intelligence of the LLM is a different question.
- **Start small.** Modularity and testing apply to the simplest agent too. My example project is under 50 lines of Python.
- Software engineering lessons still apply to AI systems. "It works on my machine" is not a deployment strategy.

## References

- [View Code: `structured-agent-example` on GitHub](https://github.com/victorstack-ai/structured-agent-example)
