<script setup lang="ts">
// ======================================================================
// TITULO CON GRADIENTE DE MARCA
// El texto se recorta sobre el degradado, asi que necesita las dos piezas
// juntas: text-transparent (si no, el color del texto tapa el fondo) y
// bg-clip-text (recorta el fondo a la forma de las letras).
//
// El degradado vive en @utility text-gradient (assets/css/main.css) y va
// de --ui-color-primary-500 a --ui-color-primary-400: justo los dos shades
// que Nuxt UI resuelve como --ui-primary segun el tema. Los dos extremos
// son el color de marca tanto en light como en dark, y cambiar
// ui.colors.primary en app.config.ts los reescribe sin tocar aqui.
// ======================================================================

type GradientTitleSize = 'sm' | 'md' | 'lg' | 'xl'

withDefaults(
  defineProps<{
    /** `span` es lo que hay que usar dentro de un slot de titulo que ya
     *  trae su propio elemento, como el <h1> de UPageHero. */
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span'
    size?: GradientTitleSize
    align?: 'left' | 'center'
  }>(),
  {
    as: 'h1',
    size: 'lg',
    align: 'center'
  }
)

const sizeClass: Record<GradientTitleSize, string> = {
  sm: 'text-2xl sm:text-3xl',
  md: 'text-3xl sm:text-4xl',
  lg: 'text-4xl sm:text-5xl md:text-6xl',
  xl: 'text-5xl sm:text-6xl md:text-7xl'
}
</script>

<template>
  <component
    :is="as"
    :class="[
      'bg-clip-text text-gradient font-extrabold tracking-tight text-transparent text-balance',
      sizeClass[size],
      align === 'center' ? 'text-center' : 'text-left'
    ]"
  >
    <slot />
  </component>
</template>
