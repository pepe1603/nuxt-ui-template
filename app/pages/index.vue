<script setup lang="ts">
// Esta pagina documenta el sistema de diseno y sirve de ejemplo de
// RevealOnScroll. Eliminala al iniciar un proyecto.
useSeoMeta({
  title: 'Design System',
  description: 'Referencia de tokens y componentes del tema.'
})
</script>

<template>
  <UPage>
    <!--
      El hero va envuelto, y con duration corta y sin retardo porque esta
      por encima del fold: la entrada se ve como una carga, no como un
      scroll. once para que no desaparezca al bajar.
    -->
    <RevealOnScroll
      animation="fade"
      :duration="300"
      once
    >
      <HeroSection />
    </RevealOnScroll>

    <RevealOnScroll animation="fade-up">
      <TypographySection />
    </RevealOnScroll>

    <RevealOnScroll
      animation="fade-up"
      :delay="100"
    >
      <SurfacesSection />
    </RevealOnScroll>

    <RevealOnScroll animation="from-left">
      <ComponentsSection />
    </RevealOnScroll>

    <RevealOnScroll animation="fade-up">
      <RevealSection />
    </RevealOnScroll>

    <RevealOnScroll animation="fade-down">
      <AnimationsSection />
    </RevealOnScroll>

    <RevealOnScroll animation="zoom-in">
      <SequencesSection />
    </RevealOnScroll>

    <RevealOnScroll animation="zoom-in">
      <RepeatSection />
    </RevealOnScroll>

    <RevealOnScroll animation="fade-up">
      <ImagesSection />
    </RevealOnScroll>
  </UPage>
</template>
