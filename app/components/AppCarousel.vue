<script setup lang="ts">
// La forma de un item del carrusel. Va exportada para que quien lo use
// pueda tipar el array que le pasa, y no tener que repetirlo.
export interface CarouselItem {
  image: string
  title: string
  description?: string
  /** Texto alternativo. Si falta, la imagen usa el title. */
  alt?: string
  /** Enlace del boton de la tarjeta, si la tarjeta es pulsable. */
  to?: string
  icon?: string
}

// ======================================================================
// AppCarousel: un Carousel de vue3-carousel con los defaults puestos.
//
// Que aporta este envoltorio:
//
//   1. `itemsToShow` como numero, y no como clases de Tailwind.
//
//      Este es el cambio de fondo respecto a UCarousel. Ahi el ancho visible
//      se ponia con basis de Tailwind en el item (`basis-1/3`) y no habia
//      ningun prop para el numero de tarjetas: el ancho lo fijaba el CSS.
//      Aqui el ancho lo pone la biblioteca en JS, dividiendo el ancho del
//      viewport entre las que se ven, y el prop es un numero.
//
//   2. `breakpoints` para el ancho por tamano de pantalla, que es donde
//      vive el responsive. La sintaxis es un objeto cuyo clave es el
//      breakpoint en px y cuyo valor es config parcial:
//
//        breakpoints: { 640: { itemsToShow: 2 }, 1024: { itemsToShow: 3 } }
//
//      OJO con el breakpointMode, que decide contra QUE se mide. Por defecto
//      es 'viewport', o sea que cuenta el ancho de la ventana. Con 'carousel'
//      contaria el ancho del propio carrusel, que dentro de un contenedor
//      estrecho haria que los breakpoints saltaran antes. Para un carrusel
//      normal se quiere el de la ventana: 'viewport'.
//
//   3. `autoplay` como numero de milisegundos, no como objeto.
//
//      Otra diferencia con UCarousel, que tomaba `:autoplay="{ delay }"` por
//      venir de Embla. Aqui es `:autoplay="3000"` a pelo, y para apagarlo se
//      pone a 0. Un objeto ahi no falla: se multiplica y da NaN, y el
//      carrusel se queda parado.
//
//   4. La altura. Por defecto la biblioteca pone height: 'auto', que
//      funciona. Pero las tarjetas se miden y se reparten con
//      getBoundingClientRect, asi que `height: 'auto'` es lo que hay que
//      dejar: pasarlo a un px fijo obligaria a saber de antemano cuanto
//      mide una tarjeta, y con dos lineas de texto el texto se corta.
withDefaults(defineProps<{
  items: CarouselItem[]
  /**
   * Cuantas tarjetas se ven a la vez en el ancho mas pequeno. El responsive
   * va en `breakpoints`, no aqui: el prop es el valor base.
   */
  itemsToShow?: number
  /**
   * Ancho por breakpoint, en px de ventana. Cada valor es config parcial del
   * carrusel. Ejemplo: `{ 640: { itemsToShow: 2 }, 1024: { itemsToShow: 3 } }`
   */
  breakpoints?: Record<number, { itemsToShow: number }>
  /** Milisegundos entre tarjeta y tarjeta. 0 lo apaga. */
  interval?: number
  /** Flechas de anterior y siguiente. */
  arrows?: boolean
  /** Puntos de navegacion. */
  dots?: boolean
  /** El autoplay se para al pasar el raton. */
  pauseOnHover?: boolean
  /** Separacion entre tarjetas, en px. */
  gap?: number
}>(), {
  // Una tarjeta entera a la vez: el clasico. Quien quiera ver mas, lo dice.
  itemsToShow: 1,
  interval: 3000,
  arrows: true,
  dots: true,
  pauseOnHover: true,
  gap: 16
})
</script>

<template>
  <!--
    La biblioteca trae su CSS en dist/carousel.css y el modulo lo anade solo a
    la lista global, asi que no hay que importarlo aqui ni en nuxt.config.

    NO se pone nada de estilo en el .carousel: sus clases ya traen
    position: relative, y la posicion de las flechas y los puntos se calcula
    respecto a esa caja. Un transform o un filter aqui los moveria de sitio.
  -->
  <Carousel
    :items-to-show="itemsToShow"
    :breakpoints="breakpoints"
    :wrap-around="true"
    :autoplay="interval"
    :pause-autoplay-on-hover="pauseOnHover"
    :gap="gap"
    :aria-label="`Carrusel de ${items.length} elementos`"
  >
    <!--
      El slot default devuelve UN Slide por item y nada mas: la biblioteca
      mete sus hijos entre viewport y addons con un array plano, asi que
      cualquier otro elemento aqui acaba dentro del track, como si fuera una
      tarjeta mas, y se cuenta como un slide mas en la paginacion.

      Las flechas y los puntos van en su propio slot #addons, que es el
      unico que la biblioteca coloca por encima del track. Con Navigation y
      Pagination sin template dentro, cada uno dibuja sus botones con el
      icono SVG que trae la propia libreria: los --vc-* de su CSS ya los
      posicionan respecto al .carousel, y un boton propio con las clases
      carousel__next tendria que replicar a mano ese posicionamiento.
    -->
    <Slide
      v-for="item in items"
      :key="item.title"
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

          <!-- El icono va dentro de la imagen, y no la sustituye: es el
               tipo de contenido, no la navegacion del carrusel. -->
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
    </Slide>

    <!--
      Un solo template #addons para los dos. Dos templates con el mismo nombre
      de slot es un error de Vue, no una concatenacion: el segundo sobrescribe
      al primero y las flechas desaparecen segun el orden de compilacion.
      Adentro si puede haber v-if, uno por cada hijo.
    -->
    <template #addons>
      <Navigation v-if="arrows" />
      <Pagination v-if="dots" />
    </template>
  </Carousel>
</template>
