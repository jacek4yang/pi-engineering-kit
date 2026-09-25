# Issue task

Inspect only the necessary structured state:

```sh
gh issue view NUMBER --json number,title,body,labels,state,url
git status --short --branch
git branch --show-current
```

For a long task, keep the main checkout clean and create a linked branch/worktree with a short issue-derived name. Understand the existing code and tests, make the smallest robust change, and validate locally. Use `Closes #NUMBER` when the PR should close the issue.
