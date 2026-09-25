import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const manifest = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));

test("manifest declares a dependency-free Pi package", () => {
  assert.equal(manifest.name, "pi-engineering-kit");
  assert.equal(manifest.version, "0.1.0");
  assert.ok(manifest.keywords.includes("pi-package"));
  assert.deepEqual(manifest.peerDependencies, { "@earendil-works/pi-coding-agent": "*" });
  assert.equal(manifest.dependencies, undefined);
});

test("all declared package resource roots exist", async () => {
  for (const root of ["extensions", "skills", "prompts"]) {
    assert.ok((await stat(new URL(`../${root}/`, import.meta.url))).isDirectory());
  }
});
