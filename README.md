# mcpee-backend

Official backend boost for MCPEE.

## What This Package Provides

`mcpee-backend` ships reusable backend reasoning assets for MCPEE, including:

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
- `@mcpee/core` in the target project

## Quick Start

```bash
npm install @mcpee/core
npm install mcpee-backend
npx mcpee doctor
```

MCPEE Core discovers this boost through `mcpee.json`.

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

## Local Project Customization

Do not edit installed content directly under `node_modules/mcpee-backend`.

Use project-local directories instead:

```text
.mcpee/generated-skills/backend/
.mcpee/overrides/backend/
.mcpee/knowledge/
.mcpee/memory/
```

## Quality Checks (Maintainers)

Run all repository checks before publishing:

```bash
npm run quality
```

This runs structure validation, references validation, eval checks, artifact alignment checks, and placeholder checks.
