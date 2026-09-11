#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { Script } from 'node:vm';

const publicDir = new URL('../public/', import.meta.url);
const html = readFileSync(new URL('index.html', publicDir), 'utf8');
const headers = readFileSync(new URL('_headers', publicDir), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
assert.equal(scripts.length, 1, 'Expected one application script');
new Script(scripts[0][1]);
const hash = createHash('sha256').update(scripts[0][1]).digest('base64');
assert(headers.includes(`script-src 'sha256-${hash}';`), 'CSP hash is stale: run node configurar.mjs');
for (const rule of ["connect-src 'none'", "frame-ancestors 'none'", "base-uri 'none'", "form-action 'none'", 'X-Content-Type-Options: nosniff', 'X-Frame-Options: DENY', 'Strict-Transport-Security: max-age=31536000']) {
  assert(headers.includes(rule), `Missing security directive: ${rule}`);
}
assert(headers.split('\n').every(line => line.length <= 2000), 'Pages header line exceeds limit');
assert(!/\son[a-z]+\s*=/i.test(html), 'Inline event handlers are not permitted');
assert(!/<script\b[^>]+src=/i.test(html), 'External scripts require a security review');
assert.match(html, /<link rel="canonical" href="https:\/\/alzado.pages.dev\/">/);
assert.match(html, /content="https:\/\/alzado.pages.dev\/social-card.png" data-site="image"/);
assert.match(html, /const STORE_KEY='fachadas.v3'/, 'Preserve existing saved games');
assert(!/FACHADAS|Fachadas|F A C H A D A S/.test(html), 'Old public brand remains');
const allowed = ['index.html', '404.html', '_headers', 'favicon.svg', 'icon-180.png', 'social-card.png', 'robots.txt'];
assert.deepEqual(readdirSync(publicDir).sort(), allowed.sort(), 'Unexpected file in deployment directory');
console.log('OK: JavaScript syntax, CSP hash, security headers, branding, metadata and deployment files.');
