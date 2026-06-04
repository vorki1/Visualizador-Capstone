<template>
  <div class="contenedor-principal">
    <aside class="menu-lateral">
      <button class="flecha-volver" @click="volver">
        ←
      </button>

      <h1 class="titulo">
        Listado de Áreas
      </h1>

      <button
        v-for="area in areas"
        :key="area"
        class="card-area"
        @click="abrirArea(area)"
      >
        Área {{ area }}
      </button>
    </aside>

    <main class="contenido">
      <!-- Espacio para contenido futuro -->
    </main>

    <div class="botones-inferiores">
      <button class="boton-dashboard" @click="irDashboard">
        📊 Dashboard
      </button>

      <button class="boton-treemap" @click="abrirTreemap">
        📊 Treemap
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { obtenerAreas } from '../service/instrumentoService'

const router = useRouter()

const areas = ref<number[]>([])

function abrirArea(area: number) {
  router.push(`/areas/${area}`)
}

function abrirTreemap() {
  router.push('/treemap')
}

function irDashboard() {
  router.push('/dashboard')
}

function volver() {
  router.back()
}

onMounted(async () => {
  try {
    areas.value = await obtenerAreas()
  } catch (error) {
    console.error(error)
  }
})
</script>

<style scoped>
.contenedor-principal {
  display: flex;
  min-height: 100vh;
  position: relative;
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

.card-area {
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

.card-area:hover {
  opacity: 0.85;
}

.contenido {
  flex: 1;
  padding: 30px;
}

.botones-inferiores {
  position: fixed;
  right: 35px;
  bottom: 35px;

  display: flex;
  gap: 15px;
}

.boton-dashboard,
.boton-treemap {
  background: #005494;
  color: white;
  border: 2px solid #003f70;
  border-radius: 14px;

  padding: 18px 28px;

  font-size: 20px;
  font-weight: bold;

  cursor: pointer;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);

  transition: 0.2s ease;
}

.boton-dashboard:hover,
.boton-treemap:hover {
  background: #003f70;
  transform: scale(1.03);
}
</style>