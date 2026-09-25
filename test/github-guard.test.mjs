import assert from "node:assert/strict";
import test from "node:test";
import { evaluateGitHubCommand } from "../extensions/github-guard.ts";

const allowed = [
  "git switch -c fix/widget",
  "git commit -m 'fix: widget'",
  "git push -u origin fix/widget",
  "gh issue create --title bug --body body",
  "gh pr create --fill",
  "gh pr checks 12",
  "gh pr merge 12 --squash --match-head-commit abc123",
  "git push --force-with-lease origin HEAD:fix/widget",
];

const blocked = [
  "git push --force origin main",
  "git push -f",
  "git push --force-with-lease origin HEAD:master",
  "gh pr merge 12 --admin --squash",
  "gh repo delete owner/repo --yes",
  "git reset --hard HEAD~3",
  "git clean -fd",
  "git clean --force --directories",
];

for (const command of allowed) test(`allows: ${command}`, () => assert.equal(evaluateGitHubCommand(command).blocked, false));
for (const command of blocked) test(`blocks: ${command}`, () => assert.equal(evaluateGitHubCommand(command).blocked, true));
