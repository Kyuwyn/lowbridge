# Web stack — Breaking Changes

*Last verified: 2026-11-19*

What changed in the pinned toolchain since the versions most model training data
describes. Every entry comes from a page fetched on 2026-11-19 (see Sources). The pages
were read through a summarising fetch tool, so check an exact option name against its
source page before relying on it. Gaps are marked `NOT SOURCEABLE`.

## TypeScript 5.x / 6.0 → 7.0

Source: Announcing TypeScript 7.0 (S1).

### Defaults that are now different

7.0 adopts the defaults 6.0 introduced:

| Option | Default in 7.0 | Note |
|--------|----------------|------|
| `strict` | `true` | |
| `module` | `esnext` | |
| `target` | the current stable ECMAScript version just before `esnext` | |
| `types` | `[]` | No `@types` package is included automatically. Set `["*"]` for the old behaviour, or list what you need |
| `rootDir` | `./` | Inner source directories must be set explicitly |
| `noUncheckedSideEffectImports` | `true` | |
| `libReplacement` | `false` | |
| `stableTypeOrdering` | `true` | Cannot be turned off |

NOT SOURCEABLE — a new default for `moduleResolution`; not stated at S1. This project
sets `"moduleResolution": "bundler"` explicitly.

### Now hard errors or no-ops

- `target: es5`, and `downlevelIteration`
- `moduleResolution: node` / `node10` (use `nodenext` or `bundler`), and `moduleResolution: classic`
- `module: amd`, `umd`, `systemjs`, `none` (use `esnext` or `preserve`)
- `baseUrl` (make `paths` relative to the project root)
- `esModuleInterop: false`, `allowSyntheticDefaultImports: false`, `alwaysStrict: false`
- The `module` keyword in namespace declarations
- The `asserts` keyword on imports (use `with`)
- `/// <reference no-default-lib />` under `skipDefaultLibCheck`
- File paths on the command line when the current directory has a `tsconfig.json`, unless `--ignoreConfig` is passed
- Every flag and construct deprecated in 6.0

Also breaking: template literal inference treats a surrogate-pair emoji as one unit.

### Not in 7.0

- **No programmatic API.** A new, different API is expected in 7.1.
- Tools that embed TypeScript (Volar is the page's example) can only use 6.0 for now.
- Vue, MDX, Astro and Svelte need 6.0 for now. Angular template checking stays on 6.0 for
  editor support, while 7.0's `tsc` can run project-wide checks from the command line.

**This bears on the interface-layer decision at `/create-architecture`:** choosing one of
those frameworks means running TypeScript 6.0 beside 7.0 until their tooling moves.

### JavaScript and JSDoc checking

JS analysis now follows `.ts` analysis more closely: values cannot be used as types
(use `typeof value`), `@enum` and `@class` are no longer recognised, a standalone `?`
type and postfix `!` are gone, and Closure-style function types are removed. S1 points
to `CHANGES.md` in the typescript-go repository for the full list (not fetched).

## Vite 7 → 8

Source: Migration from v7 (S2).

Vite 8 uses Rolldown and Oxc in place of Rollup and esbuild.

### Changed defaults

- `build.target` default (`'baseline-widely-available'`) moves to Chrome 111, Edge 111, Firefox 114, Safari 16.4.
- JavaScript is minified by the Oxc minifier, and CSS by Lightning CSS.
- CommonJS default-import interop changed (`legacy.inconsistentCjsInterop: true` restores the old behaviour temporarily).
- `require` calls for externalised modules are preserved.
- `import.meta.url` is no longer polyfilled in UMD/IIFE output.
- `build()` throws a `BundleError`; individual errors are in `.errors`.

### Removed

- Passing a URL to `import.meta.hot.accept` (pass an id).
- `output.format` values `'system'` and `'amd'`.
- The object form of `output.manualChunks`.
- `build.rollupOptions.watch.chokidar` (use `build.rolldownOptions.watch.watcher`).
- The hooks `shouldTransformCachedModule`, `resolveImportMeta`, `renderDynamicImport`, `resolveFileUrl`.
- `esbuild.supported` and the property-mangling options (`mangleProps`, `reserveProps`, `mangleQuoted`, `mangleCache`).
- Extglobs in patterns; transforming to ES5 and below with plugin-legacy.
- Listing the same browser twice in `build.target` is now an error.

### TypeScript handling

- Oxc transforms TypeScript and JavaScript.
- Native decorators are not lowered by Oxc.
- The legacy TypeScript `namespace` has partial support.
- NOT SOURCEABLE — handling of `const enum`, `isolatedModules`, `verbatimModuleSyntax`, and which `tsconfig` options Vite respects; not stated at S2.
- NOT SOURCEABLE — Vite 8's Node.js requirement; not stated at S2. The npm registry metadata for 8.3.8 gives `^20.19.0 || >=22.12.0`.
- NOT SOURCEABLE — changes between Vite 8.0 and 8.3.8; no 8.1 to 8.3 release notes were fetched.

## Vitest 4 → 5

Source: Vitest 5.0 announcement (S3). It says there are "several breaking changes" and
does not list them all; the migration guide it links (S3a) was not fetched.

- Requires Vite 6.4.0 or later and Node.js 22.12.0 or later.
- `clearMocks` defaults to `true`: `vi.clearAllMocks()` runs before every test.
- An unawaited async assertion (`resolves`, `rejects`, `toMatchFileSnapshot`) now fails the test; before, it only warned.
- `expect.poll` rejects when it does not settle within `timeout`.
- Inline projects inherit the root config by default (Vitest 4 needed `extends: true`).
- Fake timers mock `Temporal` (opt out through `toNotFake`).
- Reporters write to one `.vitest` directory at the project root by default. This repo ignores it in `.gitignore`.
- `bench` is no longer a top-level import; it is a test-context fixture.
- The `Matchers` interface takes the return type first (`Matchers<R, T>`).
- Browser Mode locators are strict by default (`locators.exact`).
- NOT SOURCEABLE — changes between Vitest 5.0 and 5.1.1; no 5.1 release notes were fetched.

## Node.js 24 → 26

Source: Node.js 26.0.0 release post (S4).

- The Temporal API is enabled by default.
- V8 is 14.6 (adds `Map.prototype.getOrInsert()`, `getOrInsertComputed()` and `Iterator.concat()`); Undici is 8.0.2.
- Removed: `http.Server.prototype.writeHeader()` (use `writeHead()`), the legacy `_stream_wrap`, `_stream_readable`, `_stream_writable`, `_stream_duplex`, `_stream_transform` and `_stream_passthrough` modules, and the `--experimental-transform-types` flag.
- Runtime-deprecated: `module.register()`, and DEP0201, DEP0203, DEP0204.
- NOT SOURCEABLE — the npm version bundled with Node.js 26; not stated at S4.

## Sources

| Id | Page | Fetched |
|----|------|---------|
| S1 | https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/ | 2026-11-19 |
| S2 | https://vite.dev/guide/migration.md | 2026-11-19 |
| S3 | https://v5.cn.vitest.dev/blog/vitest-5 | 2026-11-19 |
| S3a | https://v5.cn.vitest.dev/guide/migration/ | not fetched |
| S4 | https://nodejs.org/tr/blog/release/v26.0.0 | 2026-11-19 |
