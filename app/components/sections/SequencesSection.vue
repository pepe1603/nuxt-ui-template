<script setup lang="ts">
// Escalonado por retardo. Antes esta seccion demostraba `sequence`
// (together, lead, staged), que encadenaba las propiedades de una misma
// entrada. Con @vueuse/motion no hay cadena: hay una transicion y un
// retardo. El escalonado se consigue aplicando `delay` a cada elemento,
// y eso es todo.
//
// Cada tarjeta monta su bloque con un :key propio. Al pulsar Repetir solo
// cambia el key, Vue destruye el nodo viejo y crea uno nuevo, y el observer
// vuelve a empezar: es la unica forma de repetir la animacion sin salirse
// de la seccion.
const replays = reactive<Record<string, number>>({
  together: 0,
  lead: 0,
  staged: 0
})

function replay(name: string) {
  replays[name]!++
}

// Retardo por elemento. La suma de los tres retardos de cada tarjeta es lo
// que tarda en asentarse el bloque entero.
const STEPS = [
  { id: 'together', step: 0, note: 'Los tres a la vez. Sin retardo entre ellos.' },
  { id: 'lead', step: 120, note: 'Cada uno espera 120ms al anterior.' },
  { id: 'staged', step: 260, note: 'Cada uno espera 260ms. El hueco se nota claro.' }
] as const

// Orden de entrada: el que entra primero es el que mas tarda en salir, asi
// que la lista se ve como una cascada que se cierra.
const bars = 3

const ui = {
  container: 'py-24 sm:py-32 lg:py-40'
}
</script>

<template>
  <UPageSection
    title="Escalonado"
    description="La única forma de escalonar es el retardo: cada elemento recibe el suyo y la entrada se escalona sola. No hay cadena de propiedades ni retardo por clave, porque con una transición CSS no hace falta."
    :ui="ui"
  >
    <div class="grid gap-4 lg:grid-cols-3">
      <div
        v-for="step in STEPS"
        :key="step.id"
        class="flex flex-col gap-4 rounded-xl bg-elevated border border-default p-5"
      >
        <div class="flex items-center gap-2">
          <UIcon
            name="i-lucide-timer"
            class="text-primary size-4 shrink-0"
          />

          <code class="text-sm font-semibold">
            {{ step.id }}
          </code>
        </div>

        <p class="text-muted min-h-12 text-sm">
          {{ step.note }}
        </p>

        <div class="mt-auto rounded-lg border border-dashed border-accented bg-transparent p-6">
          <RevealOnScroll
            :key="replays[step.id]"
            animation="fade-up"
            :delay="step.step * bars"
          >
            <div class="flex flex-col gap-2">
              <div
                v-for="bar in bars"
                :key="bar"
                class="bg-primary/40 h-4 rounded"
                :style="{ width: `${100 - (bar - 1) * 22}%` }"
              />
            </div>
          </RevealOnScroll>
        </div>

        <UButton
          label="Repetir"
          icon="i-lucide-rotate-cw"
          color="neutral"
          variant="outline"
          size="sm"
          block
          @click="replay(step.id)"
        />
      </div>
    </div>
  </UPageSection>
</template>
