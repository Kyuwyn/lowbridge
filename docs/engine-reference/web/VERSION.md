# Web stack — Version Reference

This project has no game engine. This file pins the toolchain that takes an engine's
place, so `/setup-engine` and `project-coherence.sh` have one reference to read.

| Field | Value |
|-------|-------|
| **Engine Version** | TypeScript 7.0.2 · Vite 8.3.8 · Vitest 5.1.1 · Node.js 26 LTS |
| **Installed at pin time** | NOT DETERMINED — the developer's machine was not probed. The scaffold was installed, type-checked, built and tested once in Claude's workspace VM on Node.js 22.23.4 with npm 10.9.9, which is not the pinned runtime. |
| **Project Pinned** | 2026-11-19 |
| **Last Docs Verified** | 2026-11-19 (sources listed in `breaking-changes.md`) |
| **LLM Knowledge Cutoff** | End of June 2026 for the model that wrote this file. The studio's floor for every model is May 2025. |
| **Risk Level** | HIGH — TypeScript 7.0, Vite 8.2 and later, and Vitest 5 were released after that cutoff |

## Knowledge Gap Warning

Treat May 2025 as the floor: a model may know more, but check this folder first.

A model trained before mid-2026 knows TypeScript 5.x (perhaps 6.0), Vite 5 to 7 and
Vitest 1 to 4. All three have had a major release since, and each changed defaults
that older habits get wrong. Read `breaking-changes.md` before writing a `tsconfig.json`,
a Vite config or a Vitest config, and `deprecated-apis.md` before copying an option
name from memory.

## Installed-Version Gap Warning

This reference may sit ahead of, or behind, what is installed on the developer's
machine. `Installed at pin time` says NOT DETERMINED, which means the gap is unknown,
not absent. `package.json` pins exact versions and `package-lock.json` records them, so
`npm ci` reproduces the toolchain; only the Node.js runtime depends on the machine.
Check it with `node --version`.

## Version sources

Checked 2026-11-19.

| Part | Pinned | Source of the version |
|------|--------|-----------------------|
| TypeScript | 7.0.2 | npm registry `latest` tag. 7.0 was announced 2026-07-08 (https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/). The `beta` tag is 7.1.0-beta |
| Vite | 8.3.8 | npm registry `latest` tag. 8.0 was announced 2026-03-12 (https://vite.dev/blog/announcing-vite8) |
| Vitest | 5.1.1 | npm registry `latest` tag. 5.0 was announced 2026-09-03 (https://v5.cn.vitest.dev/blog/vitest-5) |
| Node.js | 26 LTS | 26.0.0 was released 2026-05-05 (https://nodejs.org/tr/blog/release/v26.0.0). Its promotion to Active LTS on 2026-10-28 is from secondary reporting (https://fireup.pro/news/nodejs-26-lts-whats-new-upgrade), not from nodejs.org. NOT SOURCEABLE — the newest 26.x patch number; nodejs.org/dist was not reachable from the session |

## Requirements between the parts

- Vitest 5 requires Vite 6.4.0 or later and Node.js 22.12.0 or later (Vitest 5 announcement).
- Vite 8.3.8 declares `engines.node` as `^20.19.0 || >=22.12.0` (npm registry metadata).
- `package.json` sets `engines.node` to `>=26`. npm only warns when that is not met.

## Post-Cutoff Version Timeline

| Version | Release | Risk Level | Key Theme |
|---------|---------|------------|-----------|
| TypeScript 6.0 | Mar 2026 | MEDIUM | Last JavaScript-based compiler; new config defaults and deprecations that 7.0 makes final |
| TypeScript 7.0 | Jul 2026 | HIGH | Native (Go) compiler; strict by default; legacy module options removed; no programmatic API |
| Vite 8.0 | Mar 2026 | HIGH | Rolldown and Oxc replace Rollup and esbuild; config options renamed |
| Vitest 5.0 | Sep 2026 | HIGH | Changed defaults (`clearMocks`, strict locators, failing unawaited assertions) |
| Node.js 26 | May 2026 | MEDIUM | Temporal on by default; legacy stream modules removed |

Release months for TypeScript 6.0 come from secondary reporting; the others are from
the announcements linked above.
