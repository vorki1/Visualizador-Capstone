<template>
  <div class="detalle-instrumento">
    <div class="panel-izquierdo">
      <div class="panel-informacion">
        <button class="boton-volver" @click="volver">←</button>

        <h2>Información del Instrumento</h2>

        <div v-if="instrumento">
          <table class="tabla-instrumento">
            <tbody>
              <tr><th>ID</th><td>{{ instrumento.Identificador }}</td></tr>
              <tr><th>TAG</th><td>{{ instrumento.Nombre_TAG }}</td></tr>
              <tr><th>Descripción</th><td>{{ instrumento.Descripcion }}</td></tr>
              <tr><th>Área</th><td>{{ instrumento.Area }}</td></tr>
              <tr><th>Subárea</th><td>{{ instrumento.Subarea }}</td></tr>
              <tr><th>Sistema</th><td>{{ instrumento.Sistema }}</td></tr>
              <tr><th>Unidad</th><td>{{ instrumento.Unidad_de_Ingenieria }}</td></tr>
            </tbody>
          </table>
        </div>

        <p v-else>Cargando información...</p>
      </div>

      <div class="panel-alertas">
        <h2>Últimas Fallas</h2>

        <div v-if="fallasSeparadas.length > 0" class="lista-fallas">
          <div
            v-for="falla in fallasSeparadas"
            :key="`${falla.Identificador}-${falla.Fecha_Inicio_Alarma}-${falla.Tipo_Alerta}-${falla.Nivel_Alerta}`"
            class="falla-item"
          >
            <strong>{{ falla.Nombre_TAG }}</strong>
            falla el
            <strong>{{ formatearFecha(falla.Fecha_Inicio_Alarma) }}</strong>

            <br />

            por
            <strong>{{ falla.Tipo_Alerta }}</strong>
            en nivel

            <span
              class="badge-alerta"
              :class="claseNivelAlerta(falla.Nivel_Alerta)"
            >
              {{ falla.Nivel_Alerta }}
            </span>
          </div>
        </div>

        <p v-else>No hay fallas registradas para este sensor.</p>
      </div>
    </div>

    <div class="panel-derecho">
      <div class="panel-grafico">
        <h2>Histórico</h2>

        <div class="barra-controles">
          <span>Ventana:</span>

          <select
            v-model="minutos"
            class="selector-tiempo"
            @change="cambiarVentanaTiempo"
          >
            <option
              v-for="opcion in opcionesTiempo"
              :key="opcion.value"
              :value="opcion.value"
            >
              {{ opcion.label }}
            </option>
          </select>
        </div>

        <div class="contenedor-grafico">
          <Line
            v-if="historico.length > 0"
            :data="datosGrafico"
            :options="opcionesGrafico"
          />

          <p v-else>No hay datos históricos disponibles</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
} from 'chart.js'

import { Line } from 'vue-chartjs'

import {
  obtenerInfoInstrumento,
  obtenerHistoricoInstrumento,
  obtenerAlertasInstrumentos,
  type InformacionGeneral
} from '../service/instrumentoService'


ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
)

interface AlertaInstrumento {
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

const route = useRoute()
const router = useRouter()

const instrumento = ref<InformacionGeneral | null>(null)
const historico = ref<any[]>([])
const minutos = ref(15)
const alertas = ref<AlertaInstrumento[]>([])

const opcionesTiempo = [
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '1 hora', value: 60 },
  { label: '6 horas', value: 360 }
]

const alertasInstrumento = computed(() => {
  if (!instrumento.value) return []

  return alertas.value
    .filter(alerta =>
      Number(alerta.Identificador) === Number(instrumento.value?.Identificador)
    )
    .sort((a, b) =>
      new Date(b.Fecha_Inicio_Alarma).getTime() -
      new Date(a.Fecha_Inicio_Alarma).getTime()
    )
})

const fallasSeparadas = computed(() => {
  return alertasInstrumento.value.flatMap(alerta => {
    const tipos = alerta.Tipo_Alerta.split(',').map(tipo => tipo.trim())
    const niveles = alerta.Nivel_Alerta.split(',').map(nivel => nivel.trim())

    return tipos.map((tipo, index) => ({
      ...alerta,
      Tipo_Alerta: tipo,
      Nivel_Alerta: niveles[index] ?? niveles[0] ?? 'SIN NIVEL'
    }))
  })
})

const datosGrafico = computed(() => ({
  labels: historico.value.map(punto =>
    new Date(punto.x).toLocaleTimeString('es-CL')
  ),

  datasets: [
    {
      label: instrumento.value?.Nombre_TAG ?? 'Instrumento',
      data: historico.value.map(punto => punto.y),
      borderColor: '#005494',
      backgroundColor: '#005494',
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 6,
      tension: 0.25
    }
  ]
}))

