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
const props = defineProps<{
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

// ======================================================================
// LIGHTBOX
//
// Dos estados y no uno: `lightbox` es el interruptor y `lightboxImg` la URL
// abierta. Podria guardar solo el indice y deducir la imagen, pero entonces
// abrir necesita dos pasos y el `@click.self` que cierra dependeria de
// comparar strings en vez de un booleano. Con los dos, abrir y cerrar son
// asignaciones directas.
//
// OJO con el nombre de la URL en los indices: `lightboxImg` guarda la URL,
// no la posicion. Por eso los botones de abajo buscan el indice con
// indexOf antes de moverse.
const lightbox = ref(false)
const lightboxImg = ref('')

// ----------------------------------------------------------------------
// POR QUE EL FONDO ES UN DIV CON @click.self Y NO UN UModal
//
// UModal ya hace todo esto: fondo, cierre con Escape, foco atrapado, bloqueo
// del scroll del body. Se podria usar y seria menos codigo.
//
// La razon para no usarlo es el scroll del body. UModal lo bloquea, y al
// cerrarse lo restaura; este overlay no lo hace, asi que abrir la imagen
// grande sobre una pagina que ya tiene scroll deja el fondo movible. Es un
// ejemplo de demo, asi que el div plano va bien. En una app de verdad, UModal
// es lo correcto aqui y estos ~20 lineas sobrarian.
// ----------------------------------------------------------------------

// El indice de la imagen abierta. -1 cuando el lightbox esta cerrado.
const lightboxIndex = computed(() => props.images.indexOf(lightboxImg.value))

function openLightbox(image: string) {
  lightboxImg.value = image
  lightbox.value = true
}

function closeLightbox() {
  lightbox.value = false
}

// El bucle da la vuelta al final. Sin el % , el boton de siguiente se
// quedaria sin efecto en la ultima imagen y pareceria roto.
function stepLightbox(delta: number) {
  const total = props.images.length
  const from = lightboxIndex.value

  if (from === -1 || total === 0) {
    return
  }

  lightboxImg.value = props.images[(from + delta + total) % total]!
}

// Escape cierra. Se registra en la ventana y no en el div porque el div
// cierra con @click.self, y con el teclado no hay ningun "self".
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeLightbox()
  }
}

// Un solo listener para toda la vida del componente, no uno por apertura.
// addEventListener con la MISMA funcion es idempotente, asi que aunque se
// llamara dos veces no habria doble respuesta; y registrar en onMounted
// evita tocar `window` durante el render, que en SSR no existe.
onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
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

          El cursor y el hover van en el div, no en la imagen: si fueran en la
          imagen, solo se verian sobre los pixeles que la imagen ocupa,
          y el hover se encenderia y apagaria al mover el raton por encima.
        -->
        <div
          class="aspect-video w-full cursor-pointer overflow-hidden rounded-xl transition-transform duration-300 hover:scale-105"
          role="button"
          tabindex="0"
          :aria-label="`Ampliar imagen ${index + 1} de ${images.length}`"
          @click="openLightbox(image)"
          @keydown.enter="openLightbox(image)"
          @keydown.space.prevent="openLightbox(image)"
        >
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

  <!--
    Lightbox. Va FUERA del div de la galeria, como hermano, y no dentro: si
    estuviera dentro, el overlay quedaria dentro del .carousel y la libreria
    lo moveria con el track al arrastrar. Tambien estaria dentro del
    RevealOnScroll de la pagina, y ese tiene un transform, que es bloque
    contenedor para fixed: el overlay se mediria contra la seccion y no
    contra la ventana, y con la pagina desplazada apareceria a medio camino.

    El v-if va en el Transition y no en el div, que es como Vue espera: si el
    v-if estuviera en el div, el Transition no tendria nada que animar al
    aparecer y la entrada no se veria.
  -->
  <Transition name="lightbox-fade">
    <div
      v-if="lightbox"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      role="dialog"
      aria-modal="true"
      :aria-label="`Imagen ampliada ${lightboxIndex + 1} de ${images.length}`"
      @click.self="closeLightbox"
    >
      <!--
        max-h y max-w en vez de h-full: con h-full la imagen se estiraria a
        la altura de la ventana y se deformaria, porque el ratio se pierde.
        object-contain mantiene el ratio dejando el hueco que sobre.
      -->
      <NuxtImg
        :src="lightboxImg"
        :alt="`${alt ? alt + ' ' : ''}${lightboxIndex + 1} de ${images.length}`"
        class="max-h-screen max-w-screen rounded-xl object-contain shadow-2xl"
      />

      <UButton
        icon="i-lucide-x"
        color="white"
        variant="ghost"
        size="xl"
        class="absolute right-4 top-4 rounded-full"
        aria-label="Cerrar"
        @click="closeLightbox"
      />

      <UButton
        v-if="images.length > 1"
        icon="i-lucide-chevron-left"
        color="white"
        variant="ghost"
        size="xl"
        class="absolute left-4 top-1/2 -translate-y-1/2 rounded-full"
        aria-label="Imagen anterior"
        @click="stepLightbox(-1)"
      />

      <UButton
        v-if="images.length > 1"
        icon="i-lucide-chevron-right"
        color="white"
        variant="ghost"
        size="xl"
        class="absolute right-4 top-1/2 -translate-y-1/2 rounded-full"
        aria-label="Imagen siguiente"
        @click="stepLightbox(1)"
      />
    </div>
  </Transition>
</template>
