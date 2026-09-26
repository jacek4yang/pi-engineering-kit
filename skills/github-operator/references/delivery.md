# Deliver current local work

Use this for work that may not come from a GitHub Issue. The default terminal state is an open PR with required CI green. Only `--merge` or equally explicit natural-language authorization extends the workflow through normal merge and remote verification.

1. Inspect repository status, branch, remotes, final diff, and any matching existing PR. Preserve unrelated user work.
2. Apply the internal `finish-task` skill: fix obvious completion defects when safe, validate proportionally, and remove accidental artifacts or debug output.
3. If changes are on the default branch, preserve them and move delivery onto a suitable feature branch where practical. Do not use destructive reset/clean.
4. Commit current intended work with a useful message, push normally, and create or update the matching PR. No GitHub Issue is required.
5. Follow the Actions guidance until required CI is green or a genuine blocker is proven. Reuse an existing matching PR rather than creating duplicates.
6. Without merge authorization, stop with the green PR open. With authorization, recheck mergeability and head SHA, merge normally using the repository's allowed method, and verify merged state and the remote default branch.

Merge authorization never permits `--admin`, protection bypass, default-branch force push, or destructive recovery.
