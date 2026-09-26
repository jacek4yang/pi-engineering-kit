# Pi Engineering Kit

`pi-engineering-kit` adds a compact engineering policy, conservative GitHub safety guard, read-only doctor command, GitHub workflow skill, debugging/finishing skills, and lightweight prompt templates to [Pi](https://github.com/earendil-works/pi). It supports Windows, Linux, and macOS with Node 22.19 or newer and Pi 0.87.1 or newer.

Pi remains the runtime and owns providers, native tools, resource loading, skills, and its system prompt. This package does not fork, vendor, patch, or replace Pi. It uses public extension APIs and a structured prompt section so upstream Pi improvements are intentionally inherited. It has no production dependencies and is provider-agnostic.

## Install

```sh
pi install git:github.com/jacek4yang/pi-engineering-kit@v0.2.0
```

Run `/reload` in an active Pi session, or restart Pi. Check the installation with `pi list` and run `/kit-doctor` for a read-only compatibility report. Update a moving git ref with `pi update`; this tagged install stays pinned by design. Remove it with:

```sh
pi remove git:github.com/jacek4yang/pi-engineering-kit@v0.2.0
```

## Developer workflow

The six prompts are small intent entry points; reusable workflow detail lives in skills, while policy and catastrophic GitHub safety remain always-on extensions.

- **CREATE — `/repo`**: bootstrap through a verified `ready-for-issues` repository, then stop. It handles visibility, CI, plan-aware governance, and runner safety. Examples: `/repo jacek4yang-labs/foo --private --runner homeserver` and `/repo jacek4yang/foo --public`.
- **FIX — `/fix`**: diagnose and fix a known failure locally, then stop without committing or publishing unless delivery is explicit. Example: `/fix Windows Unicode path handling`.
- **SINGLE ISSUE — `/issue`**: complete one Issue through a green open PR. `/issue 23 --merge` additionally authorizes a normal verified merge; `/issue 23` does not.
- **OVERNIGHT / SERIAL — `/issues`**: process exactly one Issue at a time, recovering progress from GitHub state. Example: `/issues 24-31 --merge`. Dependencies stop the queue and CI repair is bounded.
- **QUALITY — `/review`**: review read-only by default and lead with evidence-based findings. Examples: `/review current diff` and `/review PR 38`.
- **DELIVER — `/ship`**: finish and deliver current local work through a green open PR. `/ship --merge` additionally authorizes a normal verified merge.

The internal `github-operator`, `debug-failure`, and `finish-task` skills supply reusable workflow knowledge. `/kit-doctor` is a separate read-only diagnostic command that reports OS, Node, Pi, git, GitHub CLI, active tools/model, and optional developer tools.

The engineering policy keeps implementation focused and adds LSP guidance only when `lsp_diagnostics` is active. The GitHub guard permits ordinary branches, commits, pushes, Issues, PRs, checks, and authorized merges while blocking obvious destructive or bypass commands such as default-branch force pushes, `gh pr merge --admin`, repository deletion, `git reset --hard`, and `git clean -fd`.

The GitHub workflow uses authenticated `gh` commands with structured JSON, targeted failed logs, head-SHA checks before merge, and post-merge verification. Normal merges follow repository protection when available and workflow-enforced branch/PR/CI discipline otherwise; the skill never instructs Pi to use `--admin` unless a user explicitly requests a bypass.

## Optional integrations

The core package works alone. `@ff-labs/pi-fff`, `@narumitw/pi-lsp`, `pi-context-prune`, and `pi-context-usage` are useful optional integrations and are neither embedded nor installed automatically. Check them with `node scripts/recommended-stack.mjs`; add `--install` only when you explicitly want Pi to install missing packages. The script does not touch provider settings or proxy configuration.

Experimental prompt compression is not enabled by default. No global `SYSTEM.md` or copy of Pi's native prompt is included.

## Security and providers

Extensions execute with the same local authority as Pi. Review the source before installation. The guard is a focused last line of defense, not a shell sandbox. The package contains no credentials, provider URLs, models, global settings, proxy values, or session data. OpenAI, Anthropic, SenseNova, local gateways, and other Pi-supported providers continue to be configured entirely by Pi and external provider tooling.

If resources do not appear, run `/reload`, restart Pi, then inspect `pi list` and `/kit-doctor`. If a git install cannot download, resolve normal GitHub/network access and retry; do not put runtime provider settings into this package.

## Development

```sh
npm ci
npm run check
```

The test suite covers the manifest and resources, structured policy behavior, allowed/blocked guard commands, doctor helpers, portability/secret auditing, and loading through Pi's public `DefaultResourceLoader`. Stable CI runs the pinned minimum Pi on Windows, Linux, and macOS. A separate scheduled/manual canary installs the latest Pi and is allowed to surface upstream compatibility failures without blocking stable releases.
