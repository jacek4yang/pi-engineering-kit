# Single Issue task

Inspect only the necessary structured state and look for an existing related branch or PR before creating duplicates:

```sh
gh issue view NUMBER --json number,title,body,labels,state,url
git status --short --branch
git branch --show-current
```

Keep the default checkout clean and create a linked branch/worktree with a short issue-derived name when appropriate. Understand only the required code, make the smallest robust change, validate locally, commit, push the feature branch, and create or update its PR. Use `Closes #NUMBER` when the PR should close the Issue. Follow the Actions and pull-request references until required CI is green or a genuine blocker is proven.

The default terminal state is an open, green PR; an Issue request alone does **not** authorize merge. `--merge` or equally explicit natural-language authorization permits a normal policy-respecting merge after required checks pass. It never permits `--admin`, protection bypass, force-pushing the default branch, or destructive recovery. After an authorized merge, verify the PR merged, the intended Issue closed, and the remote default branch contains the result.
