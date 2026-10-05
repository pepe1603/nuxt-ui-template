<script setup lang="ts">
import { useMotion, useReducedMotion, useSpring } from '@vueuse/motion'

// ======================================================================
// LO QUE CSS NO PUEDE HACER
// Las secciones anteriores usan transiciones CSS, y para una entrada o una
// salida eso es suficiente: CSS interpola entre dos estados y ya esta.
//
// El limite aparece cuando el valor tiene que seguir moviendose despues de
// cambiar de objetivo. Una transicion no recuerda como iba: al invertirla,
// reinicia la curva desde velocidad cero, y se nota como tirón. Un spring si
// la recuerda, porque en cada paso lee la velocidad actual y continua desde
// ahi (esta en node_modules, en useSpring: velocity: motionValue.getVelocity()).
//
// Eso, y lo de abajo, es lo unico que justifica una libreria de animacion
// aqui. RevealOnScroll sigue con CSS a proposito: alli no hay continuidad que
// preservar, y una transicion de 700ms no necesita fisica.
const ui = {
  container: 'py-24 sm:py-32 lg:py-40'
}

const prefersReduced = useReducedMotion()

// --------------------------------------------------------------------------
// DEMO 1: el mismo recorrido, con y sin memoria
//
// Los dos cubos recorren la misma distancia con la misma duracion visible.
// La unica diferencia es que el de arriba usa un spring y el de abajo una
// transicion CSS. La prueba es pulsar el boton varias veces seguidas sin
// esperar: el de arriba nunca se frena de golpe, el debelow reinicia siempre.
const travel = 260
const active = ref(false)

const springValues = reactive({ x: 0 })
const { set: setSpring } = useSpring(springValues, {
  stiffness: 260,
  damping: 18
})

function toggleTravel() {
  active.value = !active.value
  const target = active.value ? travel : 0

  // Con reduced motion no hay fisica que easingar: se salta al final. Es el
  // mismo criterio que el aviso 4 de main.css, aqui aplicado al JS.
  if (prefersReduced.value) {
    springValues.x = target
    return
  }

  setSpring({ x: target })
}

// --------------------------------------------------------------------------
// DEMO 2: parar una animacion a mitad
//
// apply lanza la secuencia y stop la corta donde este. El bloque se queda en
// el valor que tenia en ese instante, congelado. Una transicion CSS se puede
// cancelar, pero no se puede consultar ni tomar el valor por donde va, asi
// que no hay forma de detenerla a mitad y quedarse ahi.
const sequenceBox = ref<HTMLElement | null>(null)

const sequence = {
  idle: { x: 0, rotate: 0 },
  right: { x: 220, rotate: 0 },
  turn: { x: 220, rotate: 180 },
  back: { x: 0, rotate: 180 }
} as const

const { apply: applySequence, stop: stopSequence, isAnimating } = useMotion(sequenceBox, sequence, {
  syncVariants: false
})

// --------------------------------------------------------------------------
// DEMO 3: gesto a fisica
//
// El cubo persigue al puntero con un spring, no lo sigue pegado. Al soltar,
// vuelve a su sitio. En CSS habria que traducir el evento a una transicion
// con un retardo fijo, y el retardo no puede depender de la velocidad del
// gesto: un movimiento rapido y uno lento darian el mismo retraso, que es
// justo lo que hace que un arrastre se sienta pegado o flotante.
const dragCard = reactive({ x: 0, y: 0 })
const dragging = ref(false)
const pointerOrigin = { x: 0, y: 0 }
const cardOrigin = { x: 0, y: 0 }

const { set: setCard } = useSpring(dragCard, {
  stiffness: 320,
  damping: 26
})

function onPointerDown(event: PointerEvent) {
  if (prefersReduced.value) {
    return
  }

  dragging.value = true
  pointerOrigin.x = event.clientX
  pointerOrigin.y = event.clientY
  cardOrigin.x = dragCard.x
  cardOrigin.y = dragCard.y

  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
}

function onPointerMove(event: PointerEvent) {
  if (!dragging.value || prefersReduced.value) {
    return
  }

  setCard({
    x: cardOrigin.x + (event.clientX - pointerOrigin.x),
    y: cardOrigin.y + (event.clientY - pointerOrigin.y)
  })
}

function onPointerUp(event: PointerEvent) {
  if (!dragging.value) {
    return
  }

  dragging.value = false
  ;(event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId)

  // Al soltar se vuelve al origen con el mismo spring. Un rebote corto, como
  // el que hace un boton al pulsarse.
  setCard({ x: 0, y: 0 })
}
</script>

