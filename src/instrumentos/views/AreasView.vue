<template>
  <v-container>

    <h1 class="text-center mb-6">
      Listado de Áreas
    </h1>

    <v-row justify="center">
      <v-col
        v-for="area in areas"
        :key="area"
        cols="12"
        sm="6"
        md="4"
      >
        <BaseCard
          :titulo="`Área ${area}`"
          @click="abrirArea(area)"
        />
      </v-col>
    </v-row>

    <div class="text-center mt-4">
      <v-btn
        color="secondary"
        @click="volver"
      >
        Volver
      </v-btn>
    </div>

  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { obtenerAreas } from '../service/instrumentoService'
import BaseCard from '../components/BaseCardComponent.vue'

const router = useRouter()

const areas = ref<any[]>([])

function abrirArea(area: number) {
  router.push(`/areas/${area}`)
}
function volver() {
  router.push('/')
}
onMounted(async () => {
  try {
    areas.value = await obtenerAreas()

    console.log(areas.value)
  }
  catch (error) {
    console.error(error)
  }
})
</script>