import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const manifest = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));

test("manifest declares a dependency-free Pi package", () => {
  assert.equal(manifest.name, "pi-engineering-kit");
  assert.equal(manifest.version, "0.1.1");
  assert.ok(manifest.keywords.includes("pi-package"));
  assert.deepEqual(manifest.peerDependencies, { "@earendil-works/pi-coding-agent": "*" });
  assert.equal(manifest.dependencies, undefined);
});

test("Issue queue resources exist and are progressively linked", async () => {
  const skill = await readFile(new URL("../skills/github-operator/SKILL.md", import.meta.url), "utf8");
  const queue = new URL("../skills/github-operator/references/issue-queue.md", import.meta.url);
  const prompt = await readFile(new URL("../prompts/issues.md", import.meta.url), "utf8");
  assert.ok((await stat(queue)).isFile());
  assert.match(skill, /\[references\/issue-queue\.md\]\(references\/issue-queue\.md\)/);
  assert.match(prompt, /\$ARGUMENTS/);
  assert.match(prompt, /strictly sequential/i);
});

test("all declared package resource roots exist", async () => {
  for (const root of ["extensions", "skills", "prompts"]) {
    assert.ok((await stat(new URL(`../${root}/`, import.meta.url))).isDirectory());
  }
});
