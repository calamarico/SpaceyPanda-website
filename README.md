# SpaceyPanda Website

Frontend del sitio de SpaceyPanda construido con Vite, React, TypeScript y Tailwind CSS v4.

## Stack

- [Vite](https://vite.dev/) — bundler / dev server
- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/) vía `@tailwindcss/vite`
- ESLint con la configuración por defecto de Vite

## Requisitos

- Node.js >= 20.19 (probado con Node 22)

## Scripts

```bash
npm install      # instalar dependencias
npm run dev      # servidor de desarrollo con HMR
npm run build    # build de producción (type-check + bundle)
npm run preview  # servir el build de producción localmente
npm run lint     # linter
```

## Estructura

```
.
├── index.html              # <head>: meta, OG/Twitter, canonical, preloads
├── public/                 # estáticos servidos tal cual
│   ├── fonts/              # woff2 auto-hospedados (Inter, Space Grotesk, JetBrains Mono)
│   ├── _headers            # cabeceras de Cloudflare Pages (cache + seguridad)
│   ├── robots.txt          # + referencia al sitemap
│   └── 404.html            # página de error propia
├── scripts/
│   ├── sync-catalog.ts     # catálogo desde la API de Spotify
│   └── prerender.ts        # paso de SSG (ver abajo)
├── src/
│   ├── main.tsx            # entrypoint del navegador (hidrata)
│   ├── entry-server.tsx    # entrypoint de SSG (solo build)
│   ├── App.tsx             # componente raíz
│   ├── lib/structuredData.ts # grafo JSON-LD de schema.org
│   └── index.css           # @import "tailwindcss"; + @font-face
├── vite.config.ts          # plugin de React + plugin de Tailwind v4
└── tsconfig*.json
```

Tailwind v4 ya no necesita `tailwind.config.js` ni `postcss.config.js`: la configuración se hace en CSS con directivas como `@theme`. Ver [docs](https://tailwindcss.com/docs/installation/using-vite).

## Build y SEO

`npm run build` encadena cuatro pasos:

1. `tsc -b` — type-check.
2. `vite build` — bundle del navegador.
3. `vite build --ssr src/entry-server.tsx` — bundle de SSG (temporal, se borra al final).
4. `tsx scripts/prerender.ts` — genera el HTML final.

El paso 4 es el que hace que el sitio sea indexable. Genera **una página estática
por URL**, usando `dist/index.html` como plantilla:

| URL | Contenido |
| --- | --- |
| `/` | La home |
| `/releases/` | Índice del catálogo completo |
| `/releases/<slug>/` | Una página por lanzamiento (57 a día de hoy) |

Las páginas de lanzamiento existen por SEO: el sitio era una sola URL, así que
toda su superficie de búsqueda era el nombre del artista — compitiendo contra
Spotify, Apple Music, Bandcamp y compañía por él. Cada lanzamiento tiene un
título que la gente busca y que ninguna página de la web reclama.

Los slugs salen de `src/lib/releaseUrl.ts` y **deben ser estables**: si dos
lanzamientos generan el mismo slug, se lo queda el más antiguo y el nuevo recibe
un sufijo con su id de Spotify. Nunca asignes slugs por orden del array, o un
lanzamiento nuevo le robaría la URL a uno viejo (y eso es un 404 para quien la
hubiera enlazado).

Sobre cada página:

- **Prerenderiza `<App />`** dentro de `#root`. El sitio es una SPA, así que sin
  esto los rastreadores que no ejecutan JavaScript (Bing, GPTBot, ClaudeBot,
  PerplexityBot y todos los scrapers de previsualización de enlaces) verían una
  página vacía. En el navegador React **hidrata** ese HTML: la app sigue siendo
  igual de interactiva.
- **Sustituye el bloque `PAGE-META`** de `index.html` (entre los comentarios
  `<!-- PAGE-META:start -->` y `:end`) por el título, description, canonical y
  tarjetas sociales de esa página — ver `src/lib/releaseMeta.ts`. **No borres los
  marcadores**, el build falla sin ellos.
- **Inyecta el JSON-LD** de `src/lib/structuredData.ts`: un grafo
  `MusicGroup` + `WebSite` + `WebPage` + un `MusicAlbum` por cada lanzamiento,
  generado desde `data.ts` y el catálogo sincronizado, con `sameAs` a todos los
  perfiles de streaming (así Google enlaza el sitio con la entidad "Spacey Panda"
  que ya conoce de Spotify / Apple Music / Beatport). Cada página de lanzamiento
  lleva además su propio `MusicAlbum` + `BreadcrumbList`.
- **Trae los últimos posts del blog** del feed de WordPress *en tiempo de build*,
  para que el HTML indexado no contenga los artículos congelados de `data.ts`.
  Si el feed no responde, cae al listado estático sin romper el build.
- **Escribe `sitemap.xml`** con las 59 URLs.

El CSS **no** se inlinea: con 59 páginas enlazadas entre sí, una hoja compartida
y cacheada para siempre gana a repetir 54 kB en cada documento.

### Reglas para no romper la hidratación

El HTML prerenderizado y el primer render del navegador tienen que coincidir
exactamente, o React descarta el marcado y se pierde la ventaja. En la práctica:

- Nada de `Math.random()`, `Date.now()` ni lectura de `window`/`localStorage`
  durante el render. El campo de estrellas de `Blog.tsx` usa un PRNG con semilla
  por este motivo.
- Los valores que sólo existen en el navegador (como el parámetro `?view=` de
  `Releases.tsx`) se leen con `useSyncExternalStore`, pasando el valor del
  servidor como `getServerSnapshot`.
- Si algo se obtiene por red y afecta al primer render, hay que sembrarlo desde
  el build igual que hace `src/lib/blogSeed.ts`.
- No hay router: `src/main.tsx` decide qué montar a partir de `location.pathname`
  y tiene que coincidir exactamente con lo que `entry-server.tsx` renderizó para
  esa ruta.

### Tarjetas de lanzamiento

Las tarjetas de la home son `<a href="/releases/…">` reales (así las rastrea
Google y funciona "abrir en pestaña nueva"), pero un clic normal abre el modal de
siempre — ver `opensModal` y `CardLink` en `Releases.tsx`. El enlace se estira
sobre la tarjeta con `.sp-card-link` en lugar de envolverla, para no tocar los
layouts de grid/flex existentes. Cualquier control real dentro de una tarjeta
necesita `z-index` por encima de él.

Tras tocar componentes, comprueba la consola del navegador sobre
`npm run preview`: un aviso de hydration mismatch significa que el prerender ya
no sirve de nada.

### Imágenes

`public/*.webp` y `og-image.jpg` se generaron a partir de los originales en
`src/assets/` (que se conservan como fuente). El logo del hero es el elemento
LCP: va con `srcset`, `fetchpriority="high"` y su `<link rel="preload">`
correspondiente en `index.html`.
