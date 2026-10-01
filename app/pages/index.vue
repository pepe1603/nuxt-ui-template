<script setup lang="ts">
// Esta pagina documenta el sistema de diseno. Eliminala al iniciar un proyecto.
useSeoMeta({
  title: 'Design System',
  description: 'Referencia de tokens y componentes del tema.'
})
</script>

<template>
  <main class="min-h-screen bg-default text-default transition-colors duration-300">
    <div class="mx-auto max-w-3xl px-6 py-16">
      <header class="flex flex-col items-center gap-4 text-center">
        <BaseTitle>
          Sistema de diseño
        </BaseTitle>

        <p class="max-w-xl text-lg text-muted">
          Todos los valores de esta página salen de los tokens
          <code class="text-toned">--ui-*</code>. Cambia el tema con el botón
          superior: nada del CSS de la página cambia, solo las variables.
        </p>
      </header>

      <section class="mt-16 flex flex-col gap-8">
        <div class="flex flex-col gap-3">
          <BaseTitle
            as="h2"
            align="left"
          >
            Texto
          </BaseTitle>

          <p class="text-highlighted">
            text-highlighted · máxima jerarquía
          </p>

          <p>
            text-default · cuerpo de texto
          </p>

          <p class="text-toned">
            text-toned · énfasis dentro de una frase
          </p>

          <p class="text-muted">
            text-muted · descripciones y texto secundario
          </p>

          <p class="text-dimmed text-sm">
            text-dimmed · metadatos y notas al pie
          </p>

          <p class="text-primary">
            text-primary · enlaces y llamadas a la acción
          </p>
        </div>

        <div class="flex flex-col gap-3">
          <BaseTitle
            as="h2"
            align="left"
          >
            Superficies
          </BaseTitle>

          <div class="grid gap-3 sm:grid-cols-2">
            <div class="rounded-lg bg-muted border border-default p-4 text-sm">
              bg-muted
            </div>

            <div class="rounded-lg bg-elevated border border-default p-4 text-sm">
              bg-elevated
            </div>

            <div class="rounded-lg bg-accented p-4 text-sm">
              bg-accented
            </div>

            <div class="rounded-lg bg-inverted p-4 text-sm text-inverted">
              bg-inverted
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <BaseTitle
            as="h2"
            align="left"
          >
            Componentes Nuxt UI
          </BaseTitle>

          <p class="text-muted text-sm">
            Los componentes de Nuxt UI leen estos mismos tokens, así que
            heredan el tema sin configuración adicional.
          </p>

          <div class="flex flex-wrap gap-3">
            <UButton
              color="primary"
              label="Primary"
            />

            <UButton
              color="primary"
              variant="outline"
              label="Outline"
            />

            <UButton
              color="neutral"
              variant="subtle"
              label="Subtle"
            />

            <UButton
              color="neutral"
              variant="ghost"
              label="Ghost"
            />

            <UBadge
              color="primary"
              variant="subtle"
              label="Badge"
            />
          </div>
        </div>
      </section>
    </div>
  </main>
</template>
