---
slug: build-cpf
title: 'CPF: Compact Prompt Format — 30-50% Fewer Tokens, Zero Loss'
authors: [VictorStackAI]
tags: [devlog, agent, ai, llm, tokens]
image: https://victorstack-ai.github.io/agent-blog/img/vs-social-card.png
description: 'A Python CLI and library that compresses verbose English prompts into a compact notation LLMs understand natively — cutting token usage by 30-50% with zero runtime dependencies.'
date: 2026-02-16T16:03:00
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

LLM prompts are full of repeated English grammar. Every "If a module exists, then recommend it. Do NOT reinvent the wheel." burns tokens on words the model already understands. I built **CPF** (Compact Prompt Format) to replace that grammar with operators and abbreviations that LLMs decode natively — cutting token costs by 30-50% with zero runtime dependencies.

<!-- truncate -->

## The Problem

System prompts, personas, and agent instruction sets get expensive fast. A typical 120-token rule block carries more grammar than meaning — "if", "then", "do not", "otherwise", "and also" — all filler that the model already understands from context. Multiply that across dozens of rules, priorities, tone directives, and scoped behaviors, and you are paying for syntax, not semantics.

I wanted a notation that:

1. LLMs already understand without fine-tuning (they process code, math operators, and shorthand every day)
2. Compresses the grammar, not the meaning
3. Has a clear structure — blocks, operators, abbreviations — so it is parseable, validatable, and round-trippable
4. Has zero runtime dependencies (no tokenizer, no model calls for encoding)

## The Schema

CPF is built on three layers: **operators** replace English grammar, **block sigils** organize content by type, and **abbreviations** compress vocabulary. Together they cut 30-50% of tokens while keeping full semantic fidelity.

### Document Structure

Every CPF document starts with a version header, optional metadata, and then blocks:

```
CPF|v1
M|<doc-id>|<title>|<source>|<timestamp>
---
@SIGIL:block-id
compressed content lines
```

The `CPF|v1` header tells the parser (and the LLM) which spec version to use. The `M|` metadata line is optional — it carries provenance info. The `---` separator divides metadata from content. Then blocks begin.

### Operators

Operators replace the most token-heavy part of prompts: English control flow. Here is the full operator table from `spec.py`:

| Symbol | Meaning | What it replaces |
|--------|---------|------------------|
| `?` | If / When | "If", "When" |
| `?!` | Unless / If not | "If not", "Unless" |
| `->` | Then | "then", "do", "proceed to" |
| `;` | Else | "otherwise", "else" |
| `+` | And | "and", "also", "additionally" |
| `\|` | Or | "or", "alternatively" |
| `!!` | Never | "do NOT", "never", "must not" |
| `*` | Must / Important | "must", "required", "important" |
| `::` | Defined as | "means", "is defined as" |
| `@>` | See / Refer to | "see", "refer to", "as described in" |
| `=>` | Produces | "results in", "produces", "yields" |
| `~` | Approximately | "approximately", "roughly", "about" |

The parser matches multi-character operators first (`?!`, `->`, `!!`, `::`, `@>`, `=>`) before single-character ones, so `?!exists` correctly parses as "unless exists" rather than "if" + "!exists".

**Before and after:**

```
English (~120 tokens):
- Before coding a custom solution, always check if a maintained module or plugin exists.
- If a maintained module/plugin exists: recommend it. Link to it. Do NOT reinvent the wheel.
- If a module exists but is abandoned (no updates in 12+ months): code a custom solution
  and explain why.
- If no module/plugin exists: code from scratch. State that none was found.

CPF (~35 tokens):
@R:mod-first
?mnt(mod|plg)exists->recommend+link;!!reinvent
?exists+abd(12m+)->code+explain-why
?!exists->code-scratch+state-none-found
```

That is a **~70% reduction** for this block. The grammar — "Before coding", "always check if", "Do NOT", "and explain" — becomes `?`, `->`, `!!`, `+`. The meaning is identical.

### Block Sigils

Blocks are the structural unit of CPF. Each sigil tells the LLM what kind of content follows — rules, priorities, sequences, tone, exact literals, or scoped zones:

