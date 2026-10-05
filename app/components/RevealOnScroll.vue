<script setup lang="ts">
// ======================================================================
// REVEAL ON SCROLL
// Unica pieza de animacion de la plantilla, sobre @vueuse/motion.
//
// El observer es useIntersectionObserver de VueUse y lo registra la
// libreria al montar, asi que este componente no observa nada: solo
// declara el estado inicial y el de entrada. No hay logica que mantener
// aqui, y por eso no hay forma de que se desincronice del SSR.
//
// AVISO 1: el estado inicial va en la variante `initial`, no en una clase
// de CSS. Al revés de lo que parece: si el estado inicial fuera una clase
// del elemento, el servidor lo pintaria y el bloque llegaria invisible a
// la primera pantalla, quedandose en un hueco hasta que hidrata. Con la
// variante, el HTML llega visible y la animacion solo ocurre si el bloque
// esta de verdad fuera de la pantalla al cargar.
//
// AVISO 2: `once: true` usa visibleOnce y `once: false` usa visible. No es
// un parametro que la libreria interprete: son dos variantes distintas, y
// por eso el nombre del prop se llama `once` y no `visible`. Con false el
// bloque se oculta al salir del viewport y se repite al volver, que es lo
// mas caro de la lista; por defecto es true.
//
// AVISO 3: se animan transform y opacity, nada mas. El compositor resuelve
// esas dos sin recalcular estilos. No se anima filter: blur(), que va fuera
// del compositor y obliga a rasterizar el elemento entero en cada frame.
// El motivo esta escrito en app/assets/css/main.css.
// ======================================================================

const props = withDefaults(defineProps<{
  /** Desplazamiento y escalado iniciales. `fade` no mueve nada. */
  animation?: RevealAnimation
  /** Curva de la transicion. `soft` frena muy al final. */
  easing?: RevealEasing
  /** Duracion de la transicion en ms. */
  duration?: number
  /** Retardo en ms, para escalonar con el mismo animation. */
  delay?: number
  /** false = reaparece cada vez que vuelve a entrar. */
  once?: boolean
}>(), {
  animation: 'fade-up',
  easing: 'soft',
  duration: 450,
  delay: 0,
  once: true
})

// Un unico objeto por combinacion de props: la libreria compara las
// variantes y regenerarlas en cada render reiniciaria la animacion.
const variants = computed(() => revealVariants(props.animation, props.once))
const transition = computed(() => ({
  duration: props.duration,
  delay: props.delay,
  ease: easingCurves[props.easing]
}))
</script>

<template>
  <div
    v-motion="variants"
    :transition="transition"
  >
    <slot />
  </div>
</template>
