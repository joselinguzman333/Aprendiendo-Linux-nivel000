es codigo de sonnet 5 el 14 julio 2026 .
se me daño el ordenador y quiero aprender Linux y le pedi me hiciera una app para practicar en el móvil.

# Terminal Lab — app instalable (PWA)

Esta carpeta es una **app web progresiva (PWA)**: se instala en el móvil como una app real
(icono propio, pantalla completa, funciona sin internet) y puede recibir actualizaciones d loe
contenido (comandos nuevos, lecciones nuevas) sin que tengas que reinstalar nada.

## Qué hay aquí
- `index.html` — la app (terminal + lecciones).
- `manifest.json` — nombre, icono y colores para cuando se instala.
- `sw.js` — el "service worker": guarda la app para que funcione offline y revisa si hay
  contenido nuevo cada vez que abres la app con internet.
- `icon-192.png`, `icon-512.png`, `icon-512-maskable.png` — iconos de la app.
- `content/modules.json` — las 21 lecciones (módulos, explicaciones, tareas, pistas).
- `content/reference.json` — la chuleta completa de comandos.
- `content/version.json` — número de versión del contenido y changelog.

## Paso 1: subirlo a internet (obligatorio)
Para que funcione como app instalable de verdad (con actualizaciones automáticas), el
navegador exige que esté servido por **HTTPS**, no puede ser un archivo suelto en tu móvil.
La forma más fácil y gratuita es **GitHub Pages**:

1. Crea una cuenta gratuita en https://github.com si no tienes.
2. Crea un repositorio nuevo (por ejemplo `terminal-lab`).
3. Sube **todos los archivos de esta carpeta** manteniendo la carpeta `content/` tal cual
   (botón "Add file" → "Upload files" en la web de GitHub, o arrastrando la carpeta entera).
4. Ve a **Settings → Pages**, en "Source" elige la rama `main` y la carpetabre(root)`, guarda.
5. En un par de minutos tendrás una URL como:
   `https://tu-usuario.github.io/terminal-lab/`

## Paso km 2: instalarla en el móvil
1. Abre esa URL en Chrome (Android) o Safari (iPhone).
2. Android: menú (⋮) → "Instalar app" o "Añadir a pantalla de inicio".
   iPhone: botón compartir (□↑) → "Añadir a pantalla de inicio".
3. Listo — icono propio, se abre a pantalla completa, funciona sin conexión después de la
   primera vez.

## Cómo añadir comandos o lecciones nuevas en el futuro
No hace falta tocar el código de la app. Solo edita estos archivos y vuelve a subirlos a tu
repositorio de GitHub:
un
- **Nuevo comando en la chuleta** → añade una entrada en `content/reference.json`
  dentro de la categoría que corresponda:
  ```json
  {"cmd":"df -h", "desc":"Muestra el uso de disco en formato legible."}
  ```
- **Lección nueva** → añade un objeto dentro del módulo que quieras en
  `content/modules.json`:
  ```json
  {
    "title":"Nombre de la lección",
    "explain":"Explicación del comando.",
    "task":"Escribe: comando ejemplo",
    "hint":"Escribe: comando ejemplo",
    "answer":"comando ejemplo",
    "test":{"__regex":true,"source":"^comando\\s+ejemplo$","flags":"i"}
  }
  ```
  (el campo `test` es la expresión regular, en formato `^...$`, que detecta cuando el
  usuario ha escrito el comando correcto)
- **Módulo nuevo** → añade un objeto `{"title":"...", "icon":"🧩", "lessons":[...]}` al
  array de `content/modules.json`.
- Actualiza `content/version.json` con el nuevo número y una línea de changelog, para que
  la app muestre "contenido actualizado" en el pie de página.

Como `sw.js` pide `content/*.json` **directo a la red primero**, en cuanto subas los cambios
a GitHub, cualquiera que abra la app con internet recibirá el contenido nuevo automáticamente
— sin reinstalar ni tocar nada más.

## Si cambias el diseño o el motor de comandos (index.html)
Sube en `sw.js` el número de `SHELL_VERSION` (por ejemplo de `'v1'` a `'v2'`). Eso hace que
el service worker borre la caché antigua e instale la nueva versión; los usuarios verán el
aviso amarillo "Hay una nueva versión disponible" la próxima vez que abran la app con
conexión, y con un toque se actualiza.
