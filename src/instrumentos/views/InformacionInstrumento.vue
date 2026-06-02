<template>
  <div class="detalle-instrumento">
    <div class="panel-informacion">
      <h2>Información del Instrumento</h2>

      <div v-if="instrumento">
        <p><strong>ID:</strong> {{ instrumento.Identificador }}</p>
        <p><strong>TAG:</strong> {{ instrumento.Nombre_TAG }}</p>
        <p><strong>Descripción:</strong> {{ instrumento.Descripcion }}</p>
        <p><strong>Área:</strong> {{ instrumento.Area }}</p>
        <p><strong>Subárea:</strong> {{ instrumento.Subarea }}</p>
        <p><strong>Sistema:</strong> {{ instrumento.Sistema }}</p>
        <p><strong>Unidad:</strong> {{ instrumento.Unidad_de_Ingenieria }}</p>
      </div>

      <p v-else>Cargando información...</p>
    </div>

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
    <div class="contenedor-grafico">
        <Line
            v-if="historico.length > 0"
            :data="datosGrafico"
            :options="opcionesGrafico"
        />

        <p v-else>
            No hay datos históricos disponibles
        </p>
    </div>
  </div>
</div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

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

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
)

import {
  obtenerInfoInstrumento,
  obtenerHistoricoInstrumento,
  type InformacionGeneral
} from '../service/instrumentoService'

const route = useRoute()

const instrumento = ref<InformacionGeneral | null>(null)
const historico = ref<any[]>([])
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

      pointHoverRadius: 5,

      tension: 0.2
    }
  ]
}))
const opcionesGrafico = {
  responsive: true,

  maintainAspectRatio: false,

  plugins: {
    legend: {
      display: true
    }
  },

  scales: {
    x: {
      title: {
        display: true,
        text: 'Tiempo'
      }
    },

    y: {
      title: {
        display: true,
        text: instrumento.value?.Unidad_de_Ingenieria ?? 'Valor'
      }
    }
  }
}

const minutos = ref(15)
const opcionesTiempo = [
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '1 hora', value: 60 },
  { label: '6 horas', value: 360 }
]
async function cargarHistorico(id: number) {
  historico.value = await obtenerHistoricoInstrumento(
    id,
    minutos.value
  )
}
async function cambiarVentanaTiempo() {
  const id = Number(route.params.id)

  await cargarHistorico(id)
}

onMounted(async () => {
  try {
    const id = Number(route.params.id)

    instrumento.value = await obtenerInfoInstrumento(id)

    await cargarHistorico(id)

    console.log('Instrumento:', instrumento.value)
    console.log('Histórico:', historico.value)
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
}

.panel-informacion {
  width: 35%;
  background: white;
  border: 1px solid #d0d0d0;
  padding: 20px;
  overflow-y: auto;
}

.panel-grafico {
  flex: 1;
  background: white;
  border: 1px solid #d0d0d0;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.contenedor-grafico {
  flex: 1;
  border: 2px dashed #999;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: #777;
}
.barra-controles {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.barra-controles select {
  width: 140px;
  height: 36px;
  border: 1px solid #999;
  border-radius: 4px;
  padding: 0 10px;
  background: white;
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

.selector-tiempo option {
  background: white;
  color: black;
}
.barra-controles {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
  color: black;
  font-weight: bold;
}
.contenedor-grafico {
  flex: 1;
  min-height: 500px;
  background: white;
  border: 1px solid #d0d0d0;
  padding: 20px;
}

h2 {
  color: #005494;
  margin-bottom: 20px;
}

p {
  margin-bottom: 12px;
  color: black;
}
</style>