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

Revela un bloque al entrar en pantalla, con `whileInView` de **motion-v**. No
hay IntersectionObserver en el código: quien decide cuándo es Motion.

```vue
<RevealOnScroll animation="fade-up" :delay="100">
  <UPageSection title="Sección" />
</RevealOnScroll>
```

| Prop | Valores | Default |
| --- | --- | --- |
| `animation` | `fade`, `fade-up`, `fade-down`, `from-left`, `from-right`, `zoom-in`, `zoom-out`, `blur` | `fade-up` |
| `easing` | `out`, `in-out`, `soft`, `back` | `soft` |
| `sequence` | `together`, `lead`, `staged` | `staged` |
| `duration` | milisegundos de la entrada **completa** | `450` |
| `delay` | milisegundos | `0` |
| `once` | booleano | `true` |
| `amount` | `some`, `all`, o un número | `some` |
| `margin` | margen del viewport, tipo `'-12% 0px -12% 0px'` | `'-12% 0px -12% 0px'` |

`duration` es la duración **total** de la entrada, no la de cada paso. La
duración se reparte entre los pasos de la cadena y el escalonado se consume
dentro: una entrada de 450 ms con `staged` tarda 450 ms, no 450 × 1.36 = 612.
Cuando cada paso duraba `duration` entero, el componente y este README decían
700 y el navegador hacía 952, que es exactamente la clase de desajuste que hace
que una página se lea como lenta sin que nada parezca roto.

`once` es `true` por defecto. Con `false` el bloque se revierte a opacidad 0 al
salir del viewport y re-anima al volver: en una página larga un scroll normal
dispara entradas y salidas seguidas. `RepeatSection` lo pone a `false` a
propósito, porque es justo lo que quiere demostrar.

La entrada y la salida usan la misma transición; antes la salida era un 45 %
más corta, porque en CSS eso era un `transition-duration` aparte.

`sequence` encadena las propiedades dentro de una misma entrada —primero la
opacidad, después el desplazamiento—. El retardo de cada paso no es una lista de
milisegundos en el `style`, sino el `transition` de motion, que acepta un
retardo por clave. Todo está en `app/utils/motion.ts`, fuera del componente,
para que la página de ejemplo muestre los números reales y no copias.

### `prefers-reduced-motion` no es automático

Lo resuelve **un único nodo** en `app/app.vue`:

```vue
<MotionConfig reduced-motion="user">
```

Con eso Motion descarta `transform` y `layout` y deja pasar solo `opacity` y
color. Sin ese nodo, ninguna animación de la app respeta la preferencia del
sistema y no salta ningún error, así que **si añades un `MotionConfig` o
cambias la app, comprueba que sigue ahí**.

### Lo que CSS no hace

La sección `MotionSection` demuestra lo que necesita un motor de animación y
no una transición: resortes, escalonado, exit y gestos.

```vue
<Motion
  :while-hover="{ y: -6, scale: 1.02 }"
  :while-press="{ scale: 0.98 }"
  :transition="{ type: 'spring', stiffness: 260, damping: 20 }"
>
  <div class="bg-elevated border border-default p-5">…</div>
</Motion>
```

| Pieza | Para qué |
| --- | --- |
| `while-hover`, `while-press`, `while-drag` | Estados que se montan y se limpian solos |
| `transition: { type: 'spring' }` | `duration` dice cuánto tarda; el resorte dice cómo se llega y se adapta a la distancia |
| `staggerChildren` en el padre | Escalonar hijos sin escribir un retardo por índice |
| `AnimatePresence` | Animar la salida: sin él, Vue ya destruyó el nodo y no hay nada que animar |
| `drag`, `dragConstraints`, `dragElastic` | Gestos. `dragConstraints` **no** es opcional: sin él el elemento se sale de la página |

La regla que evita los conflictos con Nuxt UI: **la animación va en un elemento
propio**, nunca sobre un `UButton` o un `USlideover`. Nuxt UI y Reka UI ya
mueven sus nodos internos con transiciones CSS, y dos transiciones en el mismo
elemento significa que gana la última que se escribió, sin avisar. Por eso los
hover de la sección viven en el `div` que envuelve a la tarjeta, y el `UButton`
de dentro es solo contenido.

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
- [Motion for Vue](https://motion-vue.dev)