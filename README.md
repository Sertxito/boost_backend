# mcpee-backend

Official backend boost for MCPEE.

## Overview

This package provides reusable backend reasoning assets for MCPEE capabilities:

- architecture
- API design
- refactoring
- performance
- security
- testing
- data access
- backend DevOps

## Quick Start

```bash
npm install @mcpee/core
npm install mcpee-backend
npx mcpee doctor
```

MCPEE Core discovers this boost through `mcpee.json`.

## Package Structure

```text
agents/   -> who acts
specs/    -> universal truths and non-negotiable guidance
skills/   -> operational procedures that can evolve
prompts/  -> runtime prompt composition per capability
evals/    -> evaluation criteria and test cases
examples/ -> examples of high-quality outputs
docs/     -> package documentation and contribution guides
```

## Golden Rule

```text
Agent = who I am
Spec = what I know
Skill = how I work
Prompt = how I compose
Eval = how I measure quality
Example = what good looks like
```

## Local Project Customization

Do not edit installed content directly under `node_modules/mcpee-backend`.

Use:

```text
.mcpee/generated-skills/backend/
.mcpee/overrides/backend/
.mcpee/knowledge/
.mcpee/memory/
```

