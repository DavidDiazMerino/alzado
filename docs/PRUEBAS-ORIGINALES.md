> Informe histórico incluido en el paquete original de Fachadas, previo al cambio de nombre a Alzado. Las comprobaciones de la revisión actual se documentan en [SECURITY.md](../SECURITY.md).

# Comprobaciones de la versión 4

## Entorno y límites

Chromium headless en el contenedor, cargando el HTML en el DOM mediante Playwright. No se ha utilizado un teléfono ni una tablet físicos. Los tamaños de pantalla, la entrada táctil y el almacenamiento se han emulado; la prueba del límite de `navigator.share` utiliza una implementación simulada y comprueba que la activación del clic sigue presente. También se prueba el caso de almacenamiento no disponible.

No se ha verificado Safari/WebKit real, la hoja nativa de compartir, Apple Pencil, el origen HTTPS definitivo, sus cabeceras efectivas ni la vista previa real en WhatsApp/X. Esas comprobaciones se dejan indicadas en LEEME.md.

## Resultado

35 de 35 comprobaciones satisfactorias; sin errores JavaScript no capturados en la batería.

- OK — 12 building cards
- OK — Exact shapes, resampling, position/scale and free details all score 100
- OK — Big Ben rectangle is not a high-scoring shortcut
- OK — Small width changes no longer produce stock width warning
- OK — Pronounced width and height feedback is symmetric
- OK — Daily 12-item bags, no adjacent repeats
- OK — Unfinished drawing saved after pointerup
- OK — Undo leaves no committed strokes
- OK — Redo restores drawing
- OK — Resume banner appears in a new browsing document
- OK — Draft restoration retains points
- OK — Orientation keeps drawing geometry unchanged
- OK — Landscape focused canvas is square and stays in view
- OK — Comparing exits focus and preserves result
- OK — Judged draft removed
- OK — PNG ready before native share click
- OK — Native share invoked during user activation
- OK — Reference toggle regenerates card
- OK — Unsupported file sharing opens image fallback
- OK — Retry is explicitly practice
- OK — Retry does not overwrite first daily score
- OK — Daily record and heading restore correctly
- OK — Corrupt storage does not block play
- OK — Storage-denied warning appears but game remains usable
- OK — Secondary touch is ignored
- OK — Pointer cancellation does not leave a ghost stroke
- OK — Layout 320×568: no overflow, square canvas, visible focus controls
- OK — Layout 375×667: no overflow, square canvas, visible focus controls
- OK — Layout 390×844: no overflow, square canvas, visible focus controls
- OK — Layout 430×932: no overflow, square canvas, visible focus controls
- OK — Layout 768×1024: no overflow, square canvas, visible focus controls
- OK — Layout 820×1180: no overflow, square canvas, visible focus controls
- OK — Layout 1024×768: no overflow, square canvas, visible focus controls
- OK — Layout 1440×900: no overflow, square canvas, visible focus controls
- OK — No uncaught app errors

## Puntuación

Para las 12 referencias, el contorno exacto obtiene 100. Lo mantiene al añadir vértices sobre las mismas líneas, trasladar/escalar uniformemente el dibujo o añadir sus detalles como capa libre. El rectángulo de Elizabeth Tower obtiene 48. Se han comprobado cambios claros de anchura en ambos sentidos y una desviación moderada que ya no añade la frase de proporciones.

Estas pruebas no equivalen a una calibración estadística con jugadores. La dificultad y la utilidad del feedback necesitan observación de dibujos humanos.

## Preparación del paquete

Se ha ejecutado configurar.mjs sobre una copia con un dominio sintético, incluyendo un subdirectorio. Las URL absolutas y el canonical quedan correctos, ejecutar dos veces no duplica el canonical y se rechaza una URL no HTTPS. El hash CSP coincide con el script del HTML y el juego arranca al aplicar esa política mediante una etiqueta meta en el navegador de prueba. Las cabeceras HTTP reales y frame-ancestors requieren comprobación en el despliegue final. El generador de enlaces se ha probado con ubicaciones HTTPS y file sintéticas.
