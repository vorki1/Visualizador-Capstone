<template>
  <v-container>

    <h1 class="text-center mb-6">
      Subáreas del área {{ area }}
    </h1>

    <v-row justify="center">
      <v-col
        v-for="subarea in subareas"
        :key="subarea"
        cols="12"
        sm="6"
        md="4"
      >
        <BaseCard
          :titulo="subarea"
          @click="abrirSubarea(subarea)"
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
import { useRoute, useRouter } from 'vue-router'

import { obtenerSubareas } from '../service/instrumentoService'
import BaseCard from '../components/BaseCardComponent.vue'

const route = useRoute()
const router = useRouter()

const area = Number(route.params.area)

const subareas = ref<string[]>([])

function abrirSubarea(subarea: string) {
  router.push(
    `/areas/${area}/subareas/${encodeURIComponent(subarea)}`
  )
}

function volver() {
  router.back()
}

onMounted(async () => {
  subareas.value = await obtenerSubareas(area)
})
</script>