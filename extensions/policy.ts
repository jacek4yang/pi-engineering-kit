import type { BuildSystemPromptOptions, ExtensionAPI } from "@earendil-works/pi-coding-agent";

export const POLICY_SECTION = "engineering_policy";

export function buildEngineeringPolicy(options: Pick<BuildSystemPromptOptions, "selectedTools">): string {
  const tools = new Set(options.selectedTools ?? []);
  const guidance = [
    "For implementation requests, investigate, implement, and verify; do not stop at planning.",
    "Do not narrate internal deliberation, repeat settled facts, or reconsider an approach without new evidence.",
    "Prefer the cheapest high-information operation, focused repository exploration, and targeted command output.",
    "Make the smallest robust change, preserve unrelated user work, and verify before claiming success.",
  ];

  const searchTools = ["find", "grep"].filter((name) => tools.has(name));
  if (searchTools.length > 0) {
    guidance.push(`Use the active ${searchTools.map((name) => `\`${name}\``).join(" and ")} tools for focused discovery.`);
  }
  if (tools.has("lsp_diagnostics")) {
    guidance.push("Use `lsp_diagnostics` after relevant edits and resolve material diagnostics before broader tests.");
  }
  return guidance.map((line) => `- ${line}`).join("\n");
}

export default function engineeringPolicy(pi: ExtensionAPI): void {
  pi.on("before_agent_start", (event) => {
    event.systemPromptOptions.sections[POLICY_SECTION] = buildEngineeringPolicy(event.systemPromptOptions);
  });
}
