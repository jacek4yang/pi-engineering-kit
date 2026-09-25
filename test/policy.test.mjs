import assert from "node:assert/strict";
import test from "node:test";
import policyExtension, { buildEngineeringPolicy, POLICY_SECTION } from "../extensions/policy.ts";

test("policy adapts to active search and LSP tools", () => {
  const text = buildEngineeringPolicy({ selectedTools: ["read", "grep", "lsp_diagnostics"] });
  assert.match(text, /`grep`/);
  assert.match(text, /`lsp_diagnostics`/);
  assert.doesNotMatch(text, /`find`/);
});

test("policy omits guidance for absent optional tools", () => {
  const text = buildEngineeringPolicy({ selectedTools: ["read", "bash"] });
  assert.doesNotMatch(text, /lsp_diagnostics|`grep`|`find`/);
});

test("extension adds one structured section without replacing prompt", () => {
  let handler;
  policyExtension({ on(name, fn) { if (name === "before_agent_start") handler = fn; } });
  const options = { selectedTools: ["read"], sections: { native: "kept" } };
  const result = handler({ systemPromptOptions: options });
  assert.equal(result, undefined);
  assert.equal(options.sections.native, "kept");
  assert.match(options.sections[POLICY_SECTION], /verify before claiming success/i);
  assert.equal("forceSystemPrompt" in options, false);
});
