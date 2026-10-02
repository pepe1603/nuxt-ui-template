// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/fonts',
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

  routeRules: {
    '/': { prerender: true }
  },

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
  }
})
