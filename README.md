# Alzado

Lo has visto mil veces. ¿Puedes dibujarlo de memoria?

**[Jugar a Alzado](https://alzado.pages.dev/)**

Un juego de dibujo de arquitectura: doce edificios, un reto diario y tarjetas para compartir. Dibuja la silueta de memoria y compara tu versión con un alzado simplificado. Los detalles son libres y no puntúan.

Sin registro, backend, analítica, fuentes externas ni dependencias de ejecución. Los dibujos y el progreso se guardan únicamente en el navegador.

## Desarrollo

Abre `public/index.html` directamente o sirve la carpeta con un servidor estático:

```sh
python3 -m http.server 8080 --directory public
```

El servidor de Python sirve para probar la interfaz; no aplica las cabeceras de Pages. Para probar también la política de seguridad localmente, usa `wrangler pages dev public`.

- `public/index.html`: interfaz, referencias vectoriales y puntuador en Canvas 2D.
- `public/_headers`: protecciones HTTP de Cloudflare Pages.
- `configurar.mjs`: metadatos públicos y hash del JavaScript autorizado por la CSP.
- `scripts/comprobar.mjs`: verificación de la preparación del despliegue, sin dependencias.
- `FUENTES.md`: fuentes y alcance de las interpretaciones arquitectónicas.
- `SECURITY.md`: revisión de seguridad y límites.
- `docs/PRUEBAS-ORIGINALES.md`: informe recibido con la versión anterior; no es una batería ejecutable.

## Publicación en Cloudflare Pages

El proyecto `alzado` utiliza **Direct Upload**, con la rama de producción `main`. Publica exclusivamente `public/`:

```sh
node configurar.mjs https://alzado.pages.dev/
node scripts/comprobar.mjs
npx wrangler pages deploy public --project-name alzado --branch main
```

Wrangler requiere autenticación en tu cuenta de Cloudflare. También puedes subir `public/` desde el panel de Pages. No hay compilación ni funciones de servidor.

**Después de modificar el JavaScript, ejecuta siempre `node configurar.mjs`**: recalcula el hash que permite ejecutar el juego. Una CSP desactualizada bloqueará el arranque. No actives inyección automática de analítica o scripts sin revisar esta política.

GitHub conserva el código; un `git push` por sí solo no despliega este proyecto Direct Upload. Consulta la [documentación de Cloudflare](https://developers.cloudflare.com/pages/get-started/direct-upload/).

## Progreso y reto diario

El reto cambia a las 00:00 UTC. La serie empieza el 11 de septiembre de 2026. `DAILY_IDS` fija las doce referencias y su calendario; añadir edificios a la colección no debe cambiar retrospectivamente esa lista.

La primera comparación diaria se conserva; los reintentos son práctica. La racha premia participar. Los bocetos y las marcas dependen del navegador y del dominio: no se sincronizan. El cambio de nombre conserva la clave local histórica `fachadas.v3` para no perder partidas existentes en este mismo dominio.

La puntuación es una métrica de juego, no un juicio arquitectónico. Las referencias y el puntuador son públicos; no existe protección antitrampas ni clasificación global.

## Licencia

MIT. Consulta [LICENSE](LICENSE).
