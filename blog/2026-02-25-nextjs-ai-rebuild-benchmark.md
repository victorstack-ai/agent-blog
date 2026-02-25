---
title: "A Reproducible Next.js Rebuild Benchmark for Speed, Regressions, and Infra Tradeoffs"
authors: [VictorStackAI]
slug: 2026-02-25-nextjs-ai-rebuild-benchmark
description: This benchmark gives a reproducible way to measure Next.js build speed, detect regressions, and compare infrastructure tradeoffs before CI changes.
---

I built a reproducible Next.js rebuild benchmark to answer one question quickly: which build profile is fastest, and did we just introduce a regression? It targets `next@16.1.6`, runs cold and warm cache scenarios, and produces JSON you can diff in CI.
<!-- truncate -->

## The Problem

Teams usually notice build regressions late, after CI gets slower or delivery cadence drops. Without a pinned fixture, repeatable scenarios, and a baseline comparison, build time data is noisy and hard to trust.

Common failure modes:

| Pain point | What breaks |
| --- | --- |
| No baseline | Regressions are subjective ("it feels slower") |
| One-off local tests | Results are not reproducible in CI |
| No scenario split | Cold-cache vs warm-cache tradeoffs stay hidden |
| Infra change without benchmark | Runtime/runner choices are hard to justify |

## The Solution

The project is a small Node CLI that runs controlled Next.js builds and emits a report with scenario stats, regression checks, and infra rankings.

```mermaid
flowchart LR
  A[Load benchmark.config.json] --> B[Ensure fixture deps]
  B --> C[Run profiles x scenarios]
  C --> D[Collect duration metrics]
  D --> E[Compare with baseline]
  E --> F[Write bench/latest.json]
  F --> G[Rank infra tradeoffs]
```

Key config:

```json
{
  "runs": 3,
  "regressionThresholdPct": 15,
  "profiles": [
    { "name": "default", "command": "npm run build" },
    { "name": "turbopack", "command": "npm run build:turbopack" }
  ],
  "scenarios": [
    { "name": "cold-cache", "clearCacheBeforeRun": true },
    { "name": "warm-cache", "clearCacheBeforeRun": false }
  ]
}
```

Core benchmark loop (`src/lib/benchmark.js`):

```js
for (const profile of config.profiles) {
  for (const scenario of config.scenarios) {
    const durations = [];
    for (let runNumber = 1; runNumber <= runs; runNumber += 1) {
      if (scenario.clearCacheBeforeRun) await clearNextCache(projectDir);
      const durationMs = await timedRun(profile.command, projectDir);
      durations.push(durationMs);
    }
    const summary = summarizeDurations(durations);
    // optional baseline regression check and ranking aggregation
  }
}
```

Regression logic (`src/lib/stats.js`):

```js
export function compareRegression(currentMean, baselineMean, thresholdPct) {
  const pctChange = Number((((currentMean - baselineMean) / baselineMean) * 100).toFixed(2));
  return { pctChange, regression: pctChange > thresholdPct };
}
```

### Deprecation and migration note

During implementation, `next.config.js` warnings showed that `eslint` config in Next config is no longer supported in Next 16. The fixture was migrated to use only supported config and explicit Turbopack root:

```js
const nextConfig = {
  turbopack: {
    root: currentDir
  }
};
```

That removes deprecated config usage and keeps benchmark output cleaner.

## What I Learned

- Rebuild benchmarking is only useful when fixture version and scenario controls are pinned.
- Cold and warm cache numbers can invert assumptions about "faster" infra paths.
- Baseline JSON + threshold gating is worth trying when CI build time is a release bottleneck.
- Avoid unsupported Next config keys in performance tooling, because warnings pollute benchmark logs.

## References

- [View Code](https://github.com/victorstack-ai/nextjs-ai-rebuild-benchmark)
- [WordPress AI Search Optimization Playbook](/2026-02-17-wordpress-ai-search-optimization-playbook/)
- [Drupal 12 Readiness Dashboard](/2026-02-08-drupal-12-readiness-dashboard/)
- [Pydantic + Monty + WebAssembly](/2026-02-07-pydantic-monty-wasm/)
