# Nuxt UI Template

Plantilla de Nuxt 4 con Nuxt UI, Tailwind CSS v4 y tema claro/oscuro basado en tokens semánticos.

## Quick Start

```bash
pnpm install
pnpm dev
```

| Comando | Descripción |
| --- | --- |
| `pnpm dev` | Servidor de desarrollo en `localhost:3000` |
| `pnpm build` | Build de producción |
| `pnpm preview` | Previsualiza el build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | vue-tsc |

## Cómo está construido

El proyecto usa **una sola capa semántica**: los tokens `--ui-*` de Nuxt UI. No hay una capa de colores propia en paralelo, y ningún componente contiene valores hex.

```
app/assets/css/main.css   →  define los valores de los tokens
app/app.config.ts         →  define el color de marca
app/components/           →  consume tokens, nunca colores literales
```

Por eso el tema claro/oscuro no necesita JavaScript ni lógica condicional: cambiar de tema solo cambia qué valores están activos en `:root` o en `.dark`.

## Cómo cambiar los colores

### 1. Color de marca

En `app/app.config.ts`:

```ts
colors: {
  primary: 'red', // ← cambia este valor
  secondary: 'zinc',
  neutral: 'zinc'
}
```

Acepta cualquier color de Tailwind: `red`, `blue`, `emerald`, `amber`, `violet`, `cyan`… El tema claro toma el shade 500 y el oscuro el 400 de forma automática.

Si necesitas un color fuera de la paleta de Tailwind, decláralo primero en `main.css`:

```css
@theme static {
  --color-marca-500: #8b5cf6;
  --color-marca-400: #a78bfa;
}
```

y luego usa `primary: 'marca'`.

### 2. Neutros, superficies y bordes

En `app/assets/css/main.css`, dentro de los bloques `:root` (claro) y `.dark` (oscuro):

```css
:root {
  --ui-bg: #ffffff;         /* fondo de la página */
  --ui-bg-muted: #fafafa;   /* secciones alternas */
  --ui-bg-elevated: #f4f4f5;/* tarjetas */
  --ui-bg-accented: #e4e4e7;/* hover, superficies presionadas */

  --ui-text: #3f3f46;             /* texto principal */
  --ui-text-toned: #52525b;       /* énfasis */
  --ui-text-muted: #71717a;       /* texto secundario */
  --ui-text-dimmed: #a1a1aa;      /* metadatos */

  --ui-border: #e4e4e7;
}
```

Al cambiar la paleta de neutros, cambia los valores en **ambos** bloques para conservar el contraste.

### 3. Tipografía

En `nuxt.config.ts` declara la familia, y actualiza la variable en `main.css`:

```ts
fonts: {
  families: [
    { name: 'Inter', weights: [400, 600, 700, 900] }
  ]
}
```

```css
@theme {
  --font-sans: 'Inter', sans-serif;
}
```

Ambas líneas son necesarias. Si falta la del CSS, `@nuxt/fonts` no detecta que la familia se usa y no la descarga.

## Clases de color disponibles

Definidas por Nuxt UI a partir de los tokens. No hace falta memorizar hex, estas clases ya se adaptan al tema:

| Clase | Uso |
| --- | --- |
| `bg-default` / `text-default` | Fondo y texto de la página |
| `bg-muted` / `text-muted` | Superficie y texto secundario |
| `bg-elevated` / `text-elevated` | Tarjetas y paneles |
| `bg-accented` / `text-accented` | Hover y superficies activas |
| `text-highlighted` | Texto de máxima jerarquía |
| `text-toned` | Énfasis dentro de una frase |
| `text-dimmed` | Metadatos, notas al pie |
| `text-primary` | Enlaces, CTAs, color de marca |
| `border-default` | Bordes estándar |
| `text-gradient` | Texto con gradiente de marca (utilidad propia) |

## Componentes propios

`app/components/BaseTitle.vue` es el único componente añadido. Existe porque Nuxt UI no ofrece texto con gradiente. Cualquier otro componente (`UCard`, `UButton`, `UBadge`, `UModal`, `UTable`…) ya viene incluido y no necesita uno propio equivalente.

```vue
<BaseTitle as="h1" align="center">
  Título
</BaseTitle>
```

## Personalización por proyecto

- `app/app.vue` — nombre del proyecto en el header y footer, enlaces sociales
- `app/app.config.ts` — color de marca
- `app/assets/css/main.css` — neutros, superficies, tipografía
- `app/pages/index.vue` — esta página es documentación del sistema; elimínala al iniciar un proyecto
- Imágenes sociales (ogImage): coloca la tuya en `public/` y descomenta la línea en `app/app.vue`

## Licencia

[MIT](./LICENSE) — usala libremente en proyectos personales y comerciales. Si
modificas la plantilla, no tenés que publicar los cambios.

## Documentación

- [Nuxt UI](https://ui.nuxt.com)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Nuxt Fonts](https://nuxt.com/modules/fonts)