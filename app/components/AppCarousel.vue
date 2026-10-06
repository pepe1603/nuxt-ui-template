<script setup lang="ts">
// La forma de un item del carrusel. Va exportada para que quien lo use
// pueda tipar el array que le pasa, y no tener que repetirlo.
export interface CarouselItem {
  image: string
  title: string
  description?: string
  /** Texto alternativo. Si falta, UImg usa el title. */
  alt?: string
  /** Enlace del boton de la tarjeta, si la tarjeta es pulsable. */
  to?: string
  icon?: string
}

// ======================================================================
// AppCarousel: un UCarousel con los defaults puestos.
//
// Que aporta este envoltorio:
//
//   1. El ancho visible, que es lo unico que hay que decidir de verdad.
//
//      UCarousel no tiene prop para "cuantas tarjetas se ven a la vez".
//      Se decide con clases de Tailwind en `ui.item`: cada item es un
//      basis, y lo que se ve depende de la suma. basis-full es uno
//      entero; basis-1/2 son dos; basis-1/3 son tres.
//
//      Esa es toda la diferencia entre un carrusel de una tarjeta y uno de
//      seis. Sin el wrapper hay que repetir la misma cadena de clases en
//      cada uso y acertar con los prefijos sm: y lg: cada vez.
//
//   2. `perView` con el prefijo puesto. Se escribe `sm:basis-1/2` y no
//      `sm:1/2`: el wrapper pone el `basis-`, que es la parte que se
//      olvida a medias. Las opciones son:
//
//        'basis-full'                        uno a la vez (el clasico)
//        'basis-full sm:basis-1/2'           dos a partir de sm
//        'basis-full sm:basis-1/2 lg:basis-1/3'   tres a partir de lg
//
//   3. El autoplay con su intervalo. OJO: UCarousel NO tiene prop
//      `autoplay-interval`. El intervalo va DENTRO del objeto autoplay y se
//      llama `delay`, porque viene de Embla: `:autoplay="{ delay: 3000 }"`.
//      Si se escribe `autoplay-interval`, Vue lo suelta como atributo, Embla
//      recibe `{}` y el carrusel avanza cada 2000ms (su defecto) sin decir
//      nada. Es el fallo mas dificil de ver de esta API porque todo
//      funciona: solo al ritmo, que no es el que se pidio.
//
// `containScroll` no se pone: UCarousel ya lo trae en 'trimSnaps', que es lo
// correcto con basis-1/2, donde la ultima tarjeta tiene que terminar en el
// borde de la siguiente y no dejar medio hueco.
const props = withDefaults(defineProps<{
  items: CarouselItem[]
  /**
   * Cuantas tarjetas se ven a la vez, por breakpoint. Ver la lista de
   * arriba. El default es el clasico: una tarjeta entera.
   */
  perView?: string
  /** Milisegundos entre tarjeta y tarjeta. */
  interval?: number
  /** Flechas de anterior y siguiente. */
  arrows?: boolean
  /** Puntos de navegacion. */
  dots?: boolean
  /** El autoplay se para al pasar el raton o interactuar. */
  stopOnInteraction?: boolean
}>(), {
  // Por defecto NO se ven varias: es el carrusel clasico de una tarjeta
  // entera. Quien quiera ver mas, lo dice.
  perView: 'basis-full',
  interval: 3000,
  arrows: true,
  dots: true,
  stopOnInteraction: true
})

// El prefijo `basis-` se pone aqui y no en el prop, para que quien llama
// escriba sm:basis-1/2 en vez de sm:1/2: se lee como lo que es.
//
// OJO con el espacio en el default: 'basis-full sm:basis-1/2 lg:basis-1/3'
// tiene basis-full SIN breakpoint, o sea que en movil sigue siendo una
// tarjeta entera. Si se escribiera 'sm:basis-1/2' a secas, en movil no
// tendria ninguna base y la tarjeta se estiria al ancho del contenedor.
const itemClass = computed(() => props.perView)
</script>

<template>
  <!--
    w-full + overflow-hidden: el carrusel calcula su ancho a partir del
    padre y, sin overflow-hidden, las tarjetas que asoman por el borde
    hacen scroll horizontal en la pagina entera. Es el sintoma tipico de
    "en mi movil se mueve toda la web de lado".
  -->
  <UCarousel
    v-slot="{ item }"
    :items="items"
    :ui="{ item: itemClass }"
    :arrows="arrows"
    :dots="dots"
    loop
    :autoplay="{ delay: interval, stopOnInteraction }"
    class="w-full overflow-hidden"
  >
    <UCard
      :ui="{ root: 'overflow-hidden' }"
      class="h-full"
    >
      <figure class="relative">
        <NuxtImg
          :src="item.image"
          :alt="item.alt || item.title"
          loading="lazy"
          class="aspect-video w-full object-cover"
        />

        <!-- La flecha superpuesta no sustituye a las flechas del
             carrusel: esas son para avanzar, esta es para el tipo de
             contenido. -->
        <UIcon
          v-if="item.icon"
          :name="item.icon"
          class="text-primary absolute top-2 left-2 size-6"
        />
      </figure>

      <template #header>
        <h3 class="text-highlighted truncate font-semibold">
          {{ item.title }}
        </h3>
      </template>

      <template #body>
        <p class="text-muted line-clamp-2 text-sm">
          {{ item.description }}
        </p>
      </template>

      <template
        v-if="item.to"
        #footer
      >
        <UButton
          :to="item.to"
          label="Ver"
          icon="i-lucide-arrow-right"
          size="xs"
          color="primary"
          variant="ghost"
          block
          :aria-label="`Ver ${item.title}`"
        />
      </template>
    </UCard>
  </UCarousel>
</template>
