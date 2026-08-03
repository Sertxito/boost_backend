# Release Guide

## Versioning Strategy

Recommended strategy:

- Use pre-release tags (`-beta.N`) while capability quality is still evolving.
- Promote to stable only when all quality gates and content standards are consistently met.

## Pre-Release Checklist

1. Run quality gates:

```bash
npm run quality
```

1. Validate package contents:

```bash
npm pack --dry-run
```

1. Confirm `mcpee.json` capability references are valid.
1. Confirm no placeholders remain in core assets.
1. Review changed capabilities and examples for consistency.

## Suggested Publish Sequence

1. Update version:

```bash
npm version <patch|minor|major|prerelease>
```

1. Dry-run package:

```bash
npm pack --dry-run
```

1. Publish:

```bash
npm publish
```

## Automated Publish on PR Merge

This repository includes an automated release workflow:

- Workflow file: `.github/workflows/publish-on-main-merge.yml`
- Trigger: Pull request merged into `main`
- Gates before publish:
  - `npm run quality`
  - `npm pack --dry-run`
  - version-not-already-published check against npm registry

### Required Secret

Configure this repository secret before enabling automated publish:

- `NPM_TOKEN`: npm automation token with publish access to `mcpee-backend`

### Important

- Every merge intended for publish must bump `package.json` version.
- If the same version already exists in npm, the workflow skips publish.

## Post-Release Validation

- Install package in a clean test workspace.
- Run core discovery command (`npx mcpee doctor`) in the target environment.
- Spot-check at least one capability from each major domain:
  - API
  - Architecture
  - Security
  - Performance
  - Testing

## Rollback Guidance

If a faulty release is detected:

1. Deprecate the problematic version in npm.
2. Publish a fixed patch release quickly.
3. Document incident and root cause in internal notes.
