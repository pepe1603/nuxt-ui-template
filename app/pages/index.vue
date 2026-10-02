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
      El hero va sin retardo porque esta por encima del fold: el observer
      dispara en el primer frame y la entrada se ve como una carga, no como
      un scroll. once=true para que no desaparezca al bajar.
    -->
    <RevealOnScroll
      animation="fade"
      :duration="500"
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
  </UPage>
</template>
