<script setup lang="ts">
// ======================================================================
// PAGINA DE EJEMPLO: CARRUSEL
// El carrusel vive en components/AppCarousel.vue. Esta pagina lo monta dos
// veces para comparar los dos anchos utiles.
//
// --------------------------------------------------------------------------
// LO QUE NO SE PUEDE PONER EN UN CARRUSEL
//
// Un carrusel con texto que hay que leer no se lee: lo unico que se puede
// leer con comodidad es lo que esta quieto. Por eso las tarjetas de aqui
// llevan el titulo corto y la descripcion de dos lineas, y el detalle
// entero vive en el destino del boton.
//
// Y hay una trampa de accesibilidad que no tiene arreglo con CSS: si el
// carrusel mueve solo, las tarjetas que no estan visibles siguen siendo
// tabulables y el foco se va a un elemento que nadie ve. Por eso
// stopOnInteraction va activado, para que el raton pare el avance, y para
// que el contenido importante no dependa de que el visitante lo vea por
// azar.
useSeoMeta({
  title: 'Carrusel',
  description: 'UCarousel con las tarjetas que se ven a la vez decidedas por breakpoint.'
})

// Las imagenes de picsum van con su host en la lista de domains de
// nuxt.config.ts, sin lo cual ipx las devuelve sin recortar y sin avif.
const slides = [
  {
    image: 'https://picsum.photos/id/1015/1200/800',
    title: 'Rio entre montanas',
    description: 'basis-full: una imagen entera, la opcion para una portada o un anuncio.',
    alt: 'Rio caudaloso entre laderas rocosas',
    icon: 'i-lucide-mountain',
    to: '#'
  },
  {
    image: 'https://picsum.photos/id/1016/1200/800',
    title: 'Caminos de tierra',
    description: 'Con sm:basis-1/2, dos tarjetas desde tablet y una sola en movil.',
    alt: 'Senda de tierra entre vegetacion',
    icon: 'i-lucide-route',
    to: '#'
  },
  {
    image: 'https://picsum.photos/id/1018/1200/800',
    title: 'Valle con niebla',
    description: 'La imagen va con aspect-video para que todas las tarjetas miden igual.',
    alt: 'Valle cubierto de niebla al amanecer',
    icon: 'i-lucide-cloud-fog',
    to: '#'
  },
  {
    image: 'https://picsum.photos/id/1019/1200/800',
    title: 'Costa recortada',
    description: 'Dots y flechas vienen puestos. Se desactivan con arrows y dots.',
    alt: 'Acantilados junto al mar',
    icon: 'i-lucide-waves',
    to: '#'
  },
  {
    image: 'https://picsum.photos/id/1024/1200/800',
    title: 'Lobo en la nieve',
    description: 'loop:true hace que la última esté enlazada con la primera.',
    alt: 'Lobo blanco sobre nieve profunda',
    icon: 'i-lucide-paw-print',
    to: '#'
  },
  {
    image: 'https://picsum.photos/id/1039/1200/800',
    title: 'Cascada entre rocas',
    description: 'Con autoplay delay: 3000ms aquí, el intervalo va dentro del objeto.',
    alt: 'Cascada cayendo entre rocas oscuras',
    icon: 'i-lucide-waves',
    to: '#'
  }
]

const header = {
  title: 'Carrusel',
  description: 'UCarousel no tiene prop para cuántas tarjetas se ven: se decide con basis de Tailwind en el slot item. basis-full es una, basis-1/2 son dos, basis-1/3 son tres, y se combinan con sm: y lg:.'
}
</script>

<template>
  <UPage>
    <UPageHeader
      :title="header.title"
      :description="header.description"
    />

    <UPageBody>
      <div class="flex flex-col gap-10">
        <section class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <h2 class="text-highlighted font-semibold">
              Una tarjeta a la vez
            </h2>

            <p class="text-muted text-sm">
              El default del wrapper:
              <code class="text-primary">perView="basis-full"</code>. Es el
              carrusel clásico, y el que vale para una portada.
            </p>
          </div>

          <AppCarousel
            :items="slides"
            :interval="4000"
          />
        </section>

        <section class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <h2 class="text-highlighted font-semibold">
              Tres a la vez en escritorio
            </h2>

            <p class="text-muted text-sm">
              Con
              <code class="text-primary">basis-full sm:basis-1/2 lg:basis-1/3</code>.
              En móvil sigue siendo una tarjeta entera, porque
              <code class="text-primary">basis-full</code> va sin breakpoint.
            </p>
          </div>

          <AppCarousel
            :items="slides"
            per-view="basis-full sm:basis-1/2 lg:basis-1/3"
            :interval="3000"
          />
        </section>

        <UAlert
          color="neutral"
          variant="subtle"
          icon="i-lucide-info"
          title="Dónde está cada cosa"
          description="El ancho, en el prop perView. El ritmo, en interval, que por dentro es autoplay.delay de Embla. Las flechas y los dots, en arrows y dots. El ancho de la caja, en w-full overflow-hidden de la raíz."
        />
      </div>
    </UPageBody>
  </UPage>
</template>
