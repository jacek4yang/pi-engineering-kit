import { platform, release } from "node:os";
import { VERSION, type ExecResult, type ExtensionAPI } from "@earendil-works/pi-coding-agent";

export const OPTIONAL_TOOLS = ["rg", "fd", "rust-analyzer", "gopls", "clangd", "actionlint"] as const;

export function firstLine(result: ExecResult): string {
  const text = `${result.stdout ?? ""}\n${result.stderr ?? ""}`.trim();
  return text.split(/\r?\n/, 1)[0] || "available";
}

async function probe(pi: ExtensionAPI, command: string, args: string[]): Promise<string | undefined> {
  try {
    const result = await pi.exec(command, args, { timeout: 5000 });
    return result.code === 0 ? firstLine(result) : undefined;
  } catch {
    return undefined;
  }
}

export default function doctor(pi: ExtensionAPI): void {
  pi.registerCommand("kit-doctor", {
    description: "Report Pi Engineering Kit compatibility and optional tools",
    handler: async (_args, ctx) => {
      const [git, gh, ...optional] = await Promise.all([
        probe(pi, "git", ["--version"]),
        probe(pi, "gh", ["--version"]),
        ...OPTIONAL_TOOLS.map((name) => probe(pi, name, ["--version"])),
      ]);
      const lines = [
        "Pi Engineering Kit doctor (read-only)",
        `OS: ${platform()} ${release()}`,
        `Node: ${process.version}`,
        `Pi: ${VERSION}`,
        `git: ${git ?? "missing"}`,
        `gh: ${gh ?? "missing"}`,
        `Active tools: ${pi.getActiveTools().join(", ") || "none"}`,
        `Model: ${ctx.model ? `${ctx.model.provider}/${ctx.model.id}` : "not selected"}`,
        ...OPTIONAL_TOOLS.map((name, index) => `${name} (optional): ${optional[index] ?? "missing"}`),
      ];
      ctx.ui.notify(lines.join("\n"), "info");
    },
  });
}
