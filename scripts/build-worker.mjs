import { readFile, writeFile } from 'node:fs/promises';
const types = {'index.html':'text/html; charset=utf-8','sw.js':'application/javascript; charset=utf-8','manifest.webmanifest':'application/manifest+json','icon.svg':'image/svg+xml','icon-192.png':'image/png','icon-512.png':'image/png'};
const assets = {};
for(const [name,type] of Object.entries(types)) assets['/'+name]={type,body:(await readFile(new URL('../'+name,import.meta.url))).toString('base64')};
const handler = `export default {
 async fetch(request) {
  const url = new URL(request.url);
  if (!['GET','HEAD'].includes(request.method)) return new Response('Method not allowed',{status:405,headers:{Allow:'GET, HEAD'}});
  const path = url.pathname === '/' ? '/index.html' : url.pathname;
  const asset = assets[path];
  if (!asset) return new Response('Not found',{status:404});
  const headers = {'Content-Type':asset.type,'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Cache-Control':path === '/index.html' || path === '/sw.js' ? 'no-cache' : 'public, max-age=3600'};
  if(path === '/sw.js') headers['Service-Worker-Allowed']='/';
  return new Response(request.method === 'HEAD' ? null : Uint8Array.from(atob(asset.body),c=>c.charCodeAt(0)),{headers});
 }
};`;
await writeFile(new URL('../worker.mjs',import.meta.url),'const assets = '+JSON.stringify(assets)+';\n'+handler+'\n');
