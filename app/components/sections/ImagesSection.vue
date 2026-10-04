<script setup lang="ts">
import valle from '~/assets/images/valle.jpg'
import rio from '~/assets/images/rio.jpg'
import panorama from '~/assets/images/panorama.jpg'

// El modulo @nuxt/image deja de pedir imagenes ya optimizadas a mano: ipx
// recorta, convierte y sirve en el tamano que pide el navegador. Cada
// ejemplo de aqui usa el mismo archivo original con un recorte distinto, y
// en el archivo importado no hay ni una transformacion.
// El placeholder va como numero, no como string: NuxtImg lee un string como
// una URL y lo usaria como src. Se queda en [width, height, quality] porque
// la cuarta posicion emite b_<valor>, que ipx v2 lee como background y espera
// un color: con un 4 ahi la imagen devuelve 400.
const PLACEHOLDER: [number, number, number?] = [32, 32, 20]

const responsive = [
  {
    src: valle,
    alt: 'Cuenca entre montanas al atardecer',
    grid: 'sm:col-span-2 lg:col-span-1',
    sizes: '100vw sm:50vw lg:33vw'
  },
  {
    src: rio,
    alt: 'Rio serpenteante entre canonones oscuros',
    grid: 'lg:col-span-2',
    sizes: '100vw lg:66vw'
  }
] as const

// fit=cover con el contenedor de altura fija hace el recorte: la proporcion
// la fija el height del contenedor, no el width original.
const crops = [
  { src: panorama, alt: 'Panoramica de la cordillera', height: 'h-64' },
  { src: valle, alt: 'Valle recortado en 4:3', height: 'h-64' },
  { src: rio, alt: 'Rio recortado en 1:1', height: 'h-64' }
] as const

const avatars = [
  { src: rio, alt: 'Ana' },
  { src: valle, alt: 'Luis' },
  { src: panorama, alt: 'Marta' }
] as const

const features = [
  {
    icon: 'i-lucide-image',
    title: 'Un src, todas las medidas',
    description: 'NuxtImg genera el srcset y el navegador descarga el tamaño que le toca. La calidad 80 del config es el techo por defecto, así que no hay que tocar imagen por imagen.'
  },
  {
    icon: 'i-lucide-layers',
    title: 'Formatos modernos sin CMS',
    description: 'NuxtPicture emite avif y webp con fallback a jpg. Decide el formato el módulo, no el archivo que subiste.'
  },
  {
    icon: 'i-lucide-crop',
    title: 'Recorte en el markup',
    description: 'width, height, fit y modifiers recortan igual en dev y en build. Sirve para miniaturas sin generar variantes a mano.'
  }
]
</script>

<template>
  <UPageSection
    id="imagenes"
    title="Imágenes"
    description="Los tres archivos de esta sección son los originales que subiste, sin procesar. El módulo hace el resto."
    orientation="horizontal"
    :features="features"
  >
    <div class="flex flex-col gap-6">
      <!--
        sizes describe el ancho que la imagen ocupa en cada breakpoint, no el
        de la ventana: es lo que permite a ipx generar candidatos que encajan
        con el layout en lugar de con la pantalla. Sin placeholder a proposito,
        porque en SSR NuxtImg omite el srcset mientras la imagen real no ha
        cargado, y aqui lo que se quiere enseñar es justamente ese srcset.
      -->
      <div class="grid gap-4 lg:grid-cols-3">
        <NuxtImg
          v-for="image in responsive"
          :key="image.alt"
          :src="image.src"
          :alt="image.alt"
          :sizes="image.sizes"
          :class="image.grid"
          class="w-full rounded-xl object-cover"
          loading="lazy"
        />
      </div>

      <div class="grid gap-4 sm:grid-cols-3">
        <div
          v-for="crop in crops"
          :key="crop.alt"
          class="overflow-hidden rounded-xl"
        >
          <NuxtPicture
            :src="crop.src"
            :alt="crop.alt"
            :img-attrs="{ class: `w-full object-cover ${crop.height}` }"
            format="avif,webp"
            sizes="100vw sm:33vw"
            loading="lazy"
          />
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-6">
        <!--
          El placeholder se pinta mientras carga la version de 32px y se
          sustituye al hacer onload, asi que el salto de borrosa a nitida no
          reserva espacio ni hace layout shift.
        -->
        <NuxtImg
          :src="panorama"
          alt="Carga con placeholder"
          :placeholder="PLACEHOLDER"
          width="256"
          height="160"
          class="rounded-xl object-cover"
        />

        <div class="flex items-center gap-3">
          <UAvatar
            v-for="avatar in avatars"
            :key="avatar.src"
            :src="avatar.src"
            :alt="avatar.alt"
            size="lg"
          />

          <div class="flex flex-col gap-0.5">
            <p class="text-sm">
              UAvatar ya usa NuxtImg por debajo
            </p>

            <span class="text-dimmed text-xs">
              Pasa el src y el módulo se encarga del resto
            </span>
          </div>
        </div>
      </div>
    </div>
  </UPageSection>
</template>
