import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import test from "node:test";

const manifest = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));

test("manifest declares a dependency-free Pi package", () => {
  assert.equal(manifest.name, "pi-engineering-kit");
  assert.equal(manifest.version, "0.2.0");
  assert.ok(manifest.keywords.includes("pi-package"));
  assert.deepEqual(manifest.peerDependencies, { "@earendil-works/pi-coding-agent": "*" });
  assert.equal(manifest.dependencies, undefined);
});

test("workflow resources exist and are progressively linked", async () => {
  const skill = await readFile(new URL("../skills/github-operator/SKILL.md", import.meta.url), "utf8");
  const references = ["repo-bootstrap", "issue-task", "issue-queue", "pull-request", "actions-ci", "delivery"];
  for (const name of references) {
    assert.ok((await stat(new URL(`../skills/github-operator/references/${name}.md`, import.meta.url))).isFile());
    assert.match(skill, new RegExp(`\\(references/${name}\\.md\\)`));
  }
  const prompts = (await readdir(new URL("../prompts/", import.meta.url))).sort();
  assert.deepEqual(prompts, ["fix.md", "issue.md", "issues.md", "repo.md", "review.md", "ship.md"]);
  assert.ok(!prompts.includes("finish.md"));
});

test("prompt terminal states and bootstrap safety remain explicit", async () => {
  const fix = await readFile(new URL("../prompts/fix.md", import.meta.url), "utf8");
  const issue = await readFile(new URL("../prompts/issue.md", import.meta.url), "utf8");
  const issues = await readFile(new URL("../prompts/issues.md", import.meta.url), "utf8");
  const review = await readFile(new URL("../prompts/review.md", import.meta.url), "utf8");
  const ship = await readFile(new URL("../prompts/ship.md", import.meta.url), "utf8");
  const bootstrap = await readFile(new URL("../skills/github-operator/references/repo-bootstrap.md", import.meta.url), "utf8");
  assert.match(fix, /Do not commit, push, open a PR, or merge/i);
  assert.match(issue, /green.*PR/i);
  assert.match(issues, /strictly sequential/i);
  assert.match(review, /read-only/i);
  assert.match(ship, /green.*PR/i);
  assert.match(bootstrap, /plan-aware governance/i);
  assert.match(bootstrap, /persistent private self-hosted runner/i);
});

test("all declared package resource roots exist", async () => {
  for (const root of ["extensions", "skills", "prompts"]) {
    assert.ok((await stat(new URL(`../${root}/`, import.meta.url))).isDirectory());
  }
});
