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

Dos componentes añadidos. Cualquier otro (`UCard`, `UButton`, `UBadge`,
`UModal`, `UTable`…) ya viene incluido en Nuxt UI y no necesita uno propio.

### `GradientTitle`

Título con el degradado de marca. Existe porque Nuxt UI no cubre texto con
gradiente.

```vue
<GradientTitle as="h1" size="xl" align="center">
  Sistema de diseño
</GradientTitle>
```

| Prop | Valores | Default |
| --- | --- | --- |
| `as` | `h1`–`h6`, `span` | `h1` |
| `size` | `sm`, `md`, `lg`, `xl` | `lg` |
| `align` | `left`, `center` | `center` |

El degradado es `--ui-color-primary-500` → `--ui-color-primary-400`, los dos
shades que Nuxt UI resuelve como `--ui-primary` según el tema, así que sigue
al color de marca sin configuración. La utilidad `text-gradient` que lo aplica
está definida en `main.css`.

Dentro de un slot que ya trae su propio elemento —el `<h1>` de `UPageHero`, por
ejemplo— usa `as="span"`: un `<h1>` dentro de un `<h1>` es HTML inválido y
duplica el rol de encabezado.

### `RevealOnScroll`

Revela un bloque al entrar en pantalla. VueUse decide *cuándo* y Tailwind
decide *cómo*; ninguna de las dos capas conoce a la otra.

```vue
<RevealOnScroll animation="fade-up" :delay="100">
  <UPageSection title="Sección" />
</RevealOnScroll>
```

| Prop | Valores | Default |
| --- | --- | --- |
| `animation` | `fade`, `fade-up`, `fade-down`, `from-left`, `from-right`, `zoom-in`, `zoom-out` | `fade-up` |
| `easing` | `out`, `in-out`, `soft`, `back` | `soft` |
| `duration` | milisegundos | `450` |
| `delay` | milisegundos | `0` |
| `once` | booleano | `true` |

`once: true` usa la variante `visibleOnce` y el bloque solo entra la primera
vez. `once: false` usa `visible` y se oculta al salir del viewport para volver
a animarse cada vez que regresa. Son dos variantes distintas, no un parámetro
que la librería interprete, y por eso el prop se llama `once`. El default es
`true` porque con `false` un scroll normal hace entrar y salir bloques
seguidos y la página se lee como que va a destiempo; `RepeatSection` lo pone a
`false` a propósito, porque es justo lo que quiere demostrar.

El escalonado se hace con `delay`, uno por elemento. No hay cadena de
propiedades ni retardo por clave: con una transición CSS no hace falta, y cada
paso con su propio retardo hacía que una entrada de 700 ms tardara 952 ms sin
que nada pareciera roto.

Los estados están en `app/utils/motion.ts` como utilidades de Tailwind, fuera
del componente, para que el typecheck cubra los nombres y la página de ejemplo
muestre los valores reales. No hay `blur`: `filter` va fuera del compositor y
obliga a rasterizar el elemento entero en cada frame.

### El estado inicial va en la variante, no en una clase

Es lo contrario de lo que parece, y es lo que evita que la página arranque
con huecos:

```ts
// Esto pinta el bloque INVISIBLE en el HTML del servidor, y el contenido se
// queda en un hueco hasta que hidrata: style="opacity:0" en el primer byte.
// initial: hiddenState[animation],
```

```ts
// Con la variante, el servidor pinta el bloque VISIBLE y la animación solo
// ocurre si el bloque estaba de verdad fuera de la pantalla al cargar.
initial: hiddenState[animation],
visibleOnce: {}
```

### `prefers-reduced-motion` se resuelve en CSS

No hay ningún nodo del árbol que mantener. Como la transición la escribe la
librería en el atributo `style` del elemento, la única forma de anularla es
ganarle en especificidad, y para eso hace falta `!important` en el bloque
`@media` del final de `app/assets/css/main.css`. Si añades una animación, la
preferencia del sistema se respeta sola.

### Lo que esta librería no tiene

Se eligió `@vueuse/motion` sobre `motion-v` (Framer Motion para Vue) por
simplez, así que hay cosas que no están y no hay que buscar:

- **Sin exit animations.** No hay `AnimatePresence`, así que un bloque que se
  desmonta no se anima al salir.
- **Sin gestos.** No hay `drag`, ni `whileDrag`, ni `whileTap`.
- **Sin layout.** No hay `layout` ni `layoutId`.

