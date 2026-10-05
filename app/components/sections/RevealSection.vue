<script setup lang="ts">
// Documentacion de la API. Los cuatro bloques escalonados usan el mismo
// animation con retardo creciente, que es el caso de uso mas comun.
const features = [
  {
    icon: 'i-lucide-eye',
    title: 'visibleOnce',
    description: 'La librería registra el observer al montar. Este componente solo declara el estado inicial y el de entrada, así que no hay lógica que se pueda desincronizar del SSR.'
  },
  {
    icon: 'i-lucide-spline',
    title: 'initial + visible',
    description: 'Los estados son utilidades de Tailwind declaradas en utils/motion.ts. El typecheck cubre los nombres, así que una animación mal escrita falla al compilar y no en el DOM.'
  },
  {
    icon: 'i-lucide-repeat',
    title: 'once',
    description: 'true (default) usa visibleOnce y solo entra la primera vez. false usa visible y reaparece cada vez que vuelve a entrar.'
  },
  {
    icon: 'i-lucide-accessibility',
    title: 'Accesibilidad',
    description: 'prefers-reduced-motion se resuelve en CSS, en main.css. No hay ningún nodo del árbol que mantener: si se olvida, la animación sigue funcionando y no rompe nada.'
  }
]

const links = [
  { label: 'Ver el código', to: 'https://github.com', target: '_blank' as const, icon: 'i-simple-icons-github' }
]

const ui = {
  container: 'py-24 sm:py-32 lg:py-40'
}
</script>

<template>
  <UPageSection
    title="RevealOnScroll"
    description="VueUse decide cuándo, Tailwind decide cómo. Ninguna de las dos capas conoce a la otra, y no hay un solo nodo del que dependa que las animaciones se respeten."
    :features="features"
    :links="links"
    :ui="ui"
  >
    <ul class="flex flex-col gap-2">
      <li
        v-for="(item, index) in features"
        :key="item.title"
      >
        <RevealOnScroll
          animation="from-right"
          :delay="index * 120"
          :duration="600"
        >
          <div class="flex items-center gap-3 rounded-lg bg-muted border border-default px-4 py-3">
            <UIcon
              :name="item.icon"
              class="text-primary size-4 shrink-0"
            />

            <span class="text-sm">{{ item.title }}</span>

            <code class="text-dimmed ml-auto text-xs">delay {{ index * 120 }}ms</code>
          </div>
        </RevealOnScroll>
      </li>
    </ul>
  </UPageSection>
</template>
