<script setup lang="ts">
// ======================================================================
// GalleryCarousel: una imagen grande con su tira de miniaturas.
//
// ----------------------------------------------------------------------
// POR QUE `v-model` Y NO `v-model:currentSlide`
//
// La libreria no tiene prop `currentSlide` ni evento `update:currentSlide`.
// El prop se llama `modelValue` y el evento `update:modelValue`, y lo que
// lleva dentro es el indice de la slide activa. O sea que la forma buena de
// escribirlo es `v-model`, sin sufijo:
//
//   v-model:currentSlide   ->  Vue busca un prop `currentSlide`, que no
//                              existe. No falla: nunca se mueve la imagen.
//
//   v-model                ->  prop modelValue, indice de la slide.
//
// Esto no es una opinion mia: los .d.ts de la libreria declaran un unico
// evento, `update:modelValue`. Lo mismo en 0.15 y en 0.19.
// ----------------------------------------------------------------------
// POR QUE HAY DOS Carousel Y UN SOLO INDICE
//
// La miniatura no puede "sincronizarse" con la grande por su cuenta: si el
// carrusel de miniaturas recibe el indice como modelValue, su watcher interno
// (slideTo) lo lleva a esa miniatura. Por eso los dos comparten `current`:
// la grande lo escribe al moverse, y las miniaturas lo leen.
//
// Y al reves, al pulsar una miniatura se llama slideTo en la grande, que
// escribe modelValue y actualiza `current`. Un solo estado, las dos
// direcciones.
//
// OJO con el v-model en la grande y solo :model-value en las miniaturas: si
// las dos usaran v-model, la grande escribiria `current` en cada movimiento
// reventaria el watcher de las miniaturas en medio del arrastre, y el
// carrusel de abajo saltaria a cada fotograma. Con :model-value la grande es
// la unica que escribe.
// ======================================================================
defineProps<{
  /** URLs de las imagenes, en orden. */
  images: string[]
  /** Texto alternativo base. Se numera solo si falta el de la imagen. */
  alt?: string
}>()

const current = defineModel<number>({ default: 0 })

// Referencia a la libreria para poder llamar a slideTo y a las flechas.
// `expose` de Carousel publica next(), prev() y slideTo(index), asi que
// desde el template ref hay que llamar a .value.next() y no a next().
const main = useTemplateRef('main')

function goTo(index: number) {
  main.value?.slideTo(index)
}
</script>

<template>
  <!--
    Los colores van con los tokens semanticos (bg-elevated, border-default),
    no con `bg-white dark:bg-gray-900`. Los grises del ejemplo estan
    desconectados de la paleta que declara main.css, asi que la caja se
    quedaria fuera de tema en los dos sentidos: gris claro sobre fondo claro
    y gris muy oscuro sobre fondo oscuro. Los tokens ya estan resueltos para
    ambos temas.
  -->
  <div class="bg-elevated rounded-2xl border border-default p-4 shadow-lg">
    <Carousel
      ref="main"
      v-model="current"
      :items-to-show="1"
      :wrap-around="false"
      snap-align="center"
      :autoplay="0"
      :aria-label="`Galeria de ${images.length} imagenes`"
    >
      <Slide
        v-for="(image, index) in images"
        :key="image"
      >
        <!--
          El contenedor del Slide lleva el recorte y el ratio; la imagen solo
          object-cover. Si el ratio fuera a la imagen, el borde redondeado la
          dejaria asomar por fuera en algunos navegadores.
        -->
        <div class="aspect-video w-full overflow-hidden rounded-xl">
          <NuxtImg
            :src="image"
            :alt="`${alt ? alt + ' ' : ''}${index + 1} de ${images.length}`"
            loading="lazy"
            class="h-full w-full object-cover"
          />
        </div>
      </Slide>

      <!--
        Las flechas van en #addons, que es el unico slot que la libreria
        coloca encima del track. Aqui van a mano con UButton porque se
        quiere el estilo del proyecto, y por eso NO llevan las clases
        carousel__prev / carousel__next: esas traen su propio
        inset y translate y se pisarian con el posicionamiento de abajo.

        La posicion es respecto al .carousel, que la libreria pone con
        position: relative.
      -->
      <template #addons>
        <UButton
          v-if="images.length > 1"
          icon="i-lucide-chevron-left"
          color="neutral"
          variant="solid"
          size="sm"
          class="absolute left-2 top-1/2 -translate-y-1/2 rounded-full"
          aria-label="Imagen anterior"
          @click="main?.prev()"
        />

        <UButton
          v-if="images.length > 1"
          icon="i-lucide-chevron-right"
          color="neutral"
          variant="solid"
          size="sm"
          class="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
          aria-label="Imagen siguiente"
          @click="main?.next()"
        />
      </template>
    </Carousel>

    <!--
      Tira de miniaturas. Es un segundo Carousel con itemsToShow=4 y SIN
      wrapAround: con wrapAround la libreria clona slides para cerrar el
      circulo, y los clones cuentan como imagenes en el registro, asi que el
      indice que devuelve ya no coincide con el de `images` y la miniatura
      activa se marca en la posicion equivocada.

      Solo recibe :model-value, nunca v-model: la grande es la que escribe.
    -->
    <Carousel
      v-if="images.length > 1"
      :model-value="current"
      :items-to-show="4"
      :wrap-around="false"
      :autoplay="0"
      :gap="12"
      snap-align="start"
      class="mt-4"
      aria-label="Miniaturas"
    >
      <Slide
        v-for="(image, index) in images"
        :key="`thumb-${image}`"
      >
        <button
          type="button"
          class="block w-full overflow-hidden rounded-lg ring-offset-2 ring-offset-transparent transition"
          :class="index === current ? 'ring-2 ring-primary' : 'opacity-60 hover:opacity-100'"
          :aria-label="`Ver imagen ${index + 1}`"
          :aria-current="index === current"
          @click="goTo(index)"
        >
          <NuxtImg
            :src="image"
            :alt="''"
            loading="lazy"
            class="aspect-video w-full object-cover"
          />
        </button>
      </Slide>
    </Carousel>

    <p
      v-if="images.length > 1"
      class="text-dimmed mt-3 text-center text-sm tabular-nums"
    >
      {{ current + 1 }} / {{ images.length }}
    </p>
  </div>
</template>
