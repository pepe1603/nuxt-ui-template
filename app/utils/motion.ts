// ======================================================================
// ESTADOS DEL REVEAL
// Con @vueuse/motion no hay coreografia: el componente declara las
// variantes y esta tabla dice como se ve cada una. Sin cadena de pasos,
// sin reparto de duracion y sin transicion por propiedad, asi que no
// existe el desfase entre el numero que dice el documento y el que
// tarda el navegador.
//
// Lo que se anima son transform y opacity, las dos propiedades que el
// compositor resuelve sin recalcular estilos. No hay filter: blur() en
// ningun estado, y el motivo esta en main.css.
// ======================================================================

export type RevealAnimation = 'fade' | 'fade-up' | 'fade-down' | 'from-left' | 'from-right' | 'zoom-in' | 'zoom-out'
export type RevealEasing = 'out' | 'in-out' | 'soft' | 'back'
/** `once` solo la primera vez; `repeat` cada vez que vuelve a entrar. */
export type RevealOnce = boolean

/** Lo que ve el usuario, como utilidades de Tailwind. El componente las
 *  pasa tal cual a v-motion, asi que el typecheck cubre los nombres. */
export type RevealState = Record<string, string>

export const hiddenState: Record<RevealAnimation, RevealState> = {
  'fade': { opacity: '0' },
  'fade-up': { opacity: '0', translate: '0 56px' },
  'fade-down': { opacity: '0', translate: '0 -56px' },
  'from-left': { opacity: '0', translate: '-56px 0' },
  'from-right': { opacity: '0', translate: '56px 0' },
  'zoom-in': { opacity: '0', scale: '0.9' },
  'zoom-out': { opacity: '0', scale: '1.1' }
}

/** Estado de reposo. Vacio a proposito: no hay nada que declarar cuando el
 *  bloque ya esta en su sitio. */
export const shownState: RevealState = {}

/** Curvas, como nombres de timing function de CSS. */
export const easingCurves: Record<RevealEasing, string> = {
  'out': 'ease-out',
  'in-out': 'ease-in-out',
  'soft': 'cubic-bezier(0.16, 1, 0.3, 1)',
  'back': 'cubic-bezier(0.34, 1.4, 0.64, 1)'
}

/** Las variantes que se pasan a v-motion.
 *
 *  `once: true`   -> initial + visibleOnce: solo la primera vez.
 *  `once: false`  -> initial + visible:      cada vez que entra.
 *
 *  El estado inicial se declara en `initial` y no en CSS a proposito: asi el
 *  servidor pinta el bloque VISIBLE y no invisible. Con el patron contrario
 *  el HTML llegaba con opacity:0 y el contenido se quedaba en un hueco
 *  invisible hasta que JavaScript hydrataba y registraba el observer. */
export function revealVariants(animation: RevealAnimation, once: RevealOnce): {
  initial: RevealState
  [key: string]: RevealState
} {
  return once
    ? { initial: hiddenState[animation], visibleOnce: shownState }
    : { initial: hiddenState[animation], visible: shownState }
}
