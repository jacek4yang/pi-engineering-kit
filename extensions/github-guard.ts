import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export interface GuardDecision {
  blocked: boolean;
  reason?: string;
}

const DEFAULT_BRANCH = String.raw`(?:main|master|trunk)`;

export function evaluateGitHubCommand(command: string): GuardDecision {
  const normalized = command.replace(/[`\r\n]+/g, " ").replace(/\s+/g, " ").trim();

  if (/\bgh\s+repo\s+(?:delete|archive)\b/i.test(normalized)) {
    return { blocked: true, reason: "Repository deletion or archival requires separate explicit authorization." };
  }
  if (/\bgh\s+pr\s+merge\b[^;&|]*(?:--admin)\b/i.test(normalized)) {
    return { blocked: true, reason: "Administrative PR merge bypass is blocked." };
  }
  if (/\bgit\s+reset\b[^;&|]*(?:--hard)\b/i.test(normalized)) {
    return { blocked: true, reason: "Destructive git reset --hard is blocked." };
  }
  if (/\bgit\s+clean\b[^;&|]*(?:-[a-z]*f[a-z]*d|-[a-z]*d[a-z]*f|--force[^;&|]*--directories|--directories[^;&|]*--force)\b/i.test(normalized)) {
    return { blocked: true, reason: "Destructive git clean of untracked directories is blocked." };
  }

  const forcePush = /\bgit\s+push\b[^;&|]*(?:--force(?:-with-lease|-if-includes)?|-f)(?:\s|$)/i.test(normalized);
  if (forcePush) {
    const explicitDefaultTarget = new RegExp(String.raw`(?:\b${DEFAULT_BRANCH}\b|HEAD:${DEFAULT_BRANCH}\b)`, "i").test(normalized);
    const hasRefspec = /\b(?:HEAD|[\w./-]+):[\w./-]+\b/.test(normalized);
    if (explicitDefaultTarget || !hasRefspec) {
      return { blocked: true, reason: "Force-pushing a default or unspecified branch is blocked." };
    }
  }

  return { blocked: false };
}

export default function githubGuard(pi: ExtensionAPI): void {
  pi.on("tool_call", (event) => {
    if (event.toolName !== "bash" && event.toolName !== "powershell") return;
    const command = "command" in event.input ? String(event.input.command ?? "") : "";
    const decision = evaluateGitHubCommand(command);
    if (decision.blocked) return { block: true, reason: decision.reason };
  });
}
