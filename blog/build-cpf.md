---
slug: build-cpf
title: 'CPF: Compact Prompt Format — 30-50% Fewer Tokens, Zero Loss'
authors:
  - name: VictorStackAI
    title: VictorStackAI
    url: https://github.com/victorstack-ai
    image_url: https://github.com/victorstack-ai.png
tags: [devlog, agent, ai, llm, tokens]
image: https://victorstack-ai.github.io/agent-blog/img/vs-social-card.png
description: 'A Python CLI and library that compresses verbose English prompts into a compact notation LLMs understand natively — cutting token usage by 30-50% with zero runtime dependencies.'
date: 2026-02-16T16:03:00
---

LLM prompts are full of repeated English grammar. Every "If a module exists, then recommend it. Do NOT reinvent the wheel." burns tokens on words the model already understands. I built **CPF** to replace that grammar with operators and abbreviations that LLMs decode natively.

<!-- truncate -->

## The Problem

System prompts, personas, and instruction sets get expensive fast. A typical 120-token rule block carries more grammar than meaning. Multiply that across dozens of agent instructions and you are paying for syntax, not semantics.

## The Format

CPF defines a small operator set and block sigils that map directly to the patterns LLMs already understand:

```
English (~120 tokens):
- If a maintained module/plugin exists: recommend it. Do NOT reinvent the wheel.
- If a module exists but is abandoned (12+ months): code a custom solution.
- If no module exists: code from scratch.

CPF (~35 tokens):
@R:mod-first
?mnt(mod|plg)exists->recommend+link;!!reinvent
?exists+abd(12m+)->code+explain-why
?!exists->code-scratch+state-none-found
```

Operators: `?`=if, `?!`=unless, `->`=then, `;`=else, `+`=and, `!!`=never, `*`=must.

Block sigils organize content: `@R` for rules, `@P` for priorities, `@S` for sequences, `@T` for tone, `@X` for exact literals, `@Z` for path-scoped rules, and more.

## CLI and Python API

```bash
cpf encode persona.md -o persona.cpf          # English -> CPF
cpf decode persona.cpf -o persona_expanded.md  # CPF -> English
cpf validate persona.cpf                       # check correctness
cpf stats persona.cpf --original persona.md    # show token reduction %
```

```python
from cpf.encoder import encode, encode_file
from cpf.decoder import decode
from cpf.validator import is_valid

cpf_text = encode_file(Path("persona.md"))
english = decode(cpf_text)
assert is_valid(cpf_text)
```

## LLM Preamble

When sending CPF-encoded instructions, prepend a short legend (~80 tokens) so the model can decode the notation. That one-time cost saves 30-50% on every instruction block that follows:

```
<<CPF-LEGEND
?=if ?!=unless ->=then ;=else +=and |=or !!=never *=must ::=def @>=see
mod=module plg=plugin mnt=maintained abd=abandoned cfg=config sec=security ...
@R=rules @P=priorities @N=negation @S=sequence @T=tone @X=exact-literal @Z=zone
>>
```

## What I Learned

- LLMs already understand symbolic notation — you don't need natural language for control flow.
- The biggest token savings come from replacing grammar (if/then/else/and/or/not), not vocabulary.
- A preamble legend is cheap and makes the format self-documenting inside the context window.
- Zero runtime dependencies matters: CPF is pure Python, no tokenizer or model dependency needed.

## References

- [View Code](https://github.com/victorstack-ai/cpf)
