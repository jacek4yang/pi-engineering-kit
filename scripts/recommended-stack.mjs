import { spawnSync } from "node:child_process";

const packages = ["@ff-labs/pi-fff", "@narumitw/pi-lsp", "pi-context-prune", "pi-context-usage"];
const install = process.argv.includes("--install");
const listed = spawnSync("pi", ["list"], { encoding: "utf8", shell: process.platform === "win32" });
if (listed.error) throw listed.error;
const output = `${listed.stdout}\n${listed.stderr}`;

for (const name of packages) {
  const present = output.includes(name);
  console.log(`${name}: ${present ? "installed" : "missing (optional)"}`);
  if (install && !present) {
    const result = spawnSync("pi", ["install", `npm:${name}`], { stdio: "inherit", shell: process.platform === "win32" });
    if (result.status !== 0) process.exitCode = result.status ?? 1;
  }
}