Para eso, `motion-v` es la opción: es la librería de Framer Motion para Vue y
tiene las tres. El coste es el que se vio al usarla: `whileInView` con margen,
variantes tipadas y un `MotionConfig` del que depende toda la app. Si este
proyecto llegara a necesitar salidas animadas, cambiar de librería es el
movimiento natural, y el componente está aislado para ese efecto.

## Imágenes

`@nuxt/image` con **ipx**, el proveedor por defecto. El src es una URL absoluta:
las imágenes no se sirven desde este proyecto, ipx las descarga, las recorta y
sirve la variante que pide el navegador.

```vue
<script setup lang="ts">
const foto = {
  src: 'https://ejemplo.com/foto.jpg',
  alt: 'Lo que muestra'
}
</script>

<template>
  <NuxtImg
    :src="foto.src"
    :alt="foto.alt"
    sizes="100vw sm:50vw lg:33vw"
    loading="lazy"
  />
</template>
```

| Componente | Para qué |
| --- | --- |
| `NuxtImg` | Una sola fuente, con `srcset` responsive |
| `NuxtPicture` | Varios formatos (`avif`, `webp`) con fallback automático |
| `UAvatar` y el resto de Nuxt UI | Ya usan `NuxtImg` por debajo, basta con pasar `src` |

`sizes` describe el ancho que la imagen ocupa **en cada breakpoint**, no el de
la ventana. Es lo que permite a ipx generar candidatos que encajan con el
layout: `lg:33vw` genera el ancho de una de tres columnas, no un tercio de
pantalla completo.

### El host tiene que estar en `image.domains`

En `nuxt.config.ts`:

```ts
image: {
  domains: ['4kwallpapers.com', 'picsum.photos', 'fastly.picsum.photos']
}
```

Sin esa lista la imagen **se ve igual y no da ningún error**: @nuxt/image
comprueba el host, no lo encuentra, y devuelve la URL original sin pasar por
ipx. Te queda sin `srcset`, sin avif y sin placeholder, sin avisar.

Dos detalles que no son obvios:

- Va el **host**, no la URL: `4kwallpapers.com`, nunca `https://4kwallpapers.com/...`.
- Si el host redirige, declara también el destino. `picsum.photos` responde 302
  a `fastly.picsum.photos` e ipx valida el host **después** del redirect, así que
  con uno solo los avatares devuelven `IPX_FORBIDDEN_HOST`.

ipx descarga en el servidor, así que tu despliegue necesita salida a internet y
los hosts que bloquean por hotlink o por User-Agent no sirven.

### Dos cosas más que rompen sin aviso

**`placeholder` como string se lee como URL.** Hay que pasarle un número o un
array:

```vue
<NuxtImg :src="foto.src" :placeholder="[32, 32, 20]" />
```

Con `placeholder="32"` el atributo `src` acaba siendo literalmente `32`, que
devuelve un 404. Y el array se queda en `[width, height, quality]`: una cuarta
posición emite `b_<valor>`, que ipx lee como color de fondo y espera un color,
así que la imagen responde 400.

**Nada de `prerender`.** El handler que sirve `/_ipx` viaja en el server de
Nitro. Si prerenderizas las rutas, nitro emite output estático, no queda
runtime y todas las variantes devuelven 404. Para seguir desplegando estático
hay que cambiar a un proveedor cloud en `nuxt.config.ts`.

## Flujo de trabajo

`main` solo recibe releases, `develop` es el punto de integración y las ramas de
trabajo se quedan en local. Ver [CONTRIBUTING.md](./CONTRIBUTING.md).

## Personalización por proyecto

- `app/app.vue` — nombre del proyecto en el header y footer, enlaces sociales
- `app/app.config.ts` — color de marca
- `app/assets/css/main.css` — neutros, superficies, tipografía
- `app/utils/motion.ts` — estados y coreografía de las animaciones
- `nuxt.config.ts` — dominios remotos permitidos por `@nuxt/image`
- `app/pages/index.vue` — esta página es documentación del sistema; elimínala al iniciar un proyecto
- Imágenes sociales (ogImage): coloca la tuya en `public/` y descomenta la línea en `app/app.vue`

## Licencia

[MIT](./LICENSE) — usala libremente en proyectos personales y comerciales. Si
modificas la plantilla, no tenés que publicar los cambios.

## Documentación

- [Nuxt UI](https://ui.nuxt.com)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Nuxt Fonts](https://nuxt.com/modules/fonts)
- [Nuxt Image](https://nuxt.com/modules/image)
- [VueUse Motion](https://vueuse.org/motion/overview.html)