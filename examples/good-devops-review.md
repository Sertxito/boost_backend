# Good Devops Review Example

## Scenario

A backend team deploys multiple services through a single pipeline with minimal release controls and limited observability on deployment outcomes.

## User Request

```text
Review our backend CI/CD and deployment process, then prioritize reliability and rollback risks.
```

## Expected Reasoning Inputs

- Specs used:
  - specs/devops.md
  - specs/testing.md
  - specs/observability.md
- Skills used:
  - skills/devops-review/SKILL.md
  - skills/release-review/SKILL.md
- Providers used:
  - pipeline-analysis
  - document-search
- Project knowledge:
  - Pipeline configuration, deployment stages, and release notes process.

## Good Output Example

Summary:
The pipeline delivers fast, but lacks key release safety controls and rollback readiness for production incidents.

Findings:

- Production deployment runs automatically after merge with no approval gate.
- No smoke tests are executed post-deploy before traffic is fully shifted.
- Rollback procedure is manual and undocumented for two critical services.

Impact:

- A single faulty merge can impact all tenants quickly.
- Mean time to recovery increases during incidents.
- Release confidence decreases, causing delivery friction.

Evidence:

- Pipeline stages show build/test/deploy without environment gate between staging and production.
- Deployment workflow has no post-release verification step.
- Runbooks do not include validated rollback command set.

Recommended next actions:

1. Add protected promotion gate from staging to production.
2. Add smoke-test stage and fail-fast rollback trigger.
3. Codify rollback runbooks and verify them in quarterly game days.

## Why This Is Good

- It evaluates operational risk, not just pipeline syntax.
- It produces prioritized controls with measurable reliability impact.
