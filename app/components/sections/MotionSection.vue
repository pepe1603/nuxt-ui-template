<script setup lang="ts">
// ======================================================================
// LO QUE CSS NO HACE
// Todo lo de aqui es motion-v. La seccion anterior documenta entradas al
// scroll, que es lo que hacia RevealOnScroll; esta cubre lo que solo se
// puede pedir a un motor de animacion: resorte, escalonado, salida y gesto.
//
// REGLA de la casa: la animacion va en un elemento PROPIO, nunca sobre un
// UButton o un USlideover. Nuxt UI y Reka UI ya mueven sus nodos internos
// con transiciones CSS, y meter dos transiciones en el mismo elemento
// significa que gana la ultima que se escribio, sin aviso. Por eso los
// hover de esta seccion viven en el div que envuelve a la tarjeta.
// ======================================================================
// `Variants` no se importa de motion-v: el de ese paquete no encaja con el
// prop del componente. El de app/utils/motion.ts esta declarado para eso y
// llega por auto-import.
// --- Hover y tap -------------------------------------------------------
// whileHover y whilePress montan los listeners y limpian solos. El elemento
// objetivo es siempre el div: el boton de Nuxt UI solo hace de contenido.
const hovers = [
  {
    title: 'Elevar y escalar',
    note: 'y negativo mas sombra. El whileHover devuelve al sitio solo al salir.',
    hover: { y: -6, scale: 1.02 },
    press: { scale: 0.98 }
  },
  {
    title: 'Giro leve',
    note: 'Unos grados y se nota sin marear. La opacidad acompaña para que el texto no se tense.',
    hover: { rotate: -2, opacity: 0.9 },
    press: { rotate: 0, scale: 0.99 }
  },
  {
    title: 'Acercar el borde',
    note: 'Escala dentro de su caja en vez de salir de ella: no salta el contenido de al lado.',
    hover: { scale: 1.06 },
    press: { scale: 0.97 }
  }
] as const

// --- Stagger -----------------------------------------------------------
// El padre declara el ritmo con staggerChildren y los hijos solo nombran sus
// dos estados. No hay ningun retardo por indice escrito a mano: lo decide el
// padre, y por eso anadir un hijo al grid no obliga a renumerar nada.
const cards = ['Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis'] as const

const listVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  shown: { opacity: 1, y: 0, transition: { duration: 450, ease: [0.16, 1, 0.3, 1] } }
}

// --- Springs -----------------------------------------------------------
// Duracion dice CUANTO tarda; el resorte dice COMO se llega. El resorte se
// pasa de su destino y vuelve solo, sin escribir esa curva a mano, y se
// adapta a la distancia: el mismo spring cubre un salto de 4px y otro de
// 60px sin cambiar un numero.
const springs = [
  { label: 'duration', stiffness: undefined, note: '400ms lineales. Termina exacto, pero se para en seco.' },
  { label: 'spring suave', stiffness: 120, damping: 14, note: 'Se asienta despacio. El que mas se nota la diferencia.' },
  { label: 'spring seco', stiffness: 400, damping: 22, note: 'Llega rapido y rebota poco. Para elementos pequenos.' }
] as const

// --- Exit --------------------------------------------------------------
// AnimatePresence necesita saber que nodo se va antes de que Vue lo
// destruya. Sin el, la salida se pierde porque el elemento ya no existe.
const items = ref<string[]>(['Retirado', 'Cedido', 'Herencia'])
let nextId = 3

function add() {
  items.value = [...items.value, `Lote ${++nextId}`]
}

function remove(item: string) {
  items.value = items.value.filter(i => i !== item)
}

const toggle = (item: string) => () => (items.value.includes(item) ? remove(item) : (items.value = [...items.value, item]))

// --- Drag --------------------------------------------------------------
// `drag` solo pone el elemento en modo arrastre. Las limitaciones no son
// opcionales: sin `dragConstraints` el cuadro se sale de la pagina, y con
// constraints true el tipo no compila porque espera un elemento, no un
// booleano. `rotate` en grados engancha el angulo al gesto.
const box = ref<HTMLElement | null>(null)

const tile = computed(() => ({
  drag: true,
  dragConstraints: box.value ?? undefined,
  dragElastic: 0.15,
  whileDrag: { scale: 1.05, rotate: 6 },
  whileTap: { scale: 0.95 }
}))
</script>

