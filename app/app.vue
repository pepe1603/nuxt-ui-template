<script setup lang="ts">
// ======================================================================
// SEO
// Ajusta title y description por proyecto. Las imagenes sociales (ogImage)
// se omiten a proposito: anade la tuya en public/ y descomenta abajo.
// ======================================================================

useSeoMeta({
  title: 'Nuxt UI Template',
  description: 'Plantilla de Nuxt 4 con Nuxt UI, Tailwind CSS v4 y tema claro/oscuro basado en tokens.'
})

useHead({
  htmlAttrs: {
    lang: 'es'
  }
})
</script>

<template>
  <!--
    reducedMotion="user" es lo que hace que la app entera respete la
    preferencia del sistema: Motion descarta transform y layout y deja pasar
    solo opacity y color. Sin este nodo, prefers-reduced-motion no llega a
    ninguna animacion. Se declara una vez aqui y no en cada componente.
  -->
  <MotionConfig reduced-motion="user">
    <UApp>
      <UHeader>
        <template #left>
          <!-- Icono del proyecto. Reemplaza por tu logo. -->
          <NuxtLink
            to="/"
            class="flex items-center gap-2 rounded-md p-1 -ms-1 focus-visible:outline-primary/25 outline-3"
          >
            <UIcon
              name="i-simple-icons-nuxtdotjs"
              class="text-primary size-5"
            />

            <span class="font-semibold">
              Template
            </span>
          </NuxtLink>
        </template>

        <template #right>
          <UColorModeButton />

          <UButton
            to="https://github.com"
            target="_blank"
            icon="i-simple-icons-github"
            aria-label="GitHub"
            color="neutral"
            variant="ghost"
          />
        </template>
      </UHeader>

      <UMain>
        <NuxtPage />
      </UMain>

      <USeparator />

      <UFooter>
        <template #left>
          <p class="text-muted text-sm">
            © {{ new Date().getFullYear() }}
          </p>
        </template>

        <template #right>
          <p class="text-dimmed text-sm">
            Nuxt 4 · Nuxt UI · Tailwind v4
          </p>
        </template>
      </UFooter>
    </UApp>
  </MotionConfig>
</template>
