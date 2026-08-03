# Capability and Agent Mapping

This file documents the current functional mapping between backend capabilities and available agents.

## Current Mapping

- `backend.architecture.review` -> `agents/project-architecture-planner.agent.md`
- `backend.api.review` -> `agents/api-architect.agent.md`
- `backend.refactoring.review` -> `agents/principal-software-engineer.agent.md`
- `backend.performance.review` -> `agents/principal-software-engineer.agent.md`
- `backend.security.review` -> `agents/principal-software-engineer.agent.md`
- `backend.testing.review` -> `agents/qa-subagent.agent.md`
- `backend.data.review` -> `agents/principal-software-engineer.agent.md`
- `backend.devops.review` -> `agents/devops-expert.agent.md`

## Migration Note

This is the functional baseline for package integrity. Backend-specific agent files can be introduced incrementally in future releases while preserving capability continuity.