<template>
  <UPageSection
    id="motion"
    title="Lo que CSS no hace"
    description="La sección de arriba ya no mira el scroll: eso lo hace `whileInView`. Aquí va lo que un motor de animación sí puede hacer y una transición CSS no."
  >
    <div class="flex flex-col gap-8">
      <!-- Hover y tap -->
      <div class="flex flex-col gap-3">
        <h3 class="text-highlighted font-semibold">
          Hover y tap
        </h3>

        <div class="grid gap-3 sm:grid-cols-3">
          <div
            v-for="item in hovers"
            :key="item.title"
            class="rounded-lg"
          >
            <Motion
              :while-hover="item.hover"
              :while-press="item.press"
              :transition="{ type: 'spring', stiffness: 260, damping: 20 }"
              class="bg-elevated flex h-full flex-col gap-2 rounded-xl border border-default p-5"
            >
              <p class="font-semibold">
                {{ item.title }}
              </p>

              <p class="text-muted text-sm">
                {{ item.note }}
              </p>

              <UButton
                label="Púlsame"
                color="neutral"
                variant="outline"
                size="sm"
                class="mt-auto self-start"
              />
            </Motion>
          </div>
        </div>
      </div>

      <!-- Stagger -->
      <div class="flex flex-col gap-3">
        <h3 class="text-highlighted font-semibold">
          Stagger y variantes
        </h3>

        <Motion
          :variants="listVariants"
          initial="hidden"
          animate="shown"
          class="grid gap-2 sm:grid-cols-3"
        >
          <Motion
            v-for="card in cards"
            :key="card"
            :variants="itemVariants"
            class="bg-muted rounded-lg border border-default p-4 text-sm font-medium"
          >
            {{ card }}
          </Motion>
        </Motion>
      </div>

      <!-- Springs -->
      <div class="flex flex-col gap-3">
        <h3 class="text-highlighted font-semibold">
          Springs
        </h3>

        <div class="grid gap-3 sm:grid-cols-3">
          <div
            v-for="spring in springs"
            :key="spring.label"
            class="bg-muted flex flex-col gap-2 rounded-xl border border-dashed border-accented p-5"
          >
            <code class="text-primary text-sm font-semibold">
              {{ spring.label }}
            </code>

            <div class="flex h-16 items-center justify-center">
              <Motion
                :animate="{ y: [-20, 0] }"
                :transition="spring.stiffness
                  ? { type: 'spring', stiffness: spring.stiffness, damping: spring.damping }
                  : { duration: 0.4 }"
                :repeat="Infinity"
                repeat-type="reverse"
                :repeat-delay="0.6"
                class="bg-primary size-8 rounded-full"
              />
            </div>

            <p class="text-muted text-sm">
              {{ spring.note }}
            </p>
          </div>
        </div>
      </div>

      <!-- Exit -->
      <div class="flex flex-col gap-3">
        <h3 class="text-highlighted font-semibold">
          Exit
        </h3>

        <div class="flex flex-wrap gap-2">
          <UButton
            label="Añadir"
            icon="i-lucide-plus"
            size="sm"
            @click="add"
          />

          <UButton
            v-for="item in items"
            :key="item"
            :label="item"
            icon="i-lucide-x"
            color="neutral"
            variant="outline"
            size="sm"
            @click="remove(item)"
          />
        </div>

        <p class="text-dimmed text-sm">
          Los botones de arriba son los items: el último en la lista es el más
          reciente. Quita uno y se va con una transición en lugar de desaparecer.
        </p>

        <AnimatePresence mode="popLayout">
          <Motion
            v-for="(item, index) in items"
            :key="item"
            :initial="{ opacity: 0, y: -12, scale: 0.96 }"
            :animate="{ opacity: 1, y: 0, scale: 1 }"
            :exit="{ opacity: 0, x: 40, transition: { duration: 0.25 } }"
            :transition="{ type: 'spring', stiffness: 300, damping: 26 }"
            class="bg-elevated flex items-center gap-2 rounded-lg border border-default px-3 py-2 text-sm"
            layout
          >
            <span class="bg-primary/10 text-primary flex size-5 items-center justify-center rounded text-xs font-semibold">
              {{ index + 1 }}
            </span>

            <button
              type="button"
              class="hover:text-primary"
              @click="toggle(item)"
            >
              {{ item }}
            </button>
          </Motion>
        </AnimatePresence>
      </div>

      <!-- Drag -->
      <div class="flex flex-col gap-3">
        <h3 class="text-highlighted font-semibold">
          Drag
        </h3>

        <div
          ref="box"
          class="bg-muted relative h-48 overflow-hidden rounded-xl border border-default"
        >
          <Motion
            v-bind="tile"
            class="bg-primary absolute top-1/2 left-1/2 size-16 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-2xl active:cursor-grabbing"
          />
        </div>

        <p class="text-dimmed text-sm">
          Arrastra el cuadro. Con `dragConstraints` se queda dentro de la caja y
          `dragElastic` le devuelve el muelle al soltarlo.
        </p>
      </div>
    </div>
  </UPageSection>
</template>
