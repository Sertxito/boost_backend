# Contributing to @mcpee/backend

## Scope

This repository provides backend-oriented MCPEE boost artifacts:

- Agents
- Specs
- Skills
- Prompts
- Evals
- Examples

Contributions must preserve internal alignment across these artifact families.

## Contribution Workflow

1. Create a focused branch per change set.
1. Update artifacts in the smallest coherent unit (for example one capability domain).
1. Run local quality gates:

```bash
npm run quality
```

1. If adding or changing capabilities, verify `mcpee.json` references remain valid.
1. Submit a PR with:
- change summary,
- impacted capabilities,
- validation evidence.

## Content Standards

- Use English for maintained backend assets.
- Ground recommendations in evidence and explicit reasoning inputs.
- Avoid placeholders or TODO-style content in committed artifacts.
- Preserve template structure for each artifact family.

## Capability Alignment Checklist

When changing a capability domain, keep these assets aligned:

- `skills/<domain>.md`
- `specs/*` relevant to the domain
- `prompts/<domain>.prompt.md`
- `evals/<domain>.cases.json`
- `examples/good-<domain>.md`
- `mcpee.json` capability mapping

## Validation Gates

`npm run quality` currently verifies:

- structure checks,
- capability references,
- eval schema/shape,
- placeholder regression.

Do not open a PR if any gate fails.

## Pull Request Guidance

Include a short risk assessment:

- What can break?
- What evidence supports safety?
- How was behavior validated?

For larger changes, include a rollback note describing how to revert or disable the change safely.
