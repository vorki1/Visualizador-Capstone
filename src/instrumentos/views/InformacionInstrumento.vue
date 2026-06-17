<template>
  <v-container fluid class="detalle-instrumento">
    <v-row class="fill-height">
      <!-- PANEL IZQUIERDO -->
      <v-col cols="12" lg="4" class="panel-col">
        <v-card class="panel-card" elevation="4" color="white">
          <v-card-text>
            <v-btn
              icon
              variant="text"
              class="boton-volver"
              @click="volver"
            >
              ←
            </v-btn>

            <h2 class="titulo-panel">Información del Instrumento</h2>

            <div v-if="instrumento" class="tabla-wrapper">
              <v-table class="tabla-instrumento">
                <tbody>
                  <tr>
                    <th>ID</th>
                    <td>{{ instrumento.Identificador }}</td>
                  </tr>

                  <tr>
                    <th>TAG</th>
                    <td>{{ instrumento.Nombre_TAG }}</td>
                  </tr>

                  <tr>
                    <th>Descripción</th>
                    <td>{{ instrumento.Descripcion }}</td>
                  </tr>

                  <tr>
                    <th>Área</th>
                    <td>{{ instrumento.Area }}</td>
                  </tr>

                  <tr>
                    <th>Subárea</th>
                    <td>{{ instrumento.Subarea }}</td>
                  </tr>

                  <tr>
                    <th>Sistema</th>
                    <td>{{ instrumento.Sistema }}</td>
                  </tr>

                  <tr>
                    <th>Unidad</th>
                    <td>{{ instrumento.Unidad_de_Ingenieria }}</td>
                  </tr>
                </tbody>
              </v-table>
            </div>

            <p v-else class="texto-info">Cargando información...</p>
          </v-card-text>
        </v-card>

        <v-card class="panel-card panel-alertas" elevation="4" color="white">
          <v-card-title class="titulo-panel">
            Últimas Fallas
          </v-card-title>

          <v-card-text>
            <div v-if="fallasSeparadas.length > 0" class="lista-fallas">
              <v-card
                v-for="falla in fallasSeparadas"
                :key="`${falla.Identificador}-${falla.Fecha_Inicio_Alarma}-${falla.Tipo_Alerta}-${falla.Nivel_Alerta}`"
                class="falla-item"
                elevation="0"
              >
                <strong>{{ falla.Nombre_TAG }}</strong>
                falla el
                <strong>{{ formatearFecha(falla.Fecha_Inicio_Alarma) }}</strong>

                <br />

                por
                <strong>{{ falla.Tipo_Alerta }}</strong>
                en nivel

                <v-chip
                  size="small"
                  class="ml-1 badge-alerta"
                  :class="claseNivelAlerta(falla.Nivel_Alerta)"
                >
                  {{ falla.Nivel_Alerta }}
                </v-chip>
              </v-card>
            </div>

            <p v-else class="texto-info">
              No hay fallas registradas para este sensor.
            </p>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- PANEL DERECHO -->
      <v-col cols="12" lg="8" class="panel-col">
        <v-card class="panel-card panel-grafico" elevation="4" color="white">
          <v-card-title class="titulo-panel">
            Histórico
          </v-card-title>

          <v-card-text class="grafico-card-text">
            <div class="barra-controles">
              <span>Ventana:</span>

              <v-select
                v-model="minutos"
                :items="opcionesTiempo"
                item-title="label"
                item-value="value"
                variant="outlined"
                density="compact"
                class="selector-tiempo"
                hide-details
                @update:model-value="cambiarVentanaTiempo"
              />
            </div>

            <div class="contenedor-grafico">
              <Line
                v-if="historico.length > 0"
                :data="datosGrafico"
                :options="opcionesGrafico"
              />

              <p v-else class="texto-info">
                No hay datos históricos disponibles
              </p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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
  } catch (error) {
    console.error('Error cargando datos del instrumento:', error)
  }
})
</script>

<style scoped>
.detalle-instrumento {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

.panel-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.panel-card {
  background: white !important;
  color: #1e293b !important;
  border: 1px solid #d0d0d0;
  border-radius: 16px;
}

.panel-alertas {
  flex: 1;
  min-height: 260px;
  max-height: 420px;
  overflow-y: auto;
}

.panel-grafico {
  min-height: calc(100vh - 40px);
}

.grafico-card-text {
  height: calc(100vh - 130px);
  display: flex;
  flex-direction: column;
}

.boton-volver {
  color: black !important;
  font-size: 34px;
  font-weight: bold;
  margin-bottom: 10px;
}

.titulo-panel {
  color: #005494 !important;
  font-size: 24px;
  font-weight: 900;
  margin-bottom: 16px;
}

.texto-info {
  color: #1e293b !important;
  font-weight: 600;
}

.tabla-wrapper {
  width: 100%;
  overflow-x: auto;
}

.tabla-instrumento {
  background: white !important;
  color: #1e293b !important;
}

:deep(.tabla-instrumento table) {
  background: white !important;
  border-collapse: collapse;
}

:deep(.tabla-instrumento th) {
  width: 35%;
  background: #005494 !important;
  color: white !important;
  text-align: left;
  padding: 12px;
  border: 1px solid #d0d0d0;
  white-space: nowrap;
}

:deep(.tabla-instrumento td) {
  background: white !important;
  color: #1e293b !important;
  padding: 12px;
  border: 1px solid #d0d0d0;
  font-weight: 600;
}

:deep(.tabla-instrumento tr:nth-child(even) td) {
  background: #f7f7f7 !important;
}

.barra-controles {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  color: #1e293b;
  font-weight: bold;
}

.selector-tiempo {
  max-width: 170px;
}

.contenedor-grafico {
  flex: 1;
  min-height: 360px;
  background: white;
  border: 1px solid #d0d0d0;
  border-radius: 12px;
  padding: 20px;
}

.lista-fallas {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.falla-item {
  background: #f8fafc !important;
  border-left: 4px solid #005494;
  padding: 14px;
  color: #1e293b !important;
  font-size: 15px;
  line-height: 1.5;
  border-radius: 10px;
}

.badge-alerta {
  min-width: 110px;
  justify-content: center;
  font-size: 13px;
  font-weight: 900;
}

.nivel-preventivo {
  background: #fff000 !important;
  color: black !important;
}

.nivel-critico {
  background: #f39c12 !important;
  color: black !important;
}

.nivel-emergencia {
  background: #ff1414 !important;
  color: white !important;
}

.nivel-default {
  background: #808080 !important;
  color: white !important;
}

@media (max-width: 1280px) {
  .panel-grafico {
    min-height: 520px;
  }

  .grafico-card-text {
    height: 470px;
  }
}

@media (max-width: 600px) {
  .detalle-instrumento {
    padding: 14px;
  }

  .titulo-panel {
    font-size: 21px;
  }

  .barra-controles {
    flex-direction: column;
    align-items: flex-start;
  }

  .selector-tiempo {
    max-width: 100%;
    width: 100%;
  }

  .contenedor-grafico {
    min-height: 320px;
    padding: 12px;
  }

  :deep(.tabla-instrumento th),
  :deep(.tabla-instrumento td) {
    font-size: 13px;
    padding: 10px;
  }
}
</style>