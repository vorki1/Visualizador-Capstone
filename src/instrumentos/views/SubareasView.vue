<template>
  <div class="contenedor-principal">
    <aside class="menu-lateral">
      <button class="flecha-volver" @click="volver">
        ←
      </button>

      <h1 class="titulo">
        Subáreas
      </h1>

      <button
        v-for="subarea in subareas"
        :key="subarea"
        class="card-subarea"
        @click="abrirSubarea(subarea)"
      >
        {{ subarea }}
      </button>
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

const ordenSubareas = [
  'Chancado Primario',
  'Chancado Secundario',
  'Chancado Terciario',
  'Chancado Cuaternario',
  'Acopio Fino',
  'Vacio'
]

function ordenarSubareas(listaSubareas: string[]) {
  return listaSubareas.sort((a, b) => {
    const indexA = ordenSubareas.indexOf(a)
    const indexB = ordenSubareas.indexOf(b)

    if (indexA === -1 && indexB === -1) {
      return a.localeCompare(b)
    }

    if (indexA === -1) return 1
    if (indexB === -1) return -1

    return indexA - indexB
  })
}

function abrirSubarea(subarea: string) {
  router.push(`/areas/${area}/subareas/${encodeURIComponent(subarea)}`)
}

function volver() {
  router.back()
}

onMounted(async () => {
  const respuesta = await obtenerSubareas(area)
  subareas.value = ordenarSubareas(respuesta)
})
</script>

<style scoped>
.contenedor-principal {
  display: flex;
  min-height: 100vh;
}

.menu-lateral {
  width: 400px;
  min-height: 100vh;
  background: #d9d9d9;
  padding: 35px 10px;

  display: flex;
  flex-direction: column;
  align-items: center;

  overflow-y: auto;
}

.flecha-volver {
  background: transparent;
  border: none;
  font-size: 42px;
  font-weight: bold;
  color: black;
  cursor: pointer;
  margin-bottom: 55px;
  line-height: 1;
}

.flecha-volver:hover {
  opacity: 0.7;
}

.titulo {
  color: #005494;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 40px;
  text-align: center;
}

.card-subarea {
  width: 380px;
  height: 85px;
  background: #005494;
  color: white;
  border: 2px solid black;
  margin-bottom: 15px;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 22px;
  font-weight: bold;
  text-align: center;

  cursor: pointer;
}

.card-subarea:hover {
  opacity: 0.85;
}

.contenido {
  flex: 1;
  padding: 30px;
}
</style>