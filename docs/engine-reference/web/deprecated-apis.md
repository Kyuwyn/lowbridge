# Web stack — Deprecated and Renamed Options

*Last verified: 2026-11-19*

"Don't use X → use Y" for the pinned toolchain. Sources are the pages listed in
`breaking-changes.md` § Sources (S1 to S4), read through a summarising fetch tool.

## TypeScript 7.0 (S1)

| Don't use | Use instead |
|-----------|-------------|
| `"moduleResolution": "node"` / `"node10"` / `"classic"` | `"bundler"` (this project) or `"nodenext"` |
| `"module": "amd"` / `"umd"` / `"systemjs"` / `"none"` | `"esnext"` or `"preserve"` |
| `"target": "es5"`, `"downlevelIteration"` | A modern target; neither is supported |
| `"baseUrl"` | `paths` written relative to the project root |
| `import x from "y" assert { ... }` | `import x from "y" with { ... }` |
| `module Foo { }` namespaces | `namespace Foo { }` |
| `tsc file.ts` in a directory with a `tsconfig.json` | `tsc` (project mode), or `tsc --ignoreConfig file.ts` |
| Relying on automatic `@types/*` inclusion | List packages in `types` (default is `[]`) |
| The `typescript` JavaScript API (`ts.createProgram` and similar) | Not available in 7.0. Use the `@typescript/typescript6` package (it provides `tsc6` and re-exports the 6.0 API) until 7.1 ships a new one |
| `@typescript/native-preview` | The `typescript` package itself; nightlies use the `next` tag |
| JSDoc `@enum`, `@class`, standalone `?` type, postfix `!` | A `@typedef`, a `class` declaration, `any`, the plain type |

## Vite 8 (S2)

| Don't use | Use instead |
|-----------|-------------|
| `build.rollupOptions` | `build.rolldownOptions` |
| `worker.rollupOptions` | `worker.rolldownOptions` |
| `optimizeDeps.esbuildOptions` | `optimizeDeps.rolldownOptions` |
| The top-level `esbuild` option | `oxc` |
| `esbuild.minify*` | `build.rolldownOptions.output.minify` |
| `esbuild.drop` | The `compress.drop*` options |
| `esbuild.banner` / `esbuild.footer` | A plugin with a transform hook |
| `transformWithEsbuild` | `transformWithOxc` |
| `build.minify: 'esbuild'`, `build.cssMinify: 'esbuild'` | The defaults (Oxc minifier, Lightning CSS). `esbuild` is now an optional dependency you must install yourself to use these |
| `output.manualChunks` (function form deprecated, object form removed) | `codeSplitting` |
| `resolve.alias[].customResolver` | A plugin with a `resolveId` hook and `enforce: 'pre'` |
| `parseAst` / `parseAstAsync` | `parseSync` / `parse` |
| `build.commonjsOptions`, `build.dynamicImportVarsOptions.warnOnError` | Nothing; both are now no-ops |

## Vitest 5 (S3)

| Don't use | Use instead |
|-----------|-------------|
| `import { bench } from 'vitest'` | The `bench` fixture from the test context |
| `experimental.fsModuleCache` | `fsModuleCache` |
| `extends: true` on each inline project | Nothing; inheriting the root config is the default |
| Assuming mocks keep their call history between tests | Set `clearMocks: false`, or assert within the test |

## Node.js 26 (S4)

| Don't use | Use instead |
|-----------|-------------|
| `http.Server.prototype.writeHeader()` | `writeHead()` |
| `require('_stream_readable')` and the other `_stream_*` modules | `node:stream` |
| `module.register()` | NOT SOURCEABLE — the replacement is not stated at S4 |
| `--experimental-transform-types` | NOT SOURCEABLE — the replacement is not stated at S4 |
