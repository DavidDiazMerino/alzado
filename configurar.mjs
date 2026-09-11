#!/usr/bin/env node
/** ALZADO: metadatos de la URL pública y CSP. No instala paquetes ni hace red.
 *   node configurar.mjs https://tu-sitio.pages.dev/
 *   node configurar.mjs    // solo recalcular CSP tras modificar el JavaScript
 */
import {readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const dir=new URL('./public/',import.meta.url);
const indexURL=new URL('index.html',dir);
try {
  let html=readFileSync(indexURL,'utf8');
  const supplied=process.argv[2];
  if(supplied){
    const base=new URL(supplied);
    if(base.protocol!=='https:'||base.username||base.password||base.search||base.hash)
      throw new Error('Usa la URL pública HTTPS de la carpeta del juego, sin usuario, consulta ni fragmento.');
    if(/\.html?$/i.test(base.pathname))throw new Error('Usa la URL de la carpeta que contiene index.html, no la del archivo HTML.');
    if(!base.pathname.endsWith('/'))base.pathname+='/';
    const esc=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
    const site=esc(base.href),image=esc(new URL('social-card.png',base).href);
    html=html.replace(/content="[^"]*" data-site="url"/g,`content="${site}" data-site="url"`)
             .replace(/content="[^"]*" data-site="image"/g,`content="${image}" data-site="image"`);
    html=html.replace(/<link rel="canonical"[^>]*>\s*/g,'');
    html=html.replace('</head>',`<link rel="canonical" href="${site}">\n</head>`);
    console.log('URL y tarjeta social configuradas para',base.href);
  }
  writeFileSync(indexURL,html);
  const hashes=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>"'sha256-"+createHash('sha256').update(m[1]).digest('base64')+"'");
  if(!hashes.length)throw new Error('No se ha encontrado el script inline esperado. Revisa el HTML.');
  const csp=`default-src 'none'; script-src ${hashes.join(' ')}; style-src 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'none'; font-src 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'; upgrade-insecure-requests`;
  writeFileSync(new URL('_headers',dir),`/*\n  Strict-Transport-Security: max-age=31536000\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), web-share=(self)\n  Content-Security-Policy: ${csp}\n`);
  console.log('Cabeceras regeneradas. Sube el contenido de',fileURLToPath(dir));
} catch(error){console.error('No se ha configurado el despliegue:',error.message);process.exitCode=1;}
