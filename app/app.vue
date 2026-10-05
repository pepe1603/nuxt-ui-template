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

// ======================================================================
// TOASTER
// <UApp> es quien monta el <UToaster> que pinta los toasts, y sin el los
// avisos se encolan pero no se ven. No hace falta pasarle nada: todo tiene
// valores por defecto.
//
// Aqui se le pasa un estado solo para que la seccion de documentacion de
// los toasts pueda cambiar posicion, duracion o limite en caliente. Si
// quitas esa seccion, quita estas dos lineas: el binding es opcional.
// ======================================================================

const toaster = useToasterOptions()
</script>

<template>
  <UApp :toaster="toaster">
    <UHeader>
      <template #left>
        <!-- Icono del proyecto. Reemplaza por tu logo. -->
        <NuxtLink
          to="/"
          class="flex items-center gap-2 rounded-md p-1.5 -ms-1 hover:outline-1 outline-primary/25"
        >
          <UIcon
            name="i-simple-icons-nuxtdotjs"
            class="text-primary size-5"
          />

          <span class="font-semibold">
            Template
          </span>
        </NuxtLink>

        <!-- Paginas de ejemplo del template. Quitalas al empezar un
             proyecto de verdad: no aportan nada a la aplicacion. -->
        <UButton
          to="/formulario"
          label="Formulario"
          size="xs"
          color="neutral"
          variant="ghost"
        />

        <UButton
          to="/carrusel"
          label="Carrusel"
          size="xs"
          color="neutral"
          variant="ghost"
        />
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
</template>
