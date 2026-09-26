# Repository bootstrap

Take a new or partial repository only as far as `ready-for-issues`: local foundation, proportional validation, initial commit, remote creation/configuration, CI, appropriate runner setup, supported governance, and final remote verification. Do not implement unrelated product features unless explicitly requested. Interpret flags and natural-language intent without building a CLI parser.

## Inspect before changing

1. Run `gh auth status`; inspect local state, remotes, and the requested owner/repository.
2. Query an existing target with structured fields such as `nameWithOwner,url,visibility,defaultBranchRef,isEmpty` and preserve unrelated contents/history.
3. Determine requested visibility. When creating a repository and visibility is omitted, prefer **private** unless clear project context says otherwise. Never change an existing repository's visibility merely because the request omitted it.
4. Use known account plan, visibility, runner, and governance facts from the environment or user-level instructions before making API calls.

If creating the repository, validate and commit the baseline before creating/pushing the remote. Configure the default branch, squash merge policy, automatic head-branch deletion, Actions, and CI as supported.

## Plan-aware governance

Distinguish GitHub-enforced protection from workflow-enforced discipline. If known plan plus visibility facts already establish that a governance feature is unavailable, skip its API rather than probing predictable failures. In particular, when both repository rulesets and traditional branch protection share a known plan restriction, try neither; report:

`Branch protection unavailable under current GitHub plan; workflow discipline remains active.`

Continue configuring supported settings. Do not make a repository public or weaken privacy to obtain protection. If protection is supported, observe the real successful CI check name before creating required-check rules; never guess it. Read back settings that were actually configured and report unexpected failures precisely.

Even without GitHub-enforced protection: do not implement feature work directly on the default branch; use a branch/worktree and PR; require the intended CI to pass before normal merge; never force-push the default branch; and preserve unrelated work.

## Runner safety

- Prefer GitHub-hosted runners for public repositories.
- Never automatically attach or use a persistent private self-hosted runner for a public repository. Do so only after explicit user request and acceptance of that security model.
- A configured private self-hosted runner may be used normally for a trusted private repository when consistent with known environment policy.

Finish by verifying the remote repository, default branch, CI, supported settings, runner choice, and clean local/remote state. Report any expected plan limitation separately from implementation failures.
