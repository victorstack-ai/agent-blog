---
title: "Vault Sprawl in Multi-Team CI/CD: A Secrets Governance Model"
slug: 2026-02-25-vault-sprawl-secrets-governance-model
authors: [VictorStackAI]
tags: [security, devops, ci-cd]
date: 2026-02-25T13:40:00
description: "Vault sprawl in multi-team CI/CD comes from weak governance. My model: OIDC identity, team-owned paths, policy as code, rotation enforced in CI."
image: https://victorstack-ai.github.io/agent-blog/img/vs-social-card.png
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Vault sprawl in multi-team CI/CD usually comes from weak governance, and another tool will not fix it. The model that works has four parts: short-lived identity-based access (OIDC/workload identity), path ownership boundaries, policy as code with review gates, and rotation and usage controls that each team can measure. If you change only one thing, replace stored CI tokens with OIDC and short-lived credentials.

<!-- truncate -->

## Four ways secrets sprawl

Secrets sprawl is what happens when access to secrets grows faster than anyone's record of who owns it. As teams scale, it drifts into the same four patterns. *Blast radius* in the table means how much one leaked credential or one misconfigured pipeline can reach.

| Sprawl pattern | What breaks | Typical incident |
|---|---|---|
| One shared Vault namespace for many teams | No clear owner, wide blast radius | Team A pipeline can read Team B secrets |
| Long-lived CI tokens in repo or org secrets | Rotations lag, leaked credentials stay valid | An exposed token keeps working for weeks |
| Inconsistent secret paths and names | Automation and auditing become fragile | Rotation scripts miss critical paths |
| Manual exceptions outside policy review | Shadow access accumulates | Emergency grants are never removed |

The shared namespace is the clearest case. Every team's secrets become readable by every other team's pipeline, which is one way to make cross-team collaboration mandatory.

:::danger[Blast radius]
Kubernetes guidance still warns that native secrets can be mishandled without encryption at rest and strict RBAC (role-based access control). CI has the same problem: with weak identity and policy, a secret store becomes a high-value failure hub instead of a control.
:::

My first fix would be the long-lived tokens. A leaked token that keeps working for weeks is a rotation failure first and a leak second.

## The governance blueprint

Every standard needs an enforcement point in CI. A rule that lives only in a wiki is a suggestion.

Three terms appear in the table. **OIDC** (OpenID Connect) lets a CI job prove its identity and receive a temporary credential, so no stored password is needed. **TTL** (time to live) is how long a credential stays valid, and a **rotation SLA** is the agreed maximum time before a secret must be replaced.

| Control plane | Standard | Enforce in CI |
|---|---|---|
| Identity | OIDC or workload identity only for CI | Block static token auth in pipelines |
| Authorization | Team-scoped Vault paths plus least privilege | Validate policy diffs on each PR |
| Lifecycle | TTL defaults, a max TTL and a mandatory rotation SLA | Fail builds when owner or rotation metadata is expired |
| Observability | Audit logs mapped to repo, team and service | Daily drift report to platform and team owners |

A drift report compares the access that exists with the access the reviewed policy allows. In this model it goes out daily to both the platform and the team owners.

### Reference policy contract

The policy grants one team read access to its own paths and nothing else. The workflow requests an identity token instead of carrying a stored one.

<Tabs>
<TabItem value="vault" label="Vault Policy (HCL)" default>

```hcl title="vault/policies/team-payments-ci.hcl" showLineNumbers
# highlight-start
path "kv/data/payments/prod/*" {
  capabilities = ["read"]
}
# highlight-end

path "database/creds/payments-ci" {
  capabilities = ["read"]
}
```

</TabItem>
<TabItem value="github" label="GitHub Actions Workflow">

```yaml title=".github/workflows/deploy.yml" showLineNumbers
permissions:
  # highlight-next-line
  id-token: write
  contents: read
```

The `id-token: write` permission lets GitHub Actions mint OIDC tokens. Short-lived exchanges replace stored long-lived cloud and Vault credentials.

</TabItem>
</Tabs>

The highlighted block is the ownership boundary: the payments CI job reads `kv/data/payments/prod/*` and has no path into another team's prefix. Note the capability is `read` only, so the pipeline cannot rewrite the secrets it consumes.

### Migration from the deprecated pattern

A `VAULT_TOKEN` stored as a repo secret lives exactly as long as someone remembers to rotate it. The replacement removes the stored token and lets a bounded TTL do the remembering.

