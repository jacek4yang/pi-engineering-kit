import { readFile, readdir } from "node:fs/promises";
import { relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const ignored = new Set([".git", "node_modules", "coverage", "backups", ".cache"]);
const forbiddenNames = new Set(["auth.json", "models.json", "models-store.json", "settings.json"]);
const forbiddenContent = [
  { name: "GitHub token", pattern: /\bgh[oprsu]_[A-Za-z0-9_]{20,}\b/ },
  { name: "common API key", pattern: /\bsk-[A-Za-z0-9_-]{20,}\b/ },
  { name: "user-specific Windows path", pattern: /[A-Za-z]:[\\/]Users[\\/][^\\/\s"']+/i },
  { name: "user-specific Unix path", pattern: /\/(?:home|Users)\/[^/\s"']+/ },
];

export function toPosixRelative(base, target) {
  return relative(base, target).split(sep).join("/");
}

async function filesUnder(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const full = resolve(directory, entry.name);
    if (entry.isDirectory()) result.push(...await filesUnder(full));
    else result.push(full);
  }
  return result;
}

export async function auditRepository(directory = root) {
  const findings = [];
  for (const file of await filesUnder(directory)) {
    const rel = toPosixRelative(directory, file);
    if (forbiddenNames.has(rel.split("/").at(-1))) findings.push(`${rel}: forbidden machine configuration file`);
    if (/\.(?:png|jpe?g|gif|zip|tgz|sqlite|db)$/i.test(file)) continue;
    const content = await readFile(file, "utf8");
    for (const rule of forbiddenContent) {
      if (rule.pattern.test(content)) findings.push(`${rel}: ${rule.name}`);
    }
    if (rel.startsWith("extensions/") && /@earendil-works\/pi-coding-agent\/dist\//.test(content)) {
      findings.push(`${rel}: private Pi dist import`);
    }
  }
  return findings;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const findings = await auditRepository();
  if (findings.length) {
    console.error(findings.join("\n"));
    process.exitCode = 1;
  } else {
    console.log("Repository secret and portability audit passed.");
  }
}
