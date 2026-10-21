import { join } from 'node:path';
import { build, output } from './build';

export async function startServer(port = Number(process.env.PORT || 4173)) {
 await build();
 return Bun.serve({
  hostname: '127.0.0.1',
  port,
  async fetch(request) {
    const path = new URL(request.url).pathname;
    const name = path === '/' ? 'index.html' : path.slice(1);
    if (!['index.html', 'main.js', 'main.js.map', 'style.css'].includes(name)) {
      return new Response('Not found', { status: 404 });
    }
    const file = Bun.file(join(output, name));
    return new Response(file, { headers: { 'Cache-Control': 'no-store' } });
  },
 });
}

if (import.meta.main) {
  const server = await startServer();
  console.log(`Lowbridge is running at ${server.url}`);
}
