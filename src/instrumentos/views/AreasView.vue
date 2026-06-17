<template>
  <v-container fluid class="areas-view">
    <v-row class="fill-height" no-gutters>
      <!-- MENÚ LATERAL -->
      <v-col cols="12" md="4" lg="3" class="menu-lateral">
        <v-btn
          icon
          variant="text"
          class="flecha-volver"
          @click="volver"
        >
          ←
        </v-btn>

        <h1 class="titulo">Listado de Áreas</h1>

        <v-btn
          v-for="area in areas"
          :key="area"
          block
          class="card-area"
          @click="abrirArea(area)"
        >
          Área {{ area }}
        </v-btn>

        <v-btn
          v-if="esAdmin"
          block
          color="green-darken-2"
          class="mt-6 boton-menu"
          @click="irAdmin"
        >
          ⚙️ Panel Admin
        </v-btn>

        <v-btn
          block
          color="grey-darken-3"
          class="mt-3 boton-menu"
          @click="cerrarSesion"
        >
          Cerrar sesión
        </v-btn>
      </v-col>

      <!-- CONTENIDO -->
      <v-col cols="12" md="8" lg="9" class="contenido">
        <!-- Espacio para contenido futuro -->

        <div class="botones-inferiores">
          <v-btn
            color="primary"
            size="large"
            class="boton-inferior"
            @click="irDashboard"
          >
            📊 Dashboard
          </v-btn>

          <v-btn
            color="primary"
            size="large"
            class="boton-inferior"
            @click="abrirTreemap"
          >
            📊 Treemap
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { obtenerAreas } from '../service/instrumentoService'

const router = useRouter()

const areas = ref<number[]>([])

const esAdmin = computed(() => {
  return localStorage.getItem('rol') === 'admin'
})

function abrirArea(area: number) {
  router.push(`/areas/${area}`)
}

function abrirTreemap() {
  router.push('/treemap')
}

function irDashboard() {
  router.push('/dashboard')
}

function irAdmin() {
  router.push('/admin')
}

function cerrarSesion() {
  localStorage.removeItem('rol')
  router.push('/')
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
.areas-view {
  min-height: 100vh;
  padding: 0;
  background: #f4f6f8;
}

.menu-lateral {
  min-height: 100vh;
  background: #d9d9d9;
  padding: 35px 16px;

  display: flex;
  flex-direction: column;
  align-items: center;

  overflow-y: auto;
}

.flecha-volver {
  font-size: 42px;
  font-weight: bold;
  color: black;
  margin-bottom: 45px;
  line-height: 1;
}

.titulo {
  color: #005494;
  font-size: clamp(26px, 4vw, 32px);
  font-weight: bold;
  margin-bottom: 40px;
  text-align: center;
}

.card-area {
  min-height: 85px;
  max-width: 380px;
  margin-bottom: 15px;

  background: #005494 !important;
  color: white !important;
  border: 2px solid black;

  font-size: 22px;
  font-weight: bold;
  border-radius: 0;
}

.card-area:hover {
  opacity: 0.85;
}

.boton-menu {
  max-width: 380px;
  min-height: 55px;
  font-size: 18px;
  font-weight: bold;
}

.contenido {
  position: relative;
  min-height: 100vh;
  padding: 30px;
}

.botones-inferiores {
  position: fixed;
  right: 35px;
  bottom: 35px;

  display: flex;
  gap: 15px;
}

.boton-inferior {
  min-width: 160px;
  min-height: 58px;
  border-radius: 14px;
  font-size: 18px;
  font-weight: bold;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);
}

/* Tablet y celular */
@media (max-width: 960px) {
  .menu-lateral {
    min-height: auto;
    padding: 28px 18px;
  }

  .contenido {
    min-height: 220px;
    padding-bottom: 120px;
  }

  .botones-inferiores {
    position: fixed;
    left: 16px;
    right: 16px;
    bottom: 18px;

    justify-content: center;
    flex-wrap: wrap;
  }

  .boton-inferior {
    flex: 1;
    min-width: 140px;
  }
}

/* Celular pequeño */
@media (max-width: 480px) {
  .flecha-volver {
    margin-bottom: 25px;
    font-size: 36px;
  }

  .titulo {
    margin-bottom: 28px;
  }

  .card-area {
    min-height: 72px;
    font-size: 20px;
  }

  .botones-inferiores {
    flex-direction: column;
  }

  .boton-inferior {
    width: 100%;
  }
}
</style>