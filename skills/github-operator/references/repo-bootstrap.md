# Repository bootstrap

1. Run `gh auth status` and inspect local repository state.
2. Query the target with `gh repo view OWNER/REPO --json nameWithOwner,url,visibility,defaultBranchRef,isEmpty`.
3. If it does not exist, validate and commit the clean baseline before `gh repo create ... --public --source . --remote origin --push`.
4. If it exists, inspect its contents and history. Stop rather than overwrite unrelated content.
5. Observe the exact successful CI check name before configuring branch rules.
6. Set the default branch and merge/delete-branch settings. Require PRs and the observed stable gate; block force pushes and deletion.
7. Read settings back through `gh api` and report unsupported account features precisely.
