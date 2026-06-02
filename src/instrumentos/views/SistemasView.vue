<template>
  <div class="vista-sistemas">
    <aside class="menu-lateral">
      <button class="boton-volver-icono" @click="volver">
        ←
      </button>

      <h2 class="titulo-menu">
        Sistemas de {{ subarea }}
      </h2>

      <div class="selector-lista">
        <div
          v-for="sistema in sistemas"
          :key="sistema"
          class="item-sistema"
          :class="{ seleccionado: sistemasSeleccionados.includes(sistema) }"
          @click="toggleSistema(sistema)"
        >
          <span class="checkbox-visual">
            {{ sistemasSeleccionados.includes(sistema) ? '✓' : '' }}
          </span>

          <span class="nombre-sistema">
            {{ sistema }}
          </span>
        </div>
      </div>
    </aside>

    <main class="contenido">
      <h1 class="titulo-principal">
        Área {{ area }}
      </h1>

      <div class="panel-tabla">
        <div class="contenedor-filtros">
          <select v-model="filtroSensor" class="filtro-select">
            <option value="">Sensor</option>
            <option
              v-for="sensor in sensoresDisponibles"
              :key="sensor"
              :value="sensor"
            >
              {{ sensor }}
            </option>
          </select>

          <select v-model="filtroTipoAlarma" class="filtro-select">
            <option value="">Tipo Alarma</option>
            <option
              v-for="tipo in tiposDisponibles"
              :key="tipo"
              :value="tipo"
            >
              {{ tipo }}
            </option>
          </select>

          <select v-model="filtroNivel" class="filtro-select">
            <option value="">Nivel</option>
            <option
              v-for="nivel in nivelesDisponibles"
              :key="nivel"
              :value="nivel"
            >
              {{ nivel }}
            </option>
          </select>
        </div>

        <table class="tabla-instrumentos">
          <thead>
            <tr>
              <th>Sensor</th>
              <th>Descripción</th>
              <th>Equipo</th>
              <th>Tipo de Alarma</th>
              <th>Nivel</th>
              <th>Hora de Alarma</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="alarma in alarmasMostradas"
              :key="`${alarma.Identificador}-${alarma.Sistema}-${alarma.Tipo_Alerta}`"
            >
              <td>{{ alarma.Nombre_TAG }}</td>
              <td>{{ alarma.Descripcion }}</td>
              <td>{{ alarma.Sistema }}</td>
              <td>{{ alarma.Tipo_Alerta }}</td>

              <td>
                <span
                  class="badge-alerta"
                  :class="claseNivel(alarma.Nivel_Alerta)"
                >
                  {{ alarma.Nivel_Alerta }}
                </span>
              </td>

              <td>{{ formatearFecha(alarma.Fecha_Inicio_Alarma) }}</td>
            </tr>

            <tr v-if="alarmasMostradas.length === 0">
              <td colspan="6" class="sin-datos">
                No hay sensores con alertas para los filtros seleccionados
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import {
  obtenerSistemas,
  obtenerInstrumentos
} from '../service/instrumentoService'

import datosAlertas from '../../../data/tabla_alertas.json'

interface Instrumento {
  Identificador: number
  Nombre_TAG: string
}

interface AlertaJson {
  Identificador: number
  Nombre_TAG: string
  Descripcion: string
  Unidad_de_Ingenieria: string
  Tipo_Alerta: string
  Nivel_Alerta: string
  Fecha_Inicio_Alarma: string
  Fecha_Ultima_Actualizacion: string
  Ciclos_Alarma: number
  Alarma_Activa: boolean
}

interface AlarmaTabla {
  Identificador: number
  Nombre_TAG: string
  Descripcion: string
  Sistema: string
  Tipo_Alerta: string
  Nivel_Alerta: string
  Fecha_Inicio_Alarma: string
  Ciclos_Alarma: number
}

const route = useRoute()
const router = useRouter()

const area = Number(route.params.area)
const subarea = String(route.params.subarea)

const sistemas = ref<string[]>([])
const sistemasSeleccionados = ref<string[]>([])
const alarmasFiltradas = ref<AlarmaTabla[]>([])

const filtroSensor = ref('')
const filtroTipoAlarma = ref('')
const filtroNivel = ref('')

const alertas = datosAlertas as AlertaJson[]

const alarmasMostradas = computed(() => {
  return alarmasFiltradas.value.filter(alarma => {
    const sensorOK =
      filtroSensor.value === '' ||
      alarma.Nombre_TAG === filtroSensor.value

    const tipoOK =
      filtroTipoAlarma.value === '' ||
      alarma.Tipo_Alerta === filtroTipoAlarma.value

    const nivelOK =
      filtroNivel.value === '' ||
      alarma.Nivel_Alerta === filtroNivel.value

    return sensorOK && tipoOK && nivelOK
  })
})

const sensoresDisponibles = computed(() => {
  return [...new Set(alarmasFiltradas.value.map(a => a.Nombre_TAG))]
})

const tiposDisponibles = computed(() => {
  return [...new Set(alarmasFiltradas.value.map(a => a.Tipo_Alerta))]
})

const nivelesDisponibles = computed(() => {
  return [...new Set(alarmasFiltradas.value.map(a => a.Nivel_Alerta))]
})

function volver() {
  router.back()
}

function buscarAlertaPorSensor(idSensor: number): AlertaJson | undefined {
  return alertas.find(alerta => alerta.Identificador === idSensor)
}

