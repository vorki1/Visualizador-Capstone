<template>
  <div class="contenedor-principal">
    <aside class="menu-lateral">

      <div
        class="flecha-volver"
        @click="volver"
      >
        ←
      </div>

      <h1 class="titulo">
        Subáreas
      </h1>

      <div
        v-for="subarea in subareas"
        :key="subarea"
        class="card-subarea"
        @click="abrirSubarea(subarea)"
      >
        <v-checkbox
          hide-details
          density="compact"
          class="checkbox-subarea"
          @click.stop
        />

        <span class="texto-subarea">
          {{ subarea }}
        </span>
      </div>

    </aside>

    <main class="contenido">
      <h2>Área {{ area }}</h2>
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

.contenedor-principal {
  display: flex;
  min-height: 100vh;
}

.menu-lateral {
  width: 420px;
  height: 100vh;

  background: #d9d9d9;

  padding: 20px;

  display: flex;
  flex-direction: column;
  gap: 15px;

  overflow-y: auto;
}

.flecha-volver {
  text-align: center;

  font-size: 50px;
  font-weight: bold;

  cursor: pointer;

  color: black;

  margin-bottom: 10px;
}

.titulo {
  text-align: center;

  color: #005494;

  font-size: 32px;
  font-weight: bold;

  margin-bottom: 20px;
}

.card-subarea {
  min-height: 85px;

  background: #005494;

  border: 2px solid black;

  display: flex;
  align-items: center;

  padding: 0 15px;

  cursor: pointer;
}

.card-subarea:hover {
  opacity: 0.9;
}

.checkbox-subarea {
  flex-shrink: 0;
  margin-right: 40px;
}

.texto-subarea {
  flex: 1;

  text-align: center;

  color: white;

  font-size: 22px;
  font-weight: bold;
}

.contenido {
  flex: 1;
  padding: 30px;
}

</style>