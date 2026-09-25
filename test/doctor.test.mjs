import assert from "node:assert/strict";
import test from "node:test";
import { firstLine, OPTIONAL_TOOLS } from "../extensions/doctor.ts";

test("doctor output extraction is bounded to the first line", () => {
  assert.equal(firstLine({ stdout: "tool 1.2\nmore", stderr: "", code: 0 }), "tool 1.2");
});

test("doctor labels expected integrations optional", () => {
  assert.deepEqual([...OPTIONAL_TOOLS], ["rg", "fd", "rust-analyzer", "gopls", "clangd", "actionlint"]);
});
