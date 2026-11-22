# Web stack — Current Practices

*Last verified: 2026-11-19*

Practices that follow from the pinned versions. Each is either sourced from a page in
`breaking-changes.md` § Sources (S1 to S4) or was checked by running it; the line says
which. This file holds no general TypeScript advice from memory.

## Checked by running (2026-11-19)

The scaffold in this repo (`package.json`, `tsconfig.json`, `index.html`, `src/main.ts`)
was installed with `npm install`, then `npm run typecheck`, `npm run build` and
`npm test` each exited 0, on Node.js 22.23.4 with npm 10.9.9. It was not run on the
pinned Node.js 26.

- This `tsconfig.json` type-checks under TypeScript 7.0.2 with Vite 8.3.8:
  `"moduleResolution": "bundler"`, `"types": ["vite/client"]`, `"noEmit": true`,
  `"isolatedModules": true`, `"verbatimModuleSyntax": true`, `"skipLibCheck": true`.
  `strict`, `module` and `target` are left to the 7.0 defaults.
- `vitest run --passWithNoTests` exits 0 on Vitest 5.1.1 when no test file exists.
- `vite build` needs no `vite.config.ts` for a plain TypeScript entry loaded from `index.html`.

## From the sources

- **Type checking is a separate step.** Vite transforms TypeScript with Oxc (S2); run
  `npm run typecheck` (`tsc --noEmit`) to catch type errors.
- **Name every `@types` package you rely on** in `types`; nothing is included by default (S1).
- **Set `rootDir` explicitly if the compiler ever emits files**; the default is `./` (S1).
- **Do not write tooling against the `typescript` JavaScript API.** 7.0 has none (S1). A
  validator or build script that needs to inspect types must wait for 7.1 or use
  `@typescript/typescript6`.
- **Check framework tooling before choosing an interface layer.** Vue, MDX, Astro and
  Svelte tooling needs TypeScript 6.0 for now (S1).
- **Await every async assertion** in tests; an unawaited one now fails (S3).
- **Do not rely on mock state carrying between tests**; `clearMocks` is on by default (S3).
- **`Temporal` is available in Node.js 26 without a flag** (S4), and Vitest's fake timers
  mock it (S3). NOT SOURCEABLE — whether the browsers this game targets support
  `Temporal`; no page fetched says. Do not use it in game code until that is checked.
- **Browser floor.** Vite's default build target is Chrome 111, Edge 111, Firefox 114 and
  Safari 16.4 (S2). Game code may use what those support without a polyfill.

## Open items for `/create-architecture`

- The interface layer (plain DOM or a framework), with the TypeScript 6.0 constraint above in view.
- The mobile app wrapper. None is installed.
- Linting and formatting. None is installed.
- Where the headless rules core lives, and how the validator runs it from the command line.
