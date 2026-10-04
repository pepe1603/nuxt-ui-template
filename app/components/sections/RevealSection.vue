<script setup lang="ts">
// Documentacion de la API. Los cuatro bloques escalonados usan el mismo
// animation con retardo creciente, que es el caso de uso mas comun.
const features = [
  {
    icon: 'i-lucide-eye',
    title: 'whileInView',
    description: 'Motion observa el elemento y aplica el estado de asentado. Al salir del viewport lo revierte solo: no hay ningún observer en el código.'
  },
  {
    icon: 'i-lucide-spline',
    title: 'Variantes',
    description: 'Los estados son objetos tipados en utils/motion.ts, no clases. El retardo de cada propiedad va en `transition`, que acepta un retardo por clave.'
  },
  {
    icon: 'i-lucide-repeat',
    title: 'once',
    description: 'false (default) hace que el bloque reaparezca cada vez que vuelve a entrar. true lo deja fijo en su sitio.'
  },
  {
    icon: 'i-lucide-accessibility',
    title: 'Accesibilidad',
    description: 'El `<MotionConfig reduced-motion="user">` de app.vue hace que Motion descarte transform y layout y deje pasar solo opacity. Sin ese nodo, esta animación no lo respeta.'
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
    description="Motion decide cuándo y cómo a la vez. No hay IntersectionObserver ni clases de animación en el componente: solo variantes."
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
