# boost-backend

Official backend boost for GitHub Copilot. Standalone: agents, skills, prompts and instructions that Copilot discovers automatically.

## Overview

`boost-backend` ships reusable backend reasoning assets, including:

- architecture guidance
- API design patterns
- refactoring playbooks
- performance heuristics
- security review criteria
- testing standards
- data access guidance
- backend DevOps recommendations

## Prerequisites

- Node.js 20 or later
- npm 10 or later

## Quick Start

This boost is **self-contained**: it does not need any runtime, plugin or MCP server. One command copies its assets to the places where GitHub Copilot / VS Code discover them automatically.

```bash
# From the root of YOUR project
npx github:Sertxito/boost_backend
# or, once published on npm
npx boost-backend
```

| Asset | Installed into |
|---|---|
| Agents | `.github/agents/*.agent.md` |
| Skills | `.github/skills/<name>/SKILL.md` and `.agents/skills/<name>/SKILL.md` |
| Prompts | `.github/prompts/*.prompt.md` |
| Instructions | `.github/instructions/*.instructions.md` |
| Global instructions | `.github/copilot-instructions.md` (only if the project has none) |

Options: `--target <dir>`, `--force` (overwrite), `--dry-run`, `--no-agents-dir` (skip `.agents/skills`), `--check` (verify install), `--uninstall`.
Existing files are never overwritten without `--force`, so several boosts can coexist in the same project.

**Verify:** run `npx boost-backend --check`, reload VS Code (`Developer: Reload Window`), then type `@` in Copilot Chat (agents), `/` (prompts) and open the *Configure Tools / Skills* picker.

## Package Layout

```text
agents/       -> who acts
specs/        -> universal truths and non-negotiable guidance
skills/       -> operational procedures that can evolve
prompts/      -> runtime prompt composition per capability
instructions/ -> domain instructions reused by agents and skills
evals/        -> evaluation criteria and test cases
examples/     -> examples of high-quality outputs
docs/         -> package documentation and contribution guides
```

## Mental Model

```text
Agent   = who I am
Spec    = what I know
Skill   = how I work
Prompt  = how I compose
Eval    = how I measure quality
Example = what good looks like
```

## Local Customization

Installed files are plain files in your project (`.github/`). Edit them freely; re-run with `--force` to restore the originals.

## Quality Checks (Maintainers)

Run all repository checks before publishing:

```bash
npm run quality
```

This runs structure validation, references validation, eval checks, artifact alignment checks, and placeholder checks.

## Naming and collisions

Installed assets are prefixed with `backend-` (e.g. `.github/agents/backend-<name>.agent.md`, `.github/skills/backend-<name>/`) so several boosts can live in the same project, and internal references are rewritten to match.

- Nothing that already exists in the target is overwritten: each ignored file is reported with a `[WARN] ... already existed ... IGNORED` message. Use `--force` to overwrite.
- An existing `.github/copilot-instructions.md` is kept; the boost's global guidance is installed as `backend-global.instructions.md` instead.
- Re-running the installer is safe; `--check` and `--uninstall` work from the manifest.

