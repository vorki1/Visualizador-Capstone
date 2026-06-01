<template>
  <v-container>

    <h1 class="text-center">
      Área {{ area }}
    </h1>

    <h2 class="text-center mb-6">
      Sistemas de {{ subarea }}
    </h2>

    <v-row justify="center">
      <v-col
        v-for="sistema in sistemas"
        :key="sistema"
        cols="12"
        sm="6"
        md="4"
      >
        <BaseCard
          :titulo="sistema"
          @click="abrirSistema(sistema)"
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

import { obtenerSistemas } from '../service/instrumentoService'
import BaseCard from '../components/BaseCardComponent.vue'

const route = useRoute()
const router = useRouter()

const area = Number(route.params.area)
const subarea = String(route.params.subarea)

const sistemas = ref<string[]>([])

function abrirSistema(sistema: string) {
  router.push(
    `/areas/${area}/subareas/${encodeURIComponent(subarea)}/sistemas/${encodeURIComponent(sistema)}`
  )
}

function volver() {
  router.back()
}

onMounted(async () => {
  sistemas.value = await obtenerSistemas(subarea)

  console.log(sistemas.value)
})
</script>