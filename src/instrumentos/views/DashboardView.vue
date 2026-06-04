<template>
  <div class="dashboard">
    <div class="barra-superior">
      <button class="flecha-volver" @click="volver">←</button>
      <span class="estado-linea">● En línea</span>
    </div>

    <header class="encabezado">
      <h1>Monitor de alarmas</h1>
      <p>Resumen de sensores con alertas activas</p>
    </header>

    <section class="contenedor-kpis">
      <div class="kpi-card preventivo">
        <p class="kpi-label">Sensores en preventivo</p>
        <h2 :class="{ cero: conteosAnimados.preventivo === 0 }">
          {{ conteosAnimados.preventivo }}
        </h2>
      </div>

      <div class="kpi-card critico">
        <p class="kpi-label">Sensores en crítico</p>
        <h2 :class="{ cero: conteosAnimados.critico === 0 }">
          {{ conteosAnimados.critico }}
        </h2>
      </div>

      <div class="kpi-card emergencia">
        <p class="kpi-label">Sensores en emergencia</p>
        <h2 :class="{ cero: conteosAnimados.emergencia === 0 }">
          {{ conteosAnimados.emergencia }}
        </h2>
      </div>
    </section>

    <section class="zona-inferior">
      <section class="panel-tabla">
        <div class="cabecera-tabla">
          <h2>Alertas de la planta</h2>
        </div>

        <div class="contenedor-tabla">
          <table>
            <thead>
              <tr>
                <th>Nombre Sensor</th>
                <th>Equipo</th>
                <th>Tipo de falla</th>
                <th>Nivel de falla</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(alerta, index) in alertasTabla" :key="index">
                <td>{{ alerta.sensor }}</td>
                <td>{{ alerta.equipo }}</td>
                <td>{{ alerta.tipo }}</td>
                <td>
                  <span class="badge-nivel" :class="claseNivel(alerta.nivel)">
                    {{ alerta.nivel }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="panel-subareas">
        <div class="cabecera-subareas">
          <h2>Fallas por subárea</h2>
        </div>

        <div class="lista-subareas">
          <div
            v-for="(subarea, index) in fallasPorSubarea"
            :key="subarea.nombre"
            class="fila-subarea"
          >
            <span class="nombre-subarea">{{ subarea.nombre }}</span>

            <div class="barra-contenedor">
              <div
                class="barra-progreso"
                :class="`color-${index % 5}`"
                :style="{ width: `${subarea.porcentaje}%` }"
              ></div>
            </div>

            <strong>{{ subarea.cantidad }}</strong>
          </div>
        </div>
      </section>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import alertasJson from '../../../data/tabla_alertas.json'

const router = useRouter()

const conteosAnimados = ref({
  preventivo: 0,
  critico: 0,
  emergencia: 0
})

const alertasTabla = ref<any[]>([])
const fallasPorSubarea = ref<any[]>([])

function volver() {
  router.back()
}

function normalizarTexto(valor: any) {
  return String(valor || '')
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function formatearTexto(valor: any) {
  return String(valor || '')
    .trim()
    .replaceAll('_', ' ')
}

function calcularConteos() {
  const sensoresPreventivo = new Set<string>()
  const sensoresCritico = new Set<string>()
  const sensoresEmergencia = new Set<string>()

  alertasJson.forEach((alerta: any) => {
    if (alerta.Alarma_Activa !== true) return

    const sensor = String(alerta.Nombre_TAG || alerta.Identificador || 'Sin sensor')
    const nivel = normalizarTexto(alerta.Nivel_Alerta)

    if (nivel.includes('PREVENTIVO')) sensoresPreventivo.add(sensor)
    if (nivel.includes('CRITICO')) sensoresCritico.add(sensor)
    if (nivel.includes('EMERGENCIA')) sensoresEmergencia.add(sensor)
  })

  return {
    preventivo: sensoresPreventivo.size,
    critico: sensoresCritico.size,
    emergencia: sensoresEmergencia.size
  }
}

function generarTablaAlertas() {
  alertasTabla.value = alertasJson
    .filter((alerta: any) => alerta.Alarma_Activa === true)
    .map((alerta: any) => ({
      sensor: alerta.Nombre_TAG || 'Sin sensor',
      equipo: alerta.Sistema_x || alerta.Sistema_y || 'Sin equipo',
      tipo: formatearTexto(alerta.Tipo_Alerta),
      nivel: formatearTexto(alerta.Nivel_Alerta)
    }))
}

function generarFallasPorSubarea() {
  const conteo: Record<string, number> = {}

  alertasJson.forEach((alerta: any) => {
    if (alerta.Alarma_Activa !== true) return

    const subarea = alerta.Subarea_x || alerta.Subarea_y || 'Sin subárea'
    conteo[subarea] = (conteo[subarea] || 0) + 1
  })

  const mayor = Math.max(...Object.values(conteo), 1)

  fallasPorSubarea.value = Object.entries(conteo)
    .map(([nombre, cantidad]) => ({
      nombre,
      cantidad,
      porcentaje: Math.round((cantidad / mayor) * 100)
    }))
    .sort((a, b) => b.cantidad - a.cantidad)
}

function animarNumero(
  clave: 'preventivo' | 'critico' | 'emergencia',
  valorFinal: number,
  duracion = 900
) {
  if (valorFinal === 0) {
    conteosAnimados.value[clave] = 0
    return
  }

  const inicio = performance.now()

  function actualizar(tiempoActual: number) {
    const progreso = Math.min((tiempoActual - inicio) / duracion, 1)
    conteosAnimados.value[clave] = Math.floor(progreso * valorFinal)

    if (progreso < 1) {
      requestAnimationFrame(actualizar)
    } else {
      conteosAnimados.value[clave] = valorFinal
    }
  }

  requestAnimationFrame(actualizar)
}

function claseNivel(nivel: string) {
  const nivelNormalizado = normalizarTexto(nivel)

  if (nivelNormalizado.includes('EMERGENCIA')) return 'nivel-emergencia'
  if (nivelNormalizado.includes('CRITICO')) return 'nivel-critico'
  if (nivelNormalizado.includes('PREVENTIVO')) return 'nivel-preventivo'

  return 'nivel-sin-alerta'
}

function cargarDashboard() {
  const conteosFinales = calcularConteos()

  conteosAnimados.value = {
    preventivo: 0,
    critico: 0,
    emergencia: 0
  }

  animarNumero('preventivo', conteosFinales.preventivo)
  animarNumero('critico', conteosFinales.critico)
  animarNumero('emergencia', conteosFinales.emergencia)

  generarTablaAlertas()
  generarFallasPorSubarea()
}

onMounted(() => {
  cargarDashboard()
})
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  padding: 28px 30px 40px;
  background: #f8fafc;
}

.barra-superior {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.flecha-volver {
  background: transparent;
  border: none;
  font-size: 42px;
  font-weight: bold;
  color: black;
  cursor: pointer;
  line-height: 1;
}

.estado-linea {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #86efac;
  padding: 12px 24px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 17px;
}

.encabezado {
  margin-bottom: 35px;
}

.encabezado h1 {
  color: #005494;
  font-size: 38px;
  font-weight: 900;
  margin: 0;
}

.encabezado p {
  color: #334155;
  font-size: 18px;
  margin-top: 10px;
}

.contenedor-kpis {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-bottom: 32px;
}

.kpi-card {
  background: white;
  border-radius: 16px;
  padding: 24px 28px;
  min-height: 80px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.kpi-label {
  color: #334155;
  font-size: 16px;
  font-weight: 900;
  margin-bottom: 12px;
}

.kpi-card h2 {
  font-size: 42px;
  font-weight: 900;
  margin: 0;
  line-height: 1;
}

.kpi-card h2.cero {
  color: black;
}

.preventivo {
  border: 2px solid #facc15;
}

.preventivo h2 {
  color: #facc15;
}

.critico {
  border: 2px solid #f97316;
}

.critico h2 {
  color: #f97316;
}

.emergencia {
  border: 2px solid #dc2626;
}

.emergencia h2 {
  color: #dc2626;
}

.zona-inferior {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  align-items: stretch;
}

.panel-tabla,
.panel-subareas {
  background: white;
  border: 2px solid #d1d5db;
  border-radius: 16px;
  padding: 22px;
  height: 500px;
  box-sizing: border-box;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.07);
}

.cabecera-tabla,
.cabecera-subareas {
  height: 36px;
  margin-bottom: 18px;
}

.cabecera-tabla h2,
.cabecera-subareas h2 {
  color: #005494;
  font-size: 24px;
  margin: 0;
}

.contenedor-tabla {
  max-height: 390px;
  overflow-y: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  position: sticky;
  top: 0;
  background: #005494;
  z-index: 1;
}

th {
  color: white;
  text-align: left;
  padding: 13px 14px;
  font-size: 14px;
}

td {
  padding: 13px 14px;
  border-bottom: 1px solid #e5e7eb;
  color: #1e293b;
  font-size: 14px;
  font-weight: 600;
}

.badge-nivel {
  padding: 6px 12px;
  border-radius: 999px;
  color: white;
  font-weight: 900;
  font-size: 12px;
}

.nivel-preventivo {
  background: #facc15;
  color: #1f2937;
}

.nivel-critico {
  background: #f97316;
}

.nivel-emergencia {
  background: #dc2626;
}

.nivel-sin-alerta {
  background: #64748b;
}

.lista-subareas {
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-height: 390px;
  overflow-y: auto;
  padding-right: 8px;
}

.fila-subarea {
  display: grid;
  grid-template-columns: 170px 1fr 40px;
  align-items: center;
  gap: 14px;
}

.nombre-subarea {
  color: #334155;
  font-weight: 900;
}

.barra-contenedor {
  height: 18px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.barra-progreso {
  height: 100%;
  border-radius: 999px;
  transition: width 0.8s ease;
}

.color-0 {
  background: #dc2626;
}

.color-1 {
  background: #f97316;
}

.color-2 {
  background: #facc15;
}

.color-3 {
  background: #005494;
}

.color-4 {
  background: #2563eb;
}

.fila-subarea strong {
  color: #1e293b;
  font-size: 16px;
}

@media (max-width: 1100px) {
  .zona-inferior {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .contenedor-kpis {
    grid-template-columns: 1fr;
  }
}
</style>