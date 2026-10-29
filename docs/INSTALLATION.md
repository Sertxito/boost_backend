# Installation

## Prerequisites

- Node.js 20 or later
- A project with GitHub Copilot in VS Code (no other runtime required)

## Install

```bash
npx github:Sertxito/boost_backend   # or: npx boost-backend
```

Copies agents, skills, prompts and instructions into `.github/` (and skills also into `.agents/skills/`). Options: `--target`, `--force`, `--dry-run`, `--no-agents-dir`, `--check`, `--uninstall`.

## Verify

```bash
npx boost-backend --check
```

Then reload VS Code and type `@` in Copilot Chat to see the agents.

## Local Customization

Installed files are plain files in your project; edit them freely. Re-run with `--force` to restore the originals.