<template>
  <UPageSection
    title="Lo que CSS no puede hacer"
    description="Todo lo de arriba son transiciones CSS, y para entrar y salir sobran. Aquí cambia la pregunta: qué pasa cuando el valor tiene que seguir moviéndose después de cambiar de objetivo. Eso necesita física, y es lo único que justifica una librería."
    :ui="ui"
  >
    <div class="flex flex-col gap-12">
      <!-- DEMO 1 -->
      <div class="flex flex-col gap-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <h3 class="text-highlighted text-lg font-semibold">
            El mismo recorrido, con y sin memoria
          </h3>

          <UButton
            label="Alternar"
            size="sm"
            variant="subtle"
            @click="toggleTravel"
          />
        </div>

        <p class="text-muted text-sm">
          Pulsa <strong>Alternar</strong> varias veces seguidas, sin esperar a que
          termine. Arriba el cubo nunca se frena de golpe: el spring lee su
          velocidad y sigue desde ahí. Abajo reinicia la curva desde cero en
          cada cambio de sentido.
        </p>

        <div class="grid gap-4 md:grid-cols-2">
          <div class="bg-muted flex flex-col gap-3 rounded-xl border border-default p-6">
            <div class="flex items-center gap-2">
              <UBadge
                label="spring"
                size="sm"
                color="primary"
                variant="subtle"
              />

              <span class="text-toned text-xs">useSpring</span>
            </div>

            <div class="bg-default relative h-16 overflow-hidden rounded-lg border border-default">
              <div
                class="bg-primary absolute top-1/2 size-10 -translate-y-1/2 rounded-lg"
                :style="{ transform: `translateX(${springValues.x}px) translateY(-50%)` }"
              />
            </div>
          </div>

          <div class="bg-muted flex flex-col gap-3 rounded-xl border border-default p-6">
            <div class="flex items-center gap-2">
              <UBadge
                label="transition"
                size="sm"
                color="neutral"
                variant="subtle"
              />

              <span class="text-toned text-xs">clase de Tailwind</span>
            </div>

            <div class="bg-default relative h-16 overflow-hidden rounded-lg border border-default">
              <div
                class="bg-primary absolute top-1/2 size-10 -translate-y-1/2 rounded-lg transition-transform duration-300 ease-out"
                :class="active ? 'translate-x-[calc(100%-2.5rem)]' : 'translate-x-0'"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- DEMO 2 -->
      <div class="flex flex-col gap-4">
        <h3 class="text-highlighted text-lg font-semibold">
          Parar una animación a mitad
        </h3>

        <p class="text-muted text-sm">
          <code class="text-toned">apply</code> lanza la secuencia y
          <code class="text-toned">stop</code> la corta donde esté. El bloque se
          queda congelado en el valor que tenía en ese instante. Prueba a lanzarla
          y a pararla enseguida: con una transición CSS podrías cancelarla, pero
          no preguntar por el valor por donde va, así que no hay forma de detenerla
          a mitad y quedarse ahí.
        </p>

        <div class="bg-muted flex flex-col gap-4 rounded-xl border border-default p-6">
          <div class="flex flex-wrap gap-2">
            <UButton
              label="Lanzar"
              size="sm"
              @click="applySequence('back')"
            />

            <UButton
              label="Parar"
              size="sm"
              color="neutral"
              variant="subtle"
              :disabled="!isAnimating"
              @click="stopSequence()"
            />

            <UBadge
              :label="isAnimating ? 'en curso' : 'parada'"
              size="sm"
              :color="isAnimating ? 'primary' : 'neutral'"
              variant="subtle"
            />
          </div>

          <div class="bg-default relative h-16 overflow-hidden rounded-lg border border-default">
            <div
              ref="sequenceBox"
              class="bg-primary absolute top-1/2 size-10 -translate-y-1/2 rounded-lg"
            />
          </div>
        </div>
      </div>

      <!-- DEMO 3 -->
      <div class="flex flex-col gap-4">
        <h3 class="text-highlighted text-lg font-semibold">
          Gesto a física
        </h3>

        <p class="text-muted text-sm">
          Arrastra el tarjeta. El cubo persigue al puntero con un spring en vez de
          seguirlo pegado, y al soltar vuelve con un rebote corto. En CSS habría
          que traducir el evento a una transición con un retardo fijo, y el retardo
          no puede depender de la velocidad del gesto: uno rápido y uno lento darían
          el mismo retraso, que es justo lo que hace que un arrastre se sienta pegado
          o flotante.
        </p>

        <div class="bg-muted flex flex-col gap-4 rounded-xl border border-default p-6">
          <div class="bg-default relative flex h-40 items-center justify-center overflow-hidden rounded-lg border border-default">
            <div
              class="bg-primary flex size-16 touch-none items-center justify-center rounded-xl select-none"
              :class="dragging ? 'cursor-grabbing' : 'cursor-grab'"
              :style="{
                transform: `translate(${dragCard.x}px, ${dragCard.y}px)`
              }"
              @pointerdown="onPointerDown"
              @pointermove="onPointerMove"
              @pointerup="onPointerUp"
              @pointercancel="onPointerUp"
            >
              <UIcon
                name="i-lucide-move"
                class="text-inverted size-6"
              />
            </div>
          </div>

          <p class="text-toned text-xs">
            Con <code>prefers-reduced-motion</code> activo, el arrastre se
            desactiva y el bloque se coloca directamente en su sitio.
          </p>
        </div>
      </div>

      <!-- Nota -->
      <div class="bg-elevated flex flex-col gap-4 rounded-xl border border-default p-6">
        <div class="flex items-center gap-2">
          <UIcon
            name="i-lucide-info"
            class="text-primary size-4 shrink-0"
          />

          <h3 class="text-highlighted font-semibold">
            Por qué el resto no usa esto
          </h3>
        </div>

        <p class="text-muted text-sm">
          <code class="text-toned">@vueuse/motion</code> pesa lo que una
          transición CSS, pero a cambio hay que mantenerla sincronizada con el
          render del servidor y saber qué valor tiene cada propiedad en cada
          momento. Para una entrada de 700 ms eso no compensa, y por eso
          <code class="text-toned">RevealOnScroll</code> sigue con CSS. Aquí hace
          falta porque el valor tiene que continuar moviéndose entre interactiones,
          y eso no lo resuelve una transición.
        </p>

        <p class="text-muted text-sm">
          Las tres demos usan el módulo
          <code class="text-toned">@vueuse/motion/nuxt</code>, que añade el
          composable y la directiva <code class="text-toned">v-motion</code>. Esta
          página usa el composable: con objetos y refs, sin tocar el HTML. La
          directiva viene bien cuando el estado ya está en el markup.
        </p>
      </div>
    </div>
  </UPageSection>
</template>