const opcionesGrafico = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,

  interaction: {
    mode: 'index' as const,
    intersect: false
  },

  plugins: {
    legend: {
      display: false
    },

    tooltip: {
      enabled: true,
      callbacks: {
        title: function (context: any) {
          return `Hora: ${context[0].label}`
        },

        label: function (context: any) {
          const valor = context.parsed.y
          const unidad = instrumento.value?.Unidad_de_Ingenieria ?? ''

          return `Valor: ${valor} ${unidad}`
        }
      }
    }
  },

  scales: {
    x: {
      title: {
        display: true,
        text: 'Tiempo'
      },

      ticks: {
        maxRotation: 45,
        minRotation: 45
      }
    },

    y: {
      title: {
        display: true,
        text: instrumento.value?.Unidad_de_Ingenieria ?? 'Valor'
      }
    }
  }
}))

function volver() {
  router.back()
}

function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleString('es-CL')
}

function claseNivelAlerta(nivel: string) {
  const nivelNormalizado = nivel.trim().toUpperCase()

  if (nivelNormalizado === 'PREVENTIVO') return 'nivel-preventivo'
  if (nivelNormalizado === 'CRITICO' || nivelNormalizado === 'CRÍTICO') return 'nivel-critico'
  if (nivelNormalizado === 'EMERGENCIA') return 'nivel-emergencia'

  return 'nivel-default'
}

async function cargarHistorico(id: number) {
  historico.value = await obtenerHistoricoInstrumento(id, minutos.value)
}

async function cambiarVentanaTiempo() {
  const id = Number(route.params.id)
  await cargarHistorico(id)
}

onMounted(async () => {
  try {
    const id = Number(route.params.id)

    instrumento.value = await obtenerInfoInstrumento(id)
    alertas.value = await obtenerAlertasInstrumentos()

    await cargarHistorico(id)

    //console.log('Alertas instrumento:', alertasInstrumento.value)
  } catch (error) {
    console.error('Error cargando datos del instrumento:', error)
  }
})
</script>

<style scoped>
.detalle-instrumento {
  display: flex;
  height: 100vh;
  background: #f5f5f5;
  gap: 20px;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
}

.panel-izquierdo {
  width: 35%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 0;
}

.panel-informacion {
  width: 100%;
  background: white;
  border: 1px solid #d0d0d0;
  padding: 20px;
  box-sizing: border-box;
}

.panel-alertas {
  width: 100%;
  background: white;
  border: 1px solid #d0d0d0;
  padding: 20px;
  box-sizing: border-box;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.panel-derecho {
  flex: 1;
  min-height: 0;
}

.panel-grafico {
  height: 100%;
  background: white;
  border: 1px solid #d0d0d0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.boton-volver {
  background: transparent;
  border: none;
  color: black;
  font-size: 34px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 10px;
  padding: 0;
}

.boton-volver:hover {
  color: #005494;
}

.barra-controles {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  color: black;
  font-weight: bold;
}

.selector-tiempo {
  width: 150px;
  height: 38px;
  border: 2px solid #005494;
  border-radius: 6px;
  background: white;
  color: black;
  font-size: 16px;
  font-weight: bold;
  padding: 0 12px;
  cursor: pointer;
}

.selector-tiempo:focus {
  outline: none;
  border-color: #003f70;
  box-shadow: 0 0 0 2px rgba(0, 84, 148, 0.2);
}

.contenedor-grafico {
  flex: 1;
  min-height: 0;
  background: white;
  border: 1px solid #d0d0d0;
  padding: 20px;
}

.lista-fallas {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.falla-item {
  background: #f5f5f5;
  border-left: 4px solid #005494;
  padding: 12px;
  color: #222;
  font-size: 15px;
  line-height: 1.5;
}

.badge-alerta {
  display: inline-block;
  min-width: 120px;
  text-align: center;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  margin-left: 6px;
}

.nivel-preventivo {
  background: #fff000;
  color: black;
}

.nivel-critico {
  background: #f39c12;
  color: black;
}

.nivel-emergencia {
  background: #ff1414;
  color: white;
}

.nivel-default {
  background: #808080;
  color: white;
}

h2 {
  color: #005494;
  margin-bottom: 20px;
}

p {
  margin-bottom: 12px;
  color: black;
}

.tabla-instrumento {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.tabla-instrumento th {
  width: 35%;
  background: #005494;
  color: white;
  text-align: left;
  padding: 12px;
  border: 1px solid #d0d0d0;
}

.tabla-instrumento td {
  background: white;
  color: black;
  padding: 12px;
  border: 1px solid #d0d0d0;
}

.tabla-instrumento tr:nth-child(even) td {
  background: #f7f7f7;
}
</style>