| Sigil | Type | Use |
|-------|------|-----|
| `@R:id` | Rule | Conditional rules, decision logic, if/then/else blocks |
| `@P:id` | Priority | Ordered hierarchies — #1, #2, #3 |
| `@N:id` | Negation | "Do NOT" lists, forbidden actions |
| `@S:id` | Sequence | Ordered steps — workflows, pipelines |
| `@T:id` | Tone | Persona, voice, style, communication templates |
| `@X:id` | Exact | Literal strings that MUST appear verbatim (front matter, templates) |
| `@Z:id` | Zone | Path-scoped rules — "in this directory, do X" |
| `@C:id` | Constant | Reusable abbreviation definitions, variable bindings |
| `@B:id` | Blob | Heredoc passthrough (`<<`/`>>`) — content passed through without compression |

The `:id` suffix names the block so the LLM (and humans) can reference it. For example, `@R:mod-first` names a rule block "mod-first" and `@P:default-priorities` names a priority list.

**Priority block example:**

```
@P:default-priorities
#1 stab+sec
#2 perf+cch correctness
#3 Maintainability+standards compliance
#4 Automation safe+observable
#5 dx+doc
```

Compare to the English version:

```
Default priorities (in order):
1. Stability and security come first.
2. Performance and cache correctness are second priority.
3. Maintainability and standards compliance.
4. Automation that is safe and observable.
5. Developer experience and documentation.
```

**Zone block example:**

```
@Z:workspace-boundaries
`/Documents/work` — Read-only library. may read+learn from code here, but never modify.
`/Documents/things` — Forbidden. Never read, write,|run anything in folder.
```

Zones scope rules to filesystem paths. The LLM knows that rules under `@Z` only apply to the specified directories.

### Abbreviation System

The third layer replaces common vocabulary with short tokens. CPF ships with 100+ built-in abbreviations in `abbreviations.py`:

<Tabs>
  <TabItem value="common" label="Common">

| Full word | Abbreviation |
|-----------|-------------|
| module | mod |
| plugin | plg |
| maintained | mnt |
| abandoned | abd |
| configuration | cfg |
| security | sec |
| performance | perf |
| authentication | auth |
| permissions | perm |
| dependency | dep |
| function | fn |
| service | svc |
| cache | cch |
| context | ctx |

  </TabItem>
  <TabItem value="dev" label="Dev workflow">

| Full word | Abbreviation |
|-----------|-------------|
| repository | repo |
| template | tpl |
| environment | env |
| implementation | impl |
| version | ver |
| breaking | brk |
| deprecated | depr |
| pull request | pr |
| continuous integration | ci |
| developer experience | dx |
| production | prod |
| development | dev |

  </TabItem>
  <TabItem value="actions" label="Actions">

| Full word | Abbreviation |
|-----------|-------------|
| require | req |
| validate | val |
| sanitize | san |
| escape | esc |
| check | chk |
| update | upd |
| controller | ctrl |
| component | comp |
| middleware | mw |
| database | db |
| directory | dir |
| parameter | param |

  </TabItem>
</Tabs>

Custom abbreviations can be loaded from a JSON file and merged with the built-ins:

```python
from cpf.abbreviations import load_custom_abbreviations, merge_abbreviations, ENCODE_MAP, DECODE_MAP

custom_enc, custom_dec = load_custom_abbreviations(Path("my-abbrevs.json"))
merged_enc, merged_dec = merge_abbreviations(ENCODE_MAP, DECODE_MAP, custom_enc, custom_dec)
```

### Constants and Heredocs

`@C` blocks define reusable constants — like variables you can reference elsewhere:

```
@C:paths
$projects::/Users/victor/Projects
```

`@B` blocks use heredoc syntax (`<<`/`>>`) for content that should pass through without compression — useful for embedding raw templates, configs, or code blocks that must stay verbatim.

## Real-World Example: A Full Persona in CPF

Here is a shortened excerpt from a real persona file (`persona.cpf`) that encodes an entire agent style profile — personality, priorities, decision rules, engineering standards, and communication templates:

