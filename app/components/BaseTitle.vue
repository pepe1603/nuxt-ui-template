<script setup lang="ts">
withDefaults(
  defineProps<{
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p'
    align?: 'left' | 'center'
  }>(),
  {
    as: 'h1',
    align: 'center'
  }
)
</script>

<template>
  <component
    :is="as"
    class="bg-clip-text text-gradient text-4xl font-extrabold tracking-tight text-transparent md:text-6xl sm:text-5xl"
    :class="align === 'center' ? 'text-center' : 'text-left'"
  >
    <slot />
  </component>
</template>
