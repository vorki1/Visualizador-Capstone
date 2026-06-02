<template>

  <div class="contenedor-principal">

    <aside class="menu-lateral">

      <h1 class="titulo">
        Subáreas
      </h1>

      <div
        v-for="subarea in subareas"
        :key="subarea"
        class="card-subarea"
        @click="abrirSubarea(subarea)"
      >
        {{ subarea }}
      </div>

      <v-btn
        color="secondary"
        class="mt-4"
        @click="volver"
      >
        Volver
      </v-btn>

    </aside>

    <main class="contenido">
      <h2>Área {{ area }}</h2>

      <!-- Aquí iría la tabla -->
    </main>

  </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { obtenerSubareas } from '../service/instrumentoService'
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

<style scoped>

.contenedor-principal{
  display:flex;
  min-height:100vh;
}

.menu-lateral{

  width:320px;

  padding:20px;

  background:#d9d9d9;

  display:flex;
  flex-direction:column;
  gap:20px;

}

.titulo{
  text-align:center;
}

.card-subarea{

  height:100px;

  background:#005494;
  color:white;

  border:2px solid black;

  display:flex;
  justify-content:center;
  align-items:center;

  font-size:24px;

  cursor:pointer;
}

.card-subarea:hover{
  opacity:.9;
}

.contenido{

  flex:1;

  padding:30px;

}

</style>