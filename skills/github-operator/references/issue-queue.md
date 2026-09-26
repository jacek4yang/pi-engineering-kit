# Sequential Issue queue

Use this reference only for a multi-Issue or queue request. Interpret `$ARGUMENTS` naturally: accept numbers, Issue URLs, explicit order, and numeric ranges. Expand `1-14` in ascending numeric order unless the user gives another order. `--merge` or equally explicit natural language authorizes ordinary policy-respecting merge for every Issue in this queue; without explicit authorization, do not merge.

## Invariants

- Exactly one Issue is active at a time. Never implement or actively modify multiple queue worktrees in parallel.
- Do not start the next Issue until the current one reaches the requested terminal state. With merge authorization this means: PR merged and remotely verified, Issue closure verified, and the remote default branch refreshed.
- Start every Issue from the current remote default branch. Never chain the next Issue from a feature branch.
- Give each Issue its own branch/worktree and PR when changes are needed. Never push implementation directly to the default branch.
- Preserve unrelated local work. Never bypass repository protection, force-push the default branch, or use `gh pr merge --admin` unless the user separately and explicitly requested a protection bypass.

## Preflight and durable state

At queue start, inspect only `gh auth status`, repository identity/remotes and default branch, `git status --short --branch`, and structured data for the requested Issues. Resolve a deterministic ordered list. Prefer targeted fields from `gh issue view NUMBER --json ...`; do not fetch every comment unless needed.

GitHub and git remote state are authoritative. Do not create a tracked queue file, database, daemon, or persistent local progress record, and do not depend on old transcript context. Before **each** Issue:

1. Re-read its state, body, and acceptance criteria.
2. Inspect relevant remote state and fetch/refresh the default branch.
3. Look for a linked/open or merged PR and an interrupted feature branch before creating anything.

Resume an appropriate open PR/branch instead of duplicating delivery. If the Issue is already completed/closed, inspect enough linked state to confirm that and skip it. When linkage is ambiguous, be conservative. This makes a restarted or context-pruned queue reconstruct progress from GitHub.

Inspect bodies only for explicit dependencies such as `Depends on #N`, `Blocked by #N`, or equivalent clear language; do not invent a graph. Verify an explicit dependency is completed/merged before work begins. An unresolved or blocked dependency is a genuine blocker: stop the queue rather than blindly skipping ahead.

## Execute one Issue completely

For the active Issue only:

1. Re-read the Issue and acceptance criteria, then fetch the remote default branch.
2. Base a short Issue-derived feature branch/worktree on the current remote default branch.
3. Read only required code, make the smallest robust change, validate proportionally, and inspect the final diff and state.
4. Commit usefully and push the feature branch normally.
5. Create or reuse the matching PR. Include `Closes #NUMBER` when it should close the Issue.
6. Determine required Actions checks and complete the CI repair loop below.
7. Merge only when explicitly authorized and safe; otherwise the requested terminal state is the prepared PR. If later Issues require merged predecessors, explain the blocker and stop rather than inferring merge permission.
8. Verify remote final state, clean up the branch/worktree only when safe, refresh the remote default branch, verify the working state, and only then advance.

Do not use broad `git reset --hard`, `git clean -fd`, or repository-wide destructive restore as normal cleanup.

## CI repair loop

Use the Actions guidance. Determine the failed check first with structured `gh pr checks` and `gh run list`; read only relevant failures with `gh run view ... --log-failed`. A meaningful repair cycle is: inspect a failing result, make a new evidence-based code/config change, push it, and observe the resulting CI.

Allow at most **five** meaningful repair cycles for one Issue. If the same underlying failure appears twice without materially new evidence, stop mechanical retries and re-diagnose before editing. If five cycles cannot produce green required checks, preserve the PR/branch, mark that Issue blocked, and stop the queue.

## Authorized merge and transition

Merge authorization permits only normal repository-allowed merging. It does not permit `--admin`, protection bypass, default-branch force push, or destructive recovery. Before merging:

- verify required checks pass and inspect mergeability;
- record and recheck the PR head SHA;
- use the current `gh pr merge` head-SHA matching option when available;
- use a normally allowed repository merge method.

Afterward, verify `mergedAt`/merged state and the merged commit remotely, verify the intended Issue closed (normally via `Closes #N`), fetch, and update a clean default-branch checkout with a safe fast-forward-compatible operation. Remove the completed worktree/branch only if safe. Then begin the next Issue from that refreshed remote state.

## Continue and report

Keep working without intermediate confirmation. Stop only for a genuine blocker: missing credentials/permissions; unresolved explicit dependency; unavailable required secret or external resource; repository protection preventing a required normal action; materially ambiguous requirements unresolved by repository/Issue evidence; required destructive recovery; exhausted CI repair budget; or external infrastructure failure not locally resolvable. Length, finishing a phase, creating a PR, pending CI, or an obvious next action are not blockers.

At completion or stop, give one concise table or summary for every requested Issue: Issue number, PR number/URL if any, final state, CI result, merged commit if any, and blocker if blocked/skipped. Do not provide a chronological diary or repeatedly re-summarize completed Issues during execution.
