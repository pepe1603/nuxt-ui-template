// ======================================================================
// COREOGRAFIA DE RevealOnScroll, sobre motion-v
// Vive aqui y no dentro del componente para que la documentacion pueda
// mostrar los retardos reales en vez de copiarlos a mano. Cuando los
// numeros vivian duplicados, la tabla de la pagina de ejemplo seguia
// enseñando los de duration 700 con tarjetas de 900.
// ======================================================================
import type { Options, VariantType } from 'motion-v'

/** El tipo de `variants` que acepta `<Motion>`, tomado del propio paquete.
 *  `Variants` de motion-dom NO encaja: incluye un TargetResolver que el
 *  prop no admite, y asignarlo aqui rompe el typecheck. */
export type Variants = Options['variants']

/** Margin del viewport que observa Motion, replicado desde el paquete: no
 *  lo exporta. Se replica a proposito, porque el typecheck de un margin
 *  mal escrito es justo lo que avisa de que el disparo no va a funcionar. */
type MarginValue = `${number}${'px' | '%'}`
export type MarginType = MarginValue | `${MarginValue} ${MarginValue}` | `${MarginValue} ${MarginValue} ${MarginValue}` | `${MarginValue} ${MarginValue} ${MarginValue} ${MarginValue}`

export type RevealAnimation = 'fade' | 'fade-up' | 'fade-down' | 'from-left' | 'from-right' | 'zoom-in' | 'zoom-out' | 'blur'
export type RevealEasing = 'out' | 'in-out' | 'soft' | 'back'
export type RevealSequence = 'together' | 'lead' | 'staged'

/** Los cuatro pasos de una entrada. Cada uno espera su turno: primero la
 *  opacidad, despues el desplazamiento, y por ultimo escala y desenfoque.
 *  Son pasos logicos, no claves CSS: `translate` abarca `x` e `y` porque
 *  una animacion solo usa una de las dos. */
export const revealChain = ['opacity', 'translate', 'scale', 'filter'] as const
export type RevealChainStep = typeof revealChain[number]

/** Cada paso, con las claves que motion-v tiene que animar. Se declara
 *  aparte para que documentar la cadena y construir el retardo no puedan
 *  separarse: si una animacion nueva usara `rotate`, entraria aqui y
 *  tambien en la tabla de la pagina. */
export const chainKeys: Record<RevealChainStep, readonly string[]> = {
  opacity: ['opacity'],
  translate: ['x', 'y'],
  scale: ['scale'],
  filter: ['filter']
}

/** Fraccion de `duration` que espera cada paso antes de arrancar. */
export const sequenceRatio: Record<RevealSequence, readonly number[]> = {
  together: [0, 0, 0, 0],
  lead: [0, 0.14, 0.14, 0.14],
  staged: [0, 0.2, 0.36, 0.36]
}

/** Curvas. Motion acepta un array de cuatro numeros como cubic-bezier, que
 *  es lo que permite reproducir los mismos curvas que usaba el CSS sin
 *  convertirlas a nombre. `soft` es easeOutExpo: frena muy al final, que es
 *  lo que hace que un movimiento se lea como suave y no brusco. */
export const easingCurves: Record<RevealEasing, number[] | string> = {
  'out': 'easeOut',
  'in-out': 'easeInOut',
  'soft': [0.16, 1, 0.3, 1],
  'back': [0.34, 1.4, 0.64, 1]
}

/** Retardo real de cada paso. Para documentacion y demos. */
export function revealSteps(sequence: RevealSequence, duration: number, delay = 0) {
  return revealChain.map((_, index) => delay + Math.round(duration * (sequenceRatio[sequence][index] ?? 0)))
}

/**
 * Estado de partida de cada animacion.
 *
 * Los valores salen de las clases de Tailwind que se usaban antes: 56px es
 * translate-y-14, 0.9 es scale-90, 'blur(4px)' es blur-sm. Con CSS eran
 * clases; aqui son claves del variant, y por eso motion-v anima transform y
 * opacity por compositor en lugar de recalcular estilos.
 */
export const hiddenState: Record<RevealAnimation, VariantType> = {
  'fade': { opacity: 0 },
  'fade-up': { opacity: 0, y: 56 },
  'fade-down': { opacity: 0, y: -56 },
  'from-left': { opacity: 0, x: -56 },
  'from-right': { opacity: 0, x: 56 },
  'zoom-in': { opacity: 0, scale: 0.9 },
  'zoom-out': { opacity: 0, scale: 1.1 },
  // AVISO: `blur` deja un filter en el estado visible. Un filter distinto de
  // none crea bloque contenedor para descendientes fixed y un contexto de
  // apilamiento: hay que pensarlo antes de meter un tooltip o un modal
  // dentro de un reveal con blur.
  'blur': { opacity: 0, y: 40, scale: 1.05, filter: 'blur(4px)' }
}

/** Estado de asentado. Motion interpola desde el valor actual, asi que
 *  invertir el estado no produce saltos aunque cambie la duracion. */
export const shownState: Record<RevealAnimation, VariantType> = {
  'fade': { opacity: 1 },
  'fade-up': { opacity: 1, y: 0 },
  'fade-down': { opacity: 1, y: 0 },
  'from-left': { opacity: 1, x: 0 },
  'from-right': { opacity: 1, x: 0 },
  'zoom-in': { opacity: 1, scale: 1 },
  'zoom-out': { opacity: 1, scale: 1 },
  'blur': { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
}

/**
 * Transicion con un retardo por paso.
 *
 * Motion acepta transition por propiedad, que es lo que hace posible la
 * cadena: cada clave recibe su propio retardo sin tocar el resto. Antes esto
 * era `transition-delay: 0ms, 200ms, 360ms` en el style; ahora es un objeto,
 * y por eso la pagina ya no necesita `transitionProperty` con `!` para
 * ganarle al reset de reduced motion: eso lo resuelve MotionConfig.
 */
export function revealTransition(sequence: RevealSequence, duration: number, delay: number, easing: RevealEasing): VariantType['transition'] {
  const ease = easingCurves[easing]
  const steps = revealSteps(sequence, duration, delay)

  return revealChain.reduce<Record<string, unknown>>((acc, step, index) => {
    const perKey = { duration, delay: steps[index]!, ease }

    for (const key of chainKeys[step]) {
      acc[key] = perKey
    }

    return acc
  }, {})
}

/**
 * Los dos estados de una animacion, listos para `<Motion>`.
 *
 * `initial` es el estado de partida y `whileInView` el de asentado. Motion
 * revierte `whileInView` solo cuando el elemento sale del viewport, que es
 * justo el comportamiento de once=false, sin tener que observar nada a mano.
 */
export function revealVariants(
  animation: RevealAnimation,
  sequence: RevealSequence,
  duration: number,
  delay: number,
  easing: RevealEasing
): { initial: VariantType, whileInView: VariantType } {
  const transition = revealTransition(sequence, duration, delay, easing)

  return {
    initial: { ...hiddenState[animation], transition },
    whileInView: { ...shownState[animation], transition }
  }
}