```diff
- # Deprecated: static CI secrets for Vault/cloud auth
- env:
-   VAULT_TOKEN: ${{ secrets.VAULT_TOKEN }}
+ # Replacement: OIDC federation + dynamic secrets + bounded TTL
+ permissions:
+   id-token: write
```

### OIDC authentication flow

The CI job presents its OIDC token, and Vault checks its claims, the statements inside the token about which job is asking. The credential Vault issues expires when its TTL runs out, so nobody has to remember to clean it up.

```mermaid
flowchart TD
    A[CI job starts] --> B[Request OIDC token]
    B --> C[Vault/JWT auth validates claims]
    C --> D[Issue short-lived token + dynamic secret]
    D --> E[Deploy workload]
    E --> F[Lease/token expires automatically]
```

### Secret lifecycle states

A missed rotation blocks CI builds. That is the point: the failure shows up in the pipeline instead of in an incident report. A rotation SLA written in documentation rotates nothing, so this model encodes it as a CI gate.

The cost is real: a team with an expired rotation cannot deploy until someone performs an emergency rotation and opens an incident ticket. I would accept that trade, because the other option is a credential nobody rotates.

```mermaid
stateDiagram-v2
    [*] --> Created: Team requests secret path
    Created --> Active: Policy reviewed + approved
    Active --> NearExpiry: Rotation SLA approaching
    NearExpiry --> Rotated: Automated rotation
    Rotated --> Active: New credential active
    NearExpiry --> Expired: Rotation missed
    Expired --> Blocked: CI builds fail
    Blocked --> Active: Emergency rotation + incident ticket
    Active --> Revoked: Team offboarded or path deprecated
    Revoked --> [*]
```

The way out of `Blocked` is an emergency rotation plus an incident ticket. The ticket keeps the emergency on record after the build is green again.

## Operating rules that prevent re-sprawl

An emergency grant with no expiry stops being an emergency and becomes the access model. These four rules keep ownership and expiry attached to every path.

1. One team owner for each secret path prefix (`kv/data/<team>/<env>/...`).
2. Every secret carries metadata: `owner`, `rotation_sla_days`, `source_system`.
3. PR checks reject policy changes without owner approval.
4. Any manual break-glass access (an emergency grant outside normal review) auto-expires and creates a follow-up ticket.

:::warning[Break-glass access]
Do not allow emergency policy exceptions in production without automatic expiry and a ticketed cleanup. Check it by listing active grants and confirming each one has an expiry and an open ticket.
:::

:::tip[Where to start]
Begin with the first checklist item: audit the static CI tokens across your repos. Every stored `VAULT_TOKEN` on that list is a credential to replace with OIDC before you add more tooling.
:::

## Migration checklist

- [ ] Audit all static CI tokens across repos
- [ ] Configure OIDC/workload identity for all CI pipelines
- [ ] Establish team-scoped Vault path ownership
- [ ] Write and review Vault policies as code
- [ ] Set TTL defaults and max TTL for all secret paths
- [ ] Add rotation SLA metadata to all secrets
- [ ] Configure CI to fail on expired owners/rotation metadata
- [ ] Set up daily drift reports for platform and team owners
- [x] Remove all static long-lived tokens from CI secrets

To verify the first item, search your workflow files for `VAULT_TOKEN` read from repo secrets and for jobs that get `id-token: write` neither in their own `permissions` block nor in the workflow-level one. Each `VAULT_TOKEN` hit is a stored credential that stays valid until a person rotates it. A job without `id-token: write` at either level that still reaches Vault or a cloud provider needs a second look: find out how it authenticates before you mark it compliant, because a stored secret is one possible answer.

<details>
<summary>Related posts</summary>

- Unprotected AI Agents Report
- [Multi-Agent Reliability Playbook](/2026-02-24-multi-agent-reliability-playbook-github-deep-dive/)
- [Agentic AI without vibe coding](/agentic-ai-without-vibe-coding/)

</details>

## References

- https://developer.hashicorp.com/vault/docs/updates/release-notes
- https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments
- https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/configuring-openid-connect-in-cloud-providers
- https://kubernetes.io/docs/concepts/security/secrets-good-practices
- https://kubernetes.io/docs/concepts/configuration/secret/
- https://developer.hashicorp.com/vault/docs/deploy/kubernetes/vso/csi