async function toggleSistema(sistema: string) {
  const index = sistemasSeleccionados.value.indexOf(sistema)

  if (index >= 0) {
    sistemasSeleccionados.value.splice(index, 1)
  } else {
    sistemasSeleccionados.value.push(sistema)
  }

  limpiarFiltros()
  await cargarAlarmas()
}

function limpiarFiltros() {
  filtroSensor.value = ''
  filtroTipoAlarma.value = ''
  filtroNivel.value = ''
}

async function cargarAlarmas() {
  const resultado: AlarmaTabla[] = []

  for (const sistema of sistemasSeleccionados.value) {
    const instrumentos = await obtenerInstrumentos(sistema)

    instrumentos.forEach((instrumento: Instrumento) => {
      const alerta = buscarAlertaPorSensor(instrumento.Identificador)

      if (!alerta || !alerta.Alarma_Activa) {
        return
      }

      const tipos = alerta.Tipo_Alerta
        .split(',')
        .map(tipo => tipo.trim())

      const niveles = alerta.Nivel_Alerta
        .split(',')
        .map(nivel => nivel.trim())

      tipos.forEach((tipo, index) => {
        resultado.push({
          Identificador: alerta.Identificador,
          Nombre_TAG: alerta.Nombre_TAG,
          Descripcion: alerta.Descripcion,
          Sistema: sistema,
          Tipo_Alerta: tipo,
          Nivel_Alerta: niveles[index] || niveles[0],
          Fecha_Inicio_Alarma: alerta.Fecha_Inicio_Alarma,
          Ciclos_Alarma: alerta.Ciclos_Alarma
        })
      })
    })
  }

  alarmasFiltradas.value = resultado.sort((a, b) => {
    return (
      new Date(b.Fecha_Inicio_Alarma).getTime() -
      new Date(a.Fecha_Inicio_Alarma).getTime()
    )
  })
}

function claseNivel(nivel: string) {
  const nivelUpper = nivel.toUpperCase()

  if (nivelUpper.includes('EMERGENCIA')) return 'emergencia'
  if (nivelUpper.includes('CRITICO')) return 'critico'
  if (nivelUpper.includes('PREVENTIVO')) return 'preventivo'

  return 'normal'
}

function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleString('es-CL')
}

onMounted(async () => {
  sistemas.value = await obtenerSistemas(subarea)
})
</script>

<style scoped>
.vista-sistemas {
  display: flex;
  min-height: 100vh;
  background: #f5f5f5;
}

.menu-lateral {
  width: 340px;
  height: 100vh;
  background: #d9d9d9;
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.boton-volver-icono {
  background: transparent;
  border: none;
  font-size: 60px;
  cursor: pointer;
  color: black;
}

.titulo-menu {
  text-align: center;
  color: #005494;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 25px;
}

.selector-lista {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
}

.item-sistema {
  width: 100%;
  min-height: 70px;
  background: #005494;
  color: white;
  border: 2px solid black;
  display: flex;
  align-items: center;
  padding: 0 18px;
  gap: 18px;
  cursor: pointer;
  font-size: 22px;
  font-weight: bold;
}

.item-sistema.seleccionado {
  background: #00a651;
  border: 3px solid white;
  box-shadow: 0 0 10px rgba(0, 0, 0, .45);
}

.checkbox-visual {
  width: 28px;
  height: 28px;
  border: 2px solid white;
  background: white;
  color: #00a651;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

.nombre-sistema {
  flex: 1;
  text-align: center;
}

.contenido {
  flex: 1;
  padding: 30px;
  background: white;
}

.titulo-principal {
  text-align: center;
  color: #005494;
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 30px;
}

.panel-tabla {
  border: 1px solid #d0d0d0;
  padding: 20px;
  height: calc(100vh - 180px);
  overflow: auto;
}

.contenedor-filtros {
  display: flex;
  gap: 16px;
  margin-bottom: 22px;
  justify-content: flex-start;
}

.filtro-select {
  width: 230px;
  height: 42px;
  border: 2px solid black;
  background: white;
  color: black;
  font-size: 16px;
  padding-left: 12px;
}

.tabla-instrumentos {
  width: 100%;
  border-collapse: collapse;
  color: black;
}

.tabla-instrumentos th {
  background: #005494;
  color: white;
  padding: 10px;
  border: 1px solid #777;
}

.tabla-instrumentos td {
  padding: 10px;
  border: 1px solid #aaa;
  text-align: center;
}

.badge-alerta {
  display: inline-block;
  min-width: 110px;
  padding: 6px 10px;
  border-radius: 6px;
  font-weight: bold;
  color: black;
}

.preventivo {
  background: #fff200;
}

.critico {
  background: #ff9900;
}

.emergencia {
  background: #ff0000;
  color: white;
}

.normal {
  background: #d4edda;
}

.sin-datos {
  text-align: center;
  color: #777;
  padding: 30px;
}

.selector-lista::-webkit-scrollbar {
  width: 14px;
}

.selector-lista::-webkit-scrollbar-track {
  background: #3f3f3f;
  border-radius: 10px;
}

.selector-lista::-webkit-scrollbar-thumb {
  background: #8a8a8a;
  border-radius: 10px;
  border: 3px solid #3f3f3f;
}

.selector-lista::-webkit-scrollbar-thumb:hover {
  background: #b0b0b0;
}
</style>