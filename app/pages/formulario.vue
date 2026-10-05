<script setup lang="ts">
// ======================================================================
// PAGINA DE EJEMPLO: FORMULARIO CON VALIDACION
// El formulario vive en components/AppForm.vue. Esta pagina solo lo monta
// y explica lo que hay alrededor.
//
// --------------------------------------------------------------------------
// LO QUE NO HACE ESTA PAGINA
//
// No hay <ClientOnly> alrededor del formulario, y es a proposito.
//
// UForm valida en el cliente, asi que en theory el estado del formulario
// no existe hasta que hay JavaScript y habria un hydration mismatch: el
// servidor pintaria un formulario vacio y el cliente uno lleno. En la
// practica no pasa, y el motivo esta en UForm: el estado vive en un
// reactive de este componente, no en un useState global, y el HTML que sale
// es el mismo con y sin JavaScript. Los errores los pinta UFormField
// cuando UForm valida, que es en el cliente, asi que en el servidor no hay
// ninguno.
//
// Si el formulario llegara a tener estado que venga de una API, ahi si
// habria que decidir: o useState, o <ClientOnly>. Ese es el motivo por el
// que la cola de toasts si es un useState y este formulario no.
const header = {
  title: 'Formulario',
  description: 'UForm con un schema de Zod. El schema no valida: UForm valida, y lo que hace Zod es describir las reglas en un sitio del que ademas sale el tipo del estado. Por eso los errores los pone UFormField solo, debajo del campo que corresponde.'
}

useSeoMeta({
  title: 'Formulario',
  description: 'UForm con Zod: el schema valida y el tipo sale de él.'
})
</script>

<template>
  <UPage>
    <UPageHeader
      title="Formulario"
      description="UForm con un schema de Zod. El schema no valida: UForm valida, y lo que hace Zod es describir las reglas en un sitio del que además sale el tipo del estado. Por eso los errores los pone UFormField solo, debajo del campo que corresponde."
      :ui="header"
    />

    <UPageBody>
      <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div class="bg-elevated rounded-xl border border-default p-6">
          <AppForm />
        </div>

        <aside class="flex flex-col gap-4">
          <UAlert
            color="neutral"
            variant="subtle"
            icon="i-lucide-lightbulb"
            title="Prueba esto"
            description="Envía vacío: cada campo que falle muestra su propio error. Escribe dos contraseñas distintas: el aviso sale bajo la segunda, no bajo la primera."
          />

          <UAlert
            color="warning"
            variant="soft"
            icon="i-lucide-key-round"
            title="Dónde fallan los tres nombres"
            description="name en el schema, name en UFormField y name en el v-model del input. Si uno de los tres no coincide, el error aparece en un campo que no es el suyo, o no aparece."
          />

          <UAlert
            color="info"
            variant="soft"
            icon="i-lucide-file-code-2"
            title="zod es una dependencia tuya"
            description="viene como peer dependency opcional de @nuxt/ui, así que no se puede importar sin instalarla. Está en package.json como dependencia normal."
          />
        </aside>
      </div>
    </UPageBody>
  </UPage>
</template>