```
CPF|v1
M|persona-vs|Victorstack Style Profile|persona.md|2026-02-16T15:06:25Z
---

@C:paths
$projects::/Users/victor/Projects

@T:personality-and-working-approach
Pragmatic+execution-driven. Prefer shipping small, reliable increments over big rewrites
Reliability first. Avoid changes add operational risk without clear value
Evidence-based. Prefer decisions backed by logs, repro steps, metrics,|test result

@P:default-priorities
#1 stab+sec
#2 perf+cch correctness
#3 Maintainability+standards compliance
#4 Automation safe+observable
#5 dx+doc

@R:decision-rules
?uncertain->reduce scope+add observability before adding complexity
?change can break access->auth, routing, cch,|deployments, req explicit plan+rollback notes
!!broad dep upgrades unless task is explicitly upgrade

@R:git-and-pr-standards
Branch naming: `feature/<topic>`, `fix/<topic>`, `chore/<topic>`
Commit messages: imperative, specific, scoped
PR desc *include: Short recap, What changed, How to test, Risks+rollback notes
CI *green before merge

@T:communication-template-default
ctx: what problem 're solving
Change: what was done
Verification: how know works
Risk: what could break+how to rollback
Next: what's left|what to monitor
```

The full persona file is 152 lines. The equivalent English version would be 300+ lines and roughly double the tokens. The CPF version loads faster, fits more instructions into the same context window, and is easier to scan because the sigils and operators create a visual grammar.

## CLI and Python API

<Tabs>
  <TabItem value="cli" label="CLI">

```bash
cpf encode persona.md -o persona.cpf          # English -> CPF
cpf decode persona.cpf -o persona_expanded.md  # CPF -> English
cpf validate persona.cpf                       # check correctness
cpf stats persona.cpf --original persona.md    # show token reduction %
```

  </TabItem>
  <TabItem value="python" label="Python API">

```python
from cpf.encoder import encode, encode_file
from cpf.decoder import decode
from cpf.validator import is_valid

# Encode an English prompt file to CPF
cpf_text = encode_file(Path("persona.md"))

# Decode CPF back to English
english = decode(cpf_text)

# Validate CPF syntax
assert is_valid(cpf_text)
```

  </TabItem>
</Tabs>

The encoder reads English, applies operator substitutions, abbreviation compression, and block detection. The decoder reverses the process. The validator checks structural correctness (valid sigils, balanced heredocs, proper header). All pure Python, zero dependencies.

## LLM Preamble

When sending CPF-encoded instructions to an LLM, prepend a short legend so it can decode the notation:

```
<<CPF-LEGEND
?=if ?!=unless ->=then ;=else +=and |=or !!=never *=must ::=def @>=see
mod=module plg=plugin mnt=maintained abd=abandoned cfg=config sec=security ...
@R=rules @P=priorities @N=negation @S=sequence @T=tone @X=exact-literal @Z=zone
>>
```

The preamble costs ~80 tokens once. Every instruction block after it saves 30-50%. For a persona with 20+ rule blocks, the preamble pays for itself immediately.

:::tip
You do not need the preamble for models that have seen CPF-style notation in training. Most modern LLMs (Claude, GPT-4, Gemini) handle operators like `?`, `->`, `!!` natively. The preamble is a safety net — it makes the format self-documenting inside the context window.
:::

## What I Learned

- **LLMs already understand symbolic notation.** You do not need natural language for control flow. Models parse `?condition->action;fallback` as easily as "If condition, then action, otherwise fallback" — they see this pattern in every programming language they trained on.
- **The biggest savings come from grammar, not vocabulary.** Replacing "if/then/else/and/or/not" with `?/->/;/+/|/!!` accounts for most of the 30-50% reduction. Abbreviations (mod, plg, cfg) add another 5-10%.
- **Block sigils create scannable structure.** When an LLM sees `@R:` it knows rules follow. `@T:` means tone. `@P:` means priorities. This is faster to parse than scanning paragraphs of English for intent.
- **A preamble legend is cheap insurance.** 80 tokens once, and the format becomes self-documenting. Worth it even when the model probably does not need it.
- **Round-trippability matters.** Being able to encode English to CPF and decode back means you can validate that nothing was lost. The encoder and decoder are inverses — that is the correctness guarantee.
- **Zero runtime dependencies matters.** CPF is pure Python. No tokenizer calls, no model dependencies, no API keys needed for encoding. It runs anywhere Python runs.

## References

- [View Code](https://github.com/victorstack-ai/cpf)
