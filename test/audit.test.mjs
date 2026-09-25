import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { auditRepository, toPosixRelative } from "../scripts/audit.mjs";

test("portable relative paths use slash separators", () => {
  const output = toPosixRelative(join("root", "one"), join("root", "one", "two", "file"));
  assert.equal(output, "two/file");
});

test("audit detects machine configuration and private imports", async () => {
  const root = await mkdtemp(join(tmpdir(), "pi-kit-audit-"));
  await mkdir(join(root, "extensions"));
  await writeFile(join(root, "auth.json"), "{}");
  await writeFile(join(root, "extensions", "bad.ts"), 'import x from "@earendil-works/pi-coding-agent/dist/private";');
  const findings = await auditRepository(root);
  assert.ok(findings.some((line) => line.includes("forbidden machine configuration")));
  assert.ok(findings.some((line) => line.includes("private Pi dist import")));
});
