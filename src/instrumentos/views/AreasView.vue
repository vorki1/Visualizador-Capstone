<template>
  <div class="vista-area">

    <aside class="menu-izquierdo">
      <h1 class="titulo">
        Listado de Áreas
      </h1>

      <div
        v-for="area in areas"
        :key="area"
        class="card-area"
        @click="abrirArea(area)"
      >
        Área {{ area }}
      </div>

      <v-btn
        color="secondary"
        class="mt-6"
        @click="volver"
      >
        Volver
      </v-btn>
    </aside>

    <main class="contenido-derecho">
      <!-- Aquí después va tu tabla u otro contenido -->
    </main>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { obtenerAreas } from '../service/instrumentoService'
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

<style scoped>
.vista-area {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

.menu-izquierdo {
  width: 340px;
  background: #d9d9d9;
  padding: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.titulo {
  color: #45c991;
  font-size: 32px;
  margin-bottom: 30px;
  text-align: center;
}

.card-area {
  width: 260px;
  height: 95px;
  background: #005494;
  color: white;
  border: 3px solid black;
  margin-bottom: 25px;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 22px;
  font-weight: bold;
  cursor: pointer;
}

.card-area:hover {
  opacity: 0.85;
}

.contenido-derecho {
  flex: 1;
  padding: 30px;
}
</style>