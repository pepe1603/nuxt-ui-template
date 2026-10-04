<script setup lang="ts">
// ======================================================================
// REVEAL ON SCROLL
// Unica pieza de animacion de la plantilla, sobre motion-v.
//
// Antes el observer era mio y el "como" eran clases de Tailwind. Ahora las
// dos cosas las hace Motion: `whileInView` dispara, y los estados son
// variantes. No queda IntersectionObserver en el codigo.
//
// AVISO 1: los estados de `hiddenState` y `shownState` viven en utils/motion
// y son claves de variant tipadas. Un error de nombre falla el typecheck,
// que es la red que sustituye a la de las clases de antes.
//
// AVISO 2: reduced motion NO es automatico. Lo resuelve el
// `<MotionConfig reducedMotion="user">` de app.vue, que hace falta para
// toda la app. Sin ese nodo, estas animaciones se mueven igual.
// `reducedMotion="user"` deja pasar opacity y descarta transform y layout,
// que es el equivalente a los `motion-reduce:translate-none` de antes.
//
// AVISO 3: `amount: 'some'` + margin negativo en vez de un umbral alto. Un
// `amount` numerico es un ratio, y una seccion de 3000px en un viewport de
// 800px nunca pasa de 0.26. El margin encoge el viewport que observa
// Motion, asi que el disparo no depende de la altura del elemento.
//
// AVISO 4: sin JavaScript el contenido se queda en el estado inicial, que es
// invisible. Es el mismo precio que pagaba la version con CSS, y es lo que
// hace que SSR pinte el bloque oculto y luego lo revele. Para contenido que
// deba verse sin JS hay que sacar la animacion de la ruta critica.
// ======================================================================

const props = withDefaults(defineProps<{
  /** Desplazamiento y escalado iniciales. `fade` no mueve nada. */
  animation?: RevealAnimation
  /** Curva de la transicion. `soft` es easeOutExpo: frena muy al final,
   *  que es lo que hace que un movimiento se lea como suave y no brusco. */
  easing?: RevealEasing
  /** Duracion de la transicion en ms. */
  duration?: number
  /** Retardo en ms, para escalonar hijos con el mismo animation. */
  delay?: number
  /** Como se encadenan las propiedades dentro de una misma entrada. */
  sequence?: RevealSequence
  /** false = reaparece cada vez que vuelve a entrar. true = solo la 1a vez. */
  once?: boolean
  /** Fraccion del elemento visible para disparar: `some`, `all` o un numero. */
  amount?: 'some' | 'all' | number
  /** Margen del viewport que observa Motion. */
  margin?: MarginType
}>(), {
  animation: 'fade-up',
  easing: 'soft',
  duration: 700,
  delay: 0,
  sequence: 'staged',
  once: false,
  amount: 'some',
  margin: '-12% 0px -12% 0px'
})

// Un unico objeto por combinacion de props: motion-v compara por referencia
// y regenerar el variant en cada rendereria reiniciaria la animacion.
const variants = computed(() => revealVariants(
  props.animation,
  props.sequence,
  props.duration,
  props.delay,
  props.easing
))

const inViewOptions = computed(() => ({
  once: props.once,
  amount: props.amount,
  margin: props.margin
}))
</script>

<template>
  <Motion
    as="div"
    :initial="variants.initial"
    :while-in-view="variants.whileInView"
    :in-view-options="inViewOptions"
  >
    <slot />
  </Motion>
</template>
