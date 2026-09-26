import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { DefaultResourceLoader, VERSION } from "@earendil-works/pi-coding-agent";

const root = fileURLToPath(new URL("..", import.meta.url));

test("public Pi loader discovers extensions, skills, and prompts", async () => {
  const agentDir = await mkdtemp(join(tmpdir(), "pi-kit-agent-"));
  const loader = new DefaultResourceLoader({
    cwd: root,
    agentDir,
    additionalExtensionPaths: [
      join(root, "extensions", "policy.ts"),
      join(root, "extensions", "github-guard.ts"),
      join(root, "extensions", "doctor.ts"),
    ],
    additionalSkillPaths: [join(root, "skills")],
    additionalPromptTemplatePaths: [join(root, "prompts")],
    noContextFiles: true,
  });
  await loader.reload();
  const extensions = loader.getExtensions();
  const skills = loader.getSkills();
  const prompts = loader.getPrompts();
  assert.equal(extensions.errors.length, 0, JSON.stringify(extensions.errors));
  assert.equal(extensions.extensions.length, 3);
  assert.deepEqual(skills.skills.map((skill) => skill.name).sort(), ["debug-failure", "finish-task", "github-operator"]);
  assert.deepEqual(prompts.prompts.map((prompt) => prompt.name).sort(), ["finish", "fix", "issue", "issues", "review"]);
  assert.equal(loader.getSystemPrompt(), undefined);
  assert.deepEqual(loader.getAppendSystemPrompt(), []);
  assert.match(VERSION, /^0\./);
});

test("production extensions use only the public Pi entry point", async () => {
  const { readFile, readdir } = await import("node:fs/promises");
  for (const name of await readdir(join(root, "extensions"))) {
    const source = await readFile(join(root, "extensions", name), "utf8");
    assert.doesNotMatch(source, /pi-coding-agent\/dist\//);
    assert.doesNotMatch(source, /forceSystemPrompt|return\s*\{\s*systemPrompt/);
  }
});
