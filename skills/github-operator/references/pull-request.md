# Pull request and merge

Push the feature branch normally, then create or update a PR with a concise problem/result description and validation. Inspect state with:

```sh
gh pr view NUMBER --json number,url,state,headRefName,headRefOid,baseRefName,mergeable,mergeStateStatus,reviewDecision,statusCheckRollup
```

Before merge, confirm required checks are green and record `headRefOid`. Use the current `gh pr merge` head-SHA matching option when available. Never use `--admin` without an explicit bypass request. After merging, query the PR again and verify `state`, `mergedAt`, and `mergeCommit`; update the local main branch and clean up the task branch/worktree when safe.
