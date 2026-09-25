# GitHub Actions

Identify the relevant failed check before reading logs:

```sh
gh pr checks NUMBER
gh run list --branch BRANCH --limit 10 --json databaseId,name,status,conclusion,headSha,url
```

Inspect only failed output with `gh run view RUN_ID --log-failed`. Extract the smallest useful error, reproduce locally when practical, fix, validate, commit, and push. Do not repeat unchanged runs or dump complete logs. Iterate until required checks pass or a concrete external blocker is proven.
