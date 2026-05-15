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
├── index.html
├── public/                 # estáticos servidos tal cual
├── src/
│   ├── main.tsx            # entrypoint React
│   ├── App.tsx             # componente raíz
│   └── index.css           # @import "tailwindcss";
├── vite.config.ts          # plugin de React + plugin de Tailwind v4
└── tsconfig*.json
```

Tailwind v4 ya no necesita `tailwind.config.js` ni `postcss.config.js`: la configuración se hace en CSS con directivas como `@theme`. Ver [docs](https://tailwindcss.com/docs/installation/using-vite).
