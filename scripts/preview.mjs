import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { root } from './validate.mjs';
import { build } from './build.mjs';
await build();
const dist = path.join(root, 'dist');
const port = Number(process.env.PORT || 4321);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.png':'image/png'};
http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    const decoded = decodeURIComponent(url.pathname);
    const file = path.resolve(dist, '.' + decoded);
    if (!file.startsWith(dist + path.sep) && file !== dist) throw new Error('Invalid path');
    const stat = await fs.stat(file);
    if (stat.isDirectory() && !decoded.endsWith('/')) {
      response.writeHead(301, {Location: url.pathname + '/' + url.search}); response.end(); return;
    }
    const actual = stat.isDirectory() ? path.join(file, 'index.html') : file;
    response.writeHead(200, {'Content-Type': types[path.extname(actual)] || 'application/octet-stream'});
    response.end(await fs.readFile(actual));
  } catch {
    response.writeHead(404, {'Content-Type':'text/html; charset=utf-8'});
    response.end(await fs.readFile(path.join(dist, '404.html')));
  }
}).listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}\nDemo: http://127.0.0.1:${port}/example-cafe/\nRun again after editing repository files to rebuild.`));
