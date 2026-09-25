---
name: github-operator
description: Operate a GitHub repository end to end with git and authenticated gh, including bootstrap, issues, branches, PRs, Actions diagnosis, safe merge, and verification.
---

# GitHub operator

Use `git` and the authenticated `gh` CLI. Prefer structured `--json` and `--jq` output. Inspect state before changing it, preserve unrelated work, and keep logs targeted.

Load only the reference needed for the current phase:

- Repository creation/settings: [references/repo-bootstrap.md](references/repo-bootstrap.md)
- Issue to branch/worktree: [references/issue-task.md](references/issue-task.md)
- Pull request and merge: [references/pull-request.md](references/pull-request.md)
- Actions failures: [references/actions-ci.md](references/actions-ci.md)

An explicit request to create/fix a PR and merge it authorizes the ordinary sequence through merge. Never use `--admin` unless the user explicitly requests a protection bypass. Verify final remote state.
