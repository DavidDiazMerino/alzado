# Seguridad de Alzado

Revisión del 11 de septiembre de 2026 sobre el código local y `https://alzado.pages.dev/`.

## Evaluación

La superficie de ataque es pequeña y las medidas son proporcionadas para este juego público. No se han identificado vulnerabilidades graves en esta revisión. No constituye una auditoría exhaustiva ni garantiza ausencia de fallos.

La aplicación es estática: HTML, JavaScript, Canvas y recursos locales. El despliegue de Pages revisado no utiliza Functions, variables de entorno, base de datos, cuentas de jugadores ni API. No hay dependencias de ejecución de terceros. El código, las referencias y las notas calculadas pueden inspeccionarse y modificarse en el navegador; no hay clasificación global ni promesa antitrampas.

## Protecciones comprobadas

- HTTPS y redirección desde HTTP en el sitio público.
- CSP que autoriza únicamente el hash del script de la aplicación. Bloquea conexiones de red (`connect-src 'none'`), objetos, formularios y cambios de URL base.
- `frame-ancestors 'none'` y `X-Frame-Options: DENY` impiden incluir el juego en un iframe.
- `X-Content-Type-Options: nosniff`, política de referente y permisos restringidos; compartir requiere el gesto del usuario.
- HSTS añadido para recordar HTTPS durante un año. No se aplica `includeSubDomains` ni se solicita preload.
- Los parámetros de edificio se buscan en un catálogo cerrado; las fechas se validan. No se interpolan directamente en HTML. Los datos persistidos se validan al leerlos; las notas utilizadas en HTML deben ser numéricas y acotadas.
- No se encontraron credenciales, claves privadas ni archivos de entorno en los archivos seleccionados para GitHub. Solo se publica `public/` en Pages. Las rutas `/.env` y `/.git/config` devolvieron 404 en la revisión del sitio.
- La clave histórica de almacenamiento `fachadas.v3` se conserva deliberadamente para mantener el progreso tras el cambio de marca.

La política permite estilos inline porque la interfaz los utiliza. La autorización de JavaScript está separada y no permite scripts inline arbitrarios ni `eval`.

## Pruebas de esta revisión

Chromium automatizado con el servidor local de Wrangler aplicando `_headers`: arranque sin errores JavaScript ni infracciones CSP; doce edificios; contornos exactos con nota 100; dibujo, deshacer, rehacer y recuperación del boceto tras recargar; generación y descarga PNG; alternativa a compartir archivos; nueva marca en textos y nombres de descarga; parámetros maliciosos y datos locales inválidos sin inyección HTML; interfaz sin desbordamiento horizontal a 320, 390 y 768 píxeles; funcionamiento con almacenamiento denegado.

La misma prueba de navegador se repitió satisfactoriamente sobre la URL de producción tras desplegar. El HTML y la imagen social servidos coinciden con los archivos locales. Se verificó además que el navegador bloquea un script inline ajeno al hash y una petición `fetch`, y que las rutas inexistentes mantienen respuesta 404. Cloudflare confirma un despliegue de producción satisfactorio y sin Functions.

La comprobación reproducible `node scripts/comprobar.mjs` valida sintaxis, hash CSP, cabeceras, metadatos, marca y lista cerrada de archivos publicables. No sustituye las pruebas de navegador.

No se han probado en dispositivos físicos Safari/iOS, Apple Pencil, la hoja nativa de compartir ni la caché de previsualizaciones de WhatsApp. Tampoco se han realizado pruebas de carga o ataques contra la infraestructura de Cloudflare, ni se ha auditado la seguridad de acceso a las cuentas del propietario.

## Mantenimiento

Después de editar JavaScript, ejecutar `node configurar.mjs` y `node scripts/comprobar.mjs` antes de publicar. Mantener las credenciales fuera del repositorio. No introducir analítica, scripts externos, formularios, subidas, cuentas o endpoints sin revisar este modelo: `_headers` protege respuestas estáticas, pero no añade automáticamente cabeceras a futuras Pages Functions.

No hace falta CAPTCHA para el funcionamiento actual: no hay operaciones de servidor ni formularios que proteger de abuso. Cloudflare gestiona la entrega pública; no se han añadido reglas WAF personalizadas ni controles de acceso al juego.

## Referencias

- [Cabeceras de Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/headers/).
- [Direct Upload y publicación](https://developers.cloudflare.com/pages/get-started/direct-upload/).

Si descubres una vulnerabilidad, evita publicar credenciales o información sensible en una incidencia pública.
