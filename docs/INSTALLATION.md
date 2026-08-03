# Installation

## Prerequisites

- Node.js 20 or later
- npm 10 or later
- `@mcpee/core` installed in the target project

## Install

```bash
npm install @mcpee/core
npm install @mcpee/backend
```

## Verify

```bash
npx mcpee doctor
```

The backend boost is discovered through `mcpee.json`.

## Local Customization

Avoid direct edits in `node_modules/@mcpee/backend`.

Use project-local directories:

```text
.mcpee/generated-skills/backend/
.mcpee/overrides/backend/
.mcpee/knowledge/
.mcpee/memory/
```
