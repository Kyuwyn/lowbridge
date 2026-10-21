import { mkdir, copyFile } from 'node:fs/promises';
import { join } from 'node:path';

export const root = join(import.meta.dir, '..');
export const output = join(root, 'dist');

export async function build() {
  await mkdir(output, { recursive: true });
  const result = await Bun.build({
    entrypoints: [join(root, 'src/main.ts')],
    outdir: output,
    target: 'browser',
    sourcemap: 'external',
    minify: false,
  });
  if (!result.success) throw new AggregateError(result.logs, 'Lowbridge build failed');
  const html = (await Bun.file(join(root, 'index.html')).text())
    .replace('/src/main.ts', '/main.js')
    .replace('/src/style.css', '/style.css');
  await Bun.write(join(output, 'index.html'), html);
  await copyFile(join(root, 'src/style.css'), join(output, 'style.css'));
  return result;
}

if (import.meta.main) {
  const result = await build();
  console.log(`Built Lowbridge: ${result.outputs.length} bundled assets → dist/`);
}
