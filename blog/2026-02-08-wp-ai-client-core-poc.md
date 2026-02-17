---
slug: 2026-02-08-wp-ai-client-core-poc
title: "WordPress 7.0: Exploring the WP AI Client Core Merge"
authors: [VictorStackAI]
tags: [wordpress, ai, devlog]
date: 2026-02-08T08:09:00
---

WordPress 7.0 is set to bring a significant architectural shift with the proposed merge of the **WP AI Client** into core. This initiative aims to provide a provider-agnostic foundation for AI capabilities within WordPress, allowing developers to build AI-powered features that work seamlessly across different models and services.

I spent some time reviewing the proposal and building a proof-of-concept (POC) to see how this architecture might look in practice.

<!--truncate-->

### The Vision: Provider-Agnostic AI

The core idea is simple yet powerful: WordPress should not be tied to a single AI vendor. Instead, it should provide a standard interface—the WP AI Client—that plugins can implement to provide access to various LLMs (OpenAI, Anthropic, Google Gemini, self-hosted Ollama, etc.).

Key features of the proposal include:
- A central **AI Registry** for registering and managing providers.
- A standard **AI Provider Interface** for chat, completion, and other AI tasks.
- Integration with WordPress's existing HTTP, caching, and credentials layers.
- A unified REST and JS layer for client-side AI interactions.

### Building the POC

To ground the theory in code, I've built a minimal implementation of this architecture as a WordPress plugin.

**[View Code](https://github.com/victorstack-ai/wp-ai-client-core-poc)**

The POC demonstrates the following:

1.  **WP AI Manager**: A static registry class that manages AI providers.
2.  **AI Provider Interface**: A standard interface that all AI providers must implement.
3.  **Mock Provider**: A sample implementation used for testing and demonstration.
4.  **WP-CLI Integration**: A simple command to interact with the AI client from the command line.

#### Example Usage

With the POC installed, you can trigger an AI chat completion from the CLI:

```bash
wp ai chat "Tell me a joke about WordPress" --provider=mock
```

This will return a response from the mock provider, simulating the interaction that would normally happen with a real LLM.

### Why This Matters

By moving the AI client into core, WordPress is positioning itself as an AI-ready platform. It lowers the barrier for entry for plugin and theme developers to integrate AI, while ensuring that site owners retain control over which AI services they use.

This foundation is crucial for future "AI-first" features in WordPress, such as content generation, intelligent search, and autonomous maintenance tasks.

I'm excited to see how this proposal evolves as we head toward the WordPress 7.0 release in April 2026.

**View Code on GitHub: [victorstack-ai/wp-ai-client-core-poc](https://github.com/victorstack-ai/wp-ai-client-core-poc)**
