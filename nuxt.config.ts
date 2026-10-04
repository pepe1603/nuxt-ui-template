// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/fonts',
    '@nuxt/image',
    '@vueuse/nuxt'
  ],

  // Sin pathPrefix, una seccion en components/sections/HeroSection.vue se
  // importa como <HeroSection /> y no como <SectionsHeroSection />.
  components: [
    { path: '~/components', pathPrefix: false }
  ],

  devtools: {
    enabled: false
  },

  css: ['~/assets/css/main.css'],

  // A proposito no hay routeRules con prerender: prerenderear '/' hace que
  // nitro emita solo output estatico, y en estatico no hay runtime que sirva
  // las variantes de ipx, asi que /_ipx daba 404. Con SSR el handler de ipx
  // viaja al build y las imagenes se optimizan tambien en produccion.

  compatibilityDate: '2026-06-30',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  fonts: {
    families: [
      { name: 'Inter', weights: [400, 600, 700, 900] }
    ]
  },

  // ipx es el proveedor por defecto y optimiza en local, sin servicios
  // externos: recorta, convierte y sirve la imagen ya ajustada al srcset.
  image: {
    quality: 80,
    format: ['avif', 'webp']
  }
